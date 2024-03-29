import { ChainId, Currency, CurrencyAmount, JSBI, Token, Trade } from '@s-one-finance/sdk-core'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, ChevronDown, ChevronUp } from 'react-feather'
import ReactGA from 'react-ga'
import { Text } from 'rebass'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import AddressInputPanel from '../../components/AddressInputPanel'
import { ButtonConfirmed, ButtonError, ButtonPrimary } from '../../components/Button'
import Card from '../../components/Card'
import Column, { AutoColumn, ColumnCenter } from '../../components/Column'
import ConfirmSwapModal from '../../components/swap/ConfirmSwapModal'
import PanelCurrencyInput from '../../components/PanelCurrencyInput'
import { AutoRow, RowBetween, RowFixed } from '../../components/Row'
import AdvancedSwapDetails from '../../components/swap/AdvancedSwapDetails'
import BetterTradeLink, { DefaultVersionLink } from '../../components/swap/BetterTradeLink'
import confirmPriceImpactWithoutFee from '../../components/swap/confirmPriceImpactWithoutFee'
import { BottomGrouping, IconWrapper, SwapCallbackError } from '../../components/swap/styleds'
import TradePrice from '../../components/swap/TradePrice'
import TokenWarningModal from '../../components/TokenWarningModal'
import ProgressSteps from '../../components/ProgressSteps'
import AppBodyTitleDescriptionSettings from '../../components/AppBodyTitleDescriptionSettings'
import {
  useExpertModeManager,
  useGuideStepManager,
  useShowTransactionDetailsManager,
  useUserSingleHopOnly,
  useUserSlippageTolerance
} from '../../state/user/hooks'

import { DEFAULT_CHAIN_ID, INITIAL_ALLOWED_SLIPPAGE, REFERRAL_STATUS, SONE } from '../../constants'
import { getTradeVersion } from '../../data/V1'
import { useSwapCallback } from '../../hooks/useSwapCallback'
import useToggledVersion, { DEFAULT_VERSION, Version } from '../../hooks/useToggledVersion'
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback'
import { useWalletModalToggle } from '../../state/application/hooks'
import { Field } from '../../state/swap/actions'
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState
} from '../../state/swap/hooks'
import { LinkStyledButton, StyledPadding, TYPE } from '../../theme'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { computeTradePriceBreakdown, warningSeverity } from '../../utils/prices'
import { AppBody } from 'theme/components'
import { ClickableText } from '../Pool/styleds'
import Loader from '../../components/Loader'
import { useIsTransactionUnsupported } from 'hooks/Trades'
import UnsupportedCurrencyFooter from 'components/swap/UnsupportedCurrencyFooter'
import { isTradeBetter } from 'utils/trades'
import { RouteComponentProps } from 'react-router-dom'
import { QuestionHelper1416 } from '../../components/QuestionHelper'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import { useAllTokens, useCurrency } from '../../hooks/Tokens'
import { useActiveWeb3React } from '../../hooks'
import useENSAddress from '../../hooks/useENSAddress'
import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback'
import useTheme from '../../hooks/useTheme'
import { TransactionType } from '../../state/transactions/types'
import {
  useAccountIsReferrerAndSavedReferralCodeIsOfThisAccount,
  useIsAccountReferred,
  useIsReferralWorksOnCurrentNetwork,
  useReferral
} from '../../state/referral/hooks'
import { OpenGuide, SwapStep1, SwapStep3, SwapStep4, SwapStep5 } from '../../components/lib/mark/components'
import WeeklyRanking from '../../components/WeeklyRanking'
import TabSwapLiquidity from '../../components/TabSwapLiquidity'
import BrandIdentitySoneForMobile from '../../components/BrandIdentitySoneForMobile'

export const ResponsiveAutoColumn = styled(AutoColumn)`
  padding: 23px 14px 0;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 5.5px 8px 0;
    grid-row-gap: 10px;
  `}
`

export default function Swap({ history }: RouteComponentProps) {
  const { t } = useTranslation()
  const [guideStep] = useGuideStepManager()

  // For Styling Responsive.
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const mobile13Desktop16 = isUpToExtraSmall ? 13 : 16
  const mobile16Desktop22 = isUpToExtraSmall ? 16 : 22

  const loadedUrlParams = useDefaultsFromURLSearch()

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId)
  ]
  const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false)
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  )

  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true)
  }, [])

  // dismiss warning if all imported tokens are in active lists
  const defaultTokens = useAllTokens()
  const importTokensNotInDefault =
    urlLoadedTokens &&
    urlLoadedTokens.filter((token: Token) => {
      return !Boolean(token.address in defaultTokens)
    })

  const { account, chainId } = useActiveWeb3React()
  const theme = useTheme()

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()

  // for expert mode
  const [isExpertMode] = useExpertModeManager()

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()

  // Show transaction details.
  const [isShowTransactionDetails, toggleIsShowTransactionDetails] = useShowTransactionDetailsManager()

  // swap state
  const { independentField, typedValue, recipient } = useSwapState()
  const {
    v1Trade,
    v2Trade,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError
  } = useDerivedSwapInfo()

  const { wrapType, execute: _onWrap, inputError: wrapInputError } = useWrapCallback(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT],
    typedValue
  )
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const { address: recipientAddress } = useENSAddress(recipient)
  const toggledVersion = useToggledVersion()
  const tradesByVersion = {
    [Version.v1]: v1Trade,
    [Version.v2]: v2Trade
  }
  const trade = showWrap ? undefined : tradesByVersion[toggledVersion]
  const defaultTrade = showWrap ? undefined : tradesByVersion[DEFAULT_VERSION]

  // Liquidity Provider Fee
  const { realizedLPFee } = computeTradePriceBreakdown(trade)

  const betterTradeLinkV2: Version | undefined =
    toggledVersion === Version.v1 && isTradeBetter(v1Trade, v2Trade) ? Version.v2 : undefined

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount
      }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount
      }

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()
  const isValid = !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput]
  )

  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput]
  )

  const onWrap = useCallback(async () => {
    if (_onWrap) {
      const done = await _onWrap().then()
      if (done) handleTypeInput('')
    }
  }, [_onWrap, handleTypeInput])

  // reset if they close warning without tokens in params
  const handleDismissTokenWarning = useCallback(() => {
    setDismissTokenWarning(true)
    history.push('/swap/')
  }, [history])

  // modal and loading
  const [{ showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    showConfirm: boolean
    tradeToConfirm: Trade | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined
  })

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? ''
  }

  const route = trade?.route
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  )
  const noRoute = !route

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage)

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(trade, allowedSlippage, recipient)

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade)

  const [singleHopOnly] = useUserSingleHopOnly()

  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee)) {
      return
    }
    if (!swapCallback) {
      return
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: undefined })
    swapCallback()
      .then(hash => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: hash })

        ReactGA.event({
          category: 'Swap',
          action:
            recipient === null
              ? 'Swap w/o Send'
              : (recipientAddress ?? recipient) === account
              ? 'Swap w/o Send + recipient'
              : 'Swap w/ Send',
          label: [
            trade?.inputAmount?.currency?.symbol,
            trade?.outputAmount?.currency?.symbol,
            getTradeVersion(trade)
          ].join('/')
        })

        ReactGA.event({
          category: 'Routing',
          action: singleHopOnly ? 'Swap with multihop disabled' : 'Swap with multihop enabled'
        })
      })
      .catch(error => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: undefined,
          txHash: undefined
        })
      })
  }, [
    priceImpactWithoutFee,
    swapCallback,
    tradeToConfirm,
    showConfirm,
    recipient,
    recipientAddress,
    account,
    trade,
    singleHopOnly
  ])

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false)

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode)

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ showConfirm: false, tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn, showConfirm })
  }, [attemptingTxn, showConfirm, swapErrorMessage, trade, txHash])

  const handleInputSelect = useCallback(
    inputCurrency => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency)
    },
    [onCurrencySelection]
  )

  const handleMaxInput = useCallback(() => {
    maxAmountInput && onUserInput(Field.INPUT, maxAmountInput.toExact())
  }, [maxAmountInput, onUserInput])

  const handleOutputSelect = useCallback(outputCurrency => onCurrencySelection(Field.OUTPUT, outputCurrency), [
    onCurrencySelection
  ])

  const swapIsUnsupported = useIsTransactionUnsupported(currencies?.INPUT, currencies?.OUTPUT)

  // Từ code mà parse ra được id thì code đó valid.
  const { id: isValidCode, code: referralCode, status: referralStatus } = useReferral()
  const isReferralWorksOnCurrentNetwork = useIsReferralWorksOnCurrentNetwork()
  const isAccountReferred = useIsAccountReferred()
  const accountIsReferrerAndSavedReferralCodeIsOfThisAccount = useAccountIsReferrerAndSavedReferralCodeIsOfThisAccount()
  const showReferralCode =
    isReferralWorksOnCurrentNetwork &&
    !isAccountReferred &&
    referralCode !== undefined &&
    !accountIsReferrerAndSavedReferralCodeIsOfThisAccount &&
    referralStatus === REFERRAL_STATUS.ENABLE

  const handleCheckOpenGuide = () => {
    return guideStep.screen === 'swap'
  }

  const swapStep1Ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (swapStep1Ref.current && guideStep.isGuide && guideStep.screen === 'swap' && guideStep.step === 1) {
      swapStep1Ref.current.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' })
    }
  }, [guideStep])

  return (
    <>
      <TokenWarningModal
        isOpen={importTokensNotInDefault.length > 0 && !dismissTokenWarning}
        tokens={importTokensNotInDefault}
        onConfirm={handleConfirmTokenWarning}
        onDismiss={handleDismissTokenWarning}
      />
      <BrandIdentitySoneForMobile />
      <TabSwapLiquidity />
      <AppBody>
        <AppBodyTitleDescriptionSettings transactionType={TransactionType.SWAP} />
        <StyledPadding id="swap-page">
          <ConfirmSwapModal
            isOpen={showConfirm}
            trade={trade}
            originalTrade={tradeToConfirm}
            onAcceptChanges={handleAcceptChanges}
            attemptingTxn={attemptingTxn}
            txHash={txHash}
            recipient={recipient}
            allowedSlippage={allowedSlippage}
            onConfirm={handleSwap}
            swapErrorMessage={swapErrorMessage}
            onDismiss={handleConfirmDismiss}
          />
          <AutoColumn gap="md">
            {handleCheckOpenGuide() && Number(guideStep.step) > 2 ? (
              <SwapStep3>
                <PanelCurrencyInput
                  label={t('from')}
                  value="0.1"
                  showMaxButton={!atMaxAmountInput}
                  currency={Currency.ETHER}
                  onUserInput={handleTypeInput}
                  onMax={handleMaxInput}
                  onCurrencySelect={handleInputSelect}
                  otherCurrency={currencies[Field.OUTPUT]}
                  id="swap-currency-input"
                />
              </SwapStep3>
            ) : (
              <PanelCurrencyInput
                label={t('from')}
                value={formattedAmounts[Field.INPUT]}
                showMaxButton={!atMaxAmountInput}
                currency={currencies[Field.INPUT]}
                onUserInput={handleTypeInput}
                onMax={handleMaxInput}
                onCurrencySelect={handleInputSelect}
                otherCurrency={currencies[Field.OUTPUT]}
                id="swap-currency-input"
              />
            )}
            <AutoRow justify="center">
              <IconWrapper clickable>
                <ArrowDown
                  size={isUpToExtraSmall ? '14' : '22'}
                  onClick={() => {
                    setApprovalSubmitted(false) // reset 2 step UI for approvals
                    onSwitchTokens()
                  }}
                  color={theme.text1Sone}
                />
              </IconWrapper>
            </AutoRow>
            {handleCheckOpenGuide() && Number(guideStep.step) > 3 ? (
              <SwapStep4>
                <PanelCurrencyInput
                  value="181.635"
                  onUserInput={handleTypeOutput}
                  label={t('to')}
                  showMaxButton={false}
                  currency={SONE[chainId ?? (DEFAULT_CHAIN_ID as ChainId)]}
                  onCurrencySelect={handleOutputSelect}
                  otherCurrency={currencies[Field.INPUT]}
                  id="swap-currency-output"
                />
              </SwapStep4>
            ) : (
              <PanelCurrencyInput
                value={formattedAmounts[Field.OUTPUT]}
                onUserInput={handleTypeOutput}
                label={t('to')}
                showMaxButton={false}
                currency={currencies[Field.OUTPUT]}
                onCurrencySelect={handleOutputSelect}
                otherCurrency={currencies[Field.INPUT]}
                id="swap-currency-output"
              />
            )}

            {recipient !== null && !showWrap ? (
              <>
                <AutoRow justify="space-between" style={{ padding: '0 1rem' }}>
                  <IconWrapper clickable={false}>
                    <ArrowDown size="16" color={theme.text2} />
                  </IconWrapper>
                  <LinkStyledButton id="remove-recipient-button" onClick={() => onChangeRecipient(null)}>
                    - {t('Remove send')}
                  </LinkStyledButton>
                </AutoRow>
                <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
              </>
            ) : null}

            {!showWrap && (Boolean(trade) || allowedSlippage !== INITIAL_ALLOWED_SLIPPAGE) && (
              <Card padding={'0'} borderRadius={'20px'}>
                <ResponsiveAutoColumn gap="15px">
                  {Boolean(trade) && (
                    <RowBetween align="center">
                      <RowFixed>
                        <Text fontWeight={500} fontSize={mobile13Desktop16} color={theme.text4Sone}>
                          {t('price')}
                        </Text>
                        <QuestionHelper1416 text={t('question_helper_price')} />
                      </RowFixed>
                      <TradePrice
                        price={trade?.executionPrice}
                        showInverted={showInverted}
                        setShowInverted={setShowInverted}
                      />
                    </RowBetween>
                  )}
                  {allowedSlippage !== INITIAL_ALLOWED_SLIPPAGE && (
                    <RowBetween align="center">
                      <RowFixed>
                        <Text fontWeight={500} fontSize={mobile13Desktop16} color={theme.text4Sone}>
                          {t('slippage_tolerance')}
                        </Text>
                        <QuestionHelper1416 text={t('question_helper_slippage_tolerance')} />
                      </RowFixed>
                      <Text fontWeight={700} fontSize={mobile13Desktop16} color={theme.text6Sone}>
                        {allowedSlippage / 100}%
                      </Text>
                    </RowBetween>
                  )}
                  {Boolean(trade) && (
                    <RowBetween align="center">
                      <RowFixed>
                        <Text fontWeight={500} fontSize={mobile13Desktop16} color={theme.text4Sone}>
                          {t('liquidity_provider_fee')}
                        </Text>
                        <QuestionHelper1416 text={t('question_helper_liquidity_provider_fee')} />
                      </RowFixed>
                      <Text
                        fontWeight={700}
                        fontSize={mobile13Desktop16}
                        color={theme.text6Sone}
                        style={{
                          justifyContent: 'center',
                          alignItems: 'baseline',
                          display: 'flex',
                          whiteSpace: 'break-spaces'
                        }}
                      >
                        {realizedLPFee ? (
                          <>
                            {realizedLPFee.toSignificant(4)}{' '}
                            <Text fontSize={13}>{trade?.inputAmount?.currency?.symbol}</Text>
                          </>
                        ) : (
                          '-'
                        )}
                      </Text>
                    </RowBetween>
                  )}
                  {showReferralCode && (
                    <RowBetween align="center">
                      <RowFixed>
                        <Text fontWeight={500} fontSize={mobile13Desktop16} color={theme.text4Sone}>
                          {t('referral_id')}
                        </Text>
                        <QuestionHelper1416 text={t('question_helper_referral_id')} />
                      </RowFixed>
                      <Text fontWeight={700} fontSize={mobile13Desktop16} color={theme.text6Sone}>
                        {isValidCode === undefined ? ' (Invalid data)' : referralCode}
                      </Text>
                    </RowBetween>
                  )}
                </ResponsiveAutoColumn>
              </Card>
            )}
          </AutoColumn>
          {/* Nếu không có thông tin trade thì để margin nhỏ (theo design). */}
          <BottomGrouping hasTrade={Boolean(trade)}>
            {/* Check guide popup */}
            {handleCheckOpenGuide() ? (
              <>
                {Number(guideStep.step) === 1 ? (
                  <SwapStep1>
                    <ButtonPrimary ref={swapStep1Ref}>{t('connect_wallet')}</ButtonPrimary>
                  </SwapStep1>
                ) : (
                  Number(guideStep.step) > 1 && (
                    <SwapStep5>
                      <ButtonPrimary className={`${Number(guideStep.step) > 1 ? 'step-5' : ''}`}>
                        {t('swap_verb')}
                      </ButtonPrimary>
                    </SwapStep5>
                  )
                )}
              </>
            ) : swapIsUnsupported ? (
              <ButtonPrimary disabled={true}>
                <TYPE.main mb="4px">{t('Unsupported Asset')}</TYPE.main>
              </ButtonPrimary>
            ) : !account ? (
              <ButtonPrimary onClick={toggleWalletModal}>{t('connect_wallet')}</ButtonPrimary>
            ) : showWrap ? (
              <ButtonPrimary disabled={Boolean(wrapInputError)} onClick={onWrap}>
                {wrapInputError ??
                  (wrapType === WrapType.WRAP ? t('Wrap') : wrapType === WrapType.UNWRAP ? t('Unwrap') : null)}
              </ButtonPrimary>
            ) : noRoute && userHasSpecifiedInputOutput ? (
              <ButtonError disabled>
                <Text fontSize={mobile16Desktop22} fontWeight={700}>
                  {t('insufficient_liquidity_for_this_trade')}
                </Text>
              </ButtonError>
            ) : showApproveFlow ? (
              <RowBetween>
                <ButtonConfirmed
                  onClick={approveCallback}
                  disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                  width="48%"
                  altDisabledStyle={approval === ApprovalState.PENDING} // show solid button while waiting
                  confirmed={approval === ApprovalState.APPROVED}
                >
                  {approval === ApprovalState.PENDING ? (
                    <AutoRow gap="6px" justify="center">
                      {t('approving')} <Loader stroke="white" />
                    </AutoRow>
                  ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                    t('approved')
                  ) : (
                    `${t('approve')} ` + currencies[Field.INPUT]?.symbol
                  )}
                </ButtonConfirmed>
                <ButtonError
                  onClick={() => {
                    if (isExpertMode) {
                      handleSwap()
                    } else {
                      setSwapState({
                        tradeToConfirm: trade,
                        attemptingTxn: false,
                        swapErrorMessage: undefined,
                        showConfirm: true,
                        txHash: undefined
                      })
                    }
                  }}
                  width="48%"
                  id="swap-button"
                  disabled={
                    !isValid || approval !== ApprovalState.APPROVED || (priceImpactSeverity > 3 && !isExpertMode)
                  }
                  error={isValid && priceImpactSeverity > 2}
                >
                  <Text fontSize={mobile16Desktop22} fontWeight={700}>
                    {priceImpactSeverity > 3 && !isExpertMode
                      ? t(`Price Impact High`)
                      : t(`swap${priceImpactSeverity > 2 ? '_anyway' : '_verb'}`)}
                  </Text>
                </ButtonError>
              </RowBetween>
            ) : (
              <ButtonError
                onClick={() => {
                  if (isExpertMode) {
                    handleSwap()
                  } else {
                    setSwapState({
                      tradeToConfirm: trade,
                      attemptingTxn: false,
                      swapErrorMessage: undefined,
                      showConfirm: true,
                      txHash: undefined
                    })
                  }
                }}
                id="swap-button"
                disabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError}
                error={isValid && priceImpactSeverity > 2 && !swapCallbackError}
              >
                <Text fontSize={mobile16Desktop22} fontWeight={700}>
                  {swapInputError
                    ? swapInputError
                    : priceImpactSeverity > 3 && !isExpertMode
                    ? t('price_impact_too_high')
                    : t(`swap${priceImpactSeverity > 2 ? '_anyway' : '_verb'}`)}
                </Text>
              </ButtonError>
            )}
            {showApproveFlow && (
              <Column style={{ marginTop: '1rem' }}>
                <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
              </Column>
            )}
            {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
            {betterTradeLinkV2 && !swapIsUnsupported && toggledVersion === Version.v1 ? (
              <BetterTradeLink version={betterTradeLinkV2} />
            ) : toggledVersion !== DEFAULT_VERSION && defaultTrade ? (
              <DefaultVersionLink />
            ) : null}
          </BottomGrouping>
          {Boolean(trade) && !isShowTransactionDetails && (
            <ColumnCenter>
              <ClickableText
                fontSize={mobile13Desktop16}
                fontWeight={500}
                color={theme.text5Sone}
                onClick={toggleIsShowTransactionDetails}
              >
                {t('show_more_information')} <ChevronDown size={12} />
              </ClickableText>
            </ColumnCenter>
          )}
          {!swapIsUnsupported && isShowTransactionDetails && <AdvancedSwapDetails trade={trade} />}
          {Boolean(trade) && isShowTransactionDetails && (
            <ColumnCenter>
              <ClickableText
                marginTop={'17.5px'}
                fontSize={mobile13Desktop16}
                fontWeight={500}
                color={theme.text5Sone}
                onClick={toggleIsShowTransactionDetails}
              >
                {t('show_less')} <ChevronUp size={12} />
              </ClickableText>
            </ColumnCenter>
          )}
        </StyledPadding>
      </AppBody>
      <WeeklyRanking />
      <OpenGuide screen="swap" />
      {swapIsUnsupported && (
        <UnsupportedCurrencyFooter show={swapIsUnsupported} currencies={[currencies.INPUT, currencies.OUTPUT]} />
      )}
    </>
  )
}
