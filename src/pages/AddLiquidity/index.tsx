import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import { Currency, ETHER, TokenAmount, TradeType } from '@s-one-finance/sdk-core'
import React, { useCallback, useMemo, useState } from 'react'
import { ArrowDown, ChevronDown, ChevronUp, Plus } from 'react-feather'
import ReactGA from 'react-ga'
import { RouteComponentProps } from 'react-router-dom'
import { Text } from 'rebass'
import { ButtonError, ButtonPrimary } from '../../components/Button'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../components/TransactionConfirmationModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import Row, { AutoRow, RowBetween, RowFixed, RowFlat } from '../../components/Row'

import { INITIAL_ALLOWED_SLIPPAGE, ONE_BIPS, ROUTER_ADDRESS } from '../../constants'
import { PairState } from '../../data/Reserves'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import useTransactionDeadline from '../../hooks/useTransactionDeadline'
import { useToggleSettingsMenu, useWalletModalToggle } from '../../state/application/hooks'
import { Field } from '../../state/mint/actions'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from '../../state/mint/hooks'

import { useTransactionAdder } from '../../state/transactions/hooks'
import { useIsExpertMode, useShowTransactionDetailsManager, useUserSlippageTolerance } from '../../state/user/hooks'
import { TYPE } from '../../theme'
import { calculateGasMargin, calculateSlippageAmount, getRouterContract } from '../../utils'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { unwrappedToken, wrappedCurrency } from '../../utils/wrappedCurrency'
import AppBody from '../AppBody'
import { ClickableText, Dots, Wrapper } from '../Pool/styleds'
import { ConfirmAddModalBottom } from './ConfirmAddModalBottom'
import { currencyId } from '../../utils/currencyId'
import { useIsTransactionUnsupported } from 'hooks/Trades'
import { TransactionType } from '../../state/transactions/types'
import useTheme from '../../hooks/useTheme'
import AppBodyTitleDescriptionSettings from '../../components/AppBodyTitleDescriptionSettings'
import { ArrowWrapper, TruncatedText } from '../../components/swap/styleds'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import styled from 'styled-components'
import { QuestionHelper1416 } from '../../components/QuestionHelper'
import TradePrice from '../../components/swap/TradePrice'
import { InfoLink } from '../../components/swap/AdvancedSwapDetailsContent'
import AddLiquidityMode from './AddLiquidityMode'
import CurrencyLogo from '../../components/CurrencyLogo'

const ButtonWrapper = styled.div<{ hasTrade?: boolean }>`
  margin: ${({ hasTrade }) => (hasTrade ? '17.5px 0' : '35px 0 0 0')};

  ${({ theme, hasTrade }) => theme.mediaWidth.upToExtraSmall`
    margin: ${hasTrade ? '17.5px 0' : '20px 0 0 0'};
  `}
`

export default function AddLiquidity({
  match: {
    params: { currencyIdA, currencyIdB }
  },
  history
}: RouteComponentProps<{ currencyIdA?: string; currencyIdB?: string }>) {
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const mobile13Desktop16 = isUpToExtraSmall ? 13 : 16

  // Show transaction details.
  const [isShowTransactionDetails, toggleIsShowTransactionDetails] = useShowTransactionDetailsManager()

  // Show price invert or not.
  const [showInverted, setShowInverted] = useState<boolean>(false)

  const { account, chainId, library } = useActiveWeb3React()
  const theme = useTheme()

  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  const toggleWalletModal = useWalletModalToggle() // toggle wallet when disconnected

  const toggleSettings = useToggleSettingsMenu()
  const expertMode = useIsExpertMode()

  // mint state
  const { independentField, typedValue, otherTypedValue } = useMintState()
  const {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)

  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)

  const isValid = !error

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm

  // txn values
  const deadline = useTransactionDeadline() // custom from users settings
  const [allowedSlippage] = useUserSlippageTolerance() // custom from users
  const [txHash, setTxHash] = useState<string>('')

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? ''
  }

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field])
      }
    },
    {}
  )

  const atMaxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0')
      }
    },
    {}
  )

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_A], ROUTER_ADDRESS)
  const [approvalB, approveBCallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_B], ROUTER_ADDRESS)

  const addTransaction = useTransactionAdder()

  async function onAdd() {
    if (!chainId || !library || !account) return
    const router = getRouterContract(chainId, library, account)

    const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts
    if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB || !deadline) {
      return
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? 0 : allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? 0 : allowedSlippage)[0]
    }

    let estimate,
      method: (...args: any) => Promise<TransactionResponse>,
      args: Array<string | string[] | number>,
      value: BigNumber | null
    if (currencyA === ETHER || currencyB === ETHER) {
      const tokenBIsETH = currencyB === ETHER
      estimate = router.estimateGas.addLiquidityETH
      method = router.addLiquidityETH
      args = [
        wrappedCurrency(tokenBIsETH ? currencyA : currencyB, chainId)?.address ?? '', // token
        (tokenBIsETH ? parsedAmountA : parsedAmountB).raw.toString(), // token desired
        amountsMin[tokenBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(), // token min
        amountsMin[tokenBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(), // eth min
        account,
        deadline.toHexString()
      ]
      value = BigNumber.from((tokenBIsETH ? parsedAmountB : parsedAmountA).raw.toString())
    } else {
      estimate = router.estimateGas.addLiquidity
      method = router.addLiquidity
      args = [
        wrappedCurrency(currencyA, chainId)?.address ?? '',
        wrappedCurrency(currencyB, chainId)?.address ?? '',
        parsedAmountA.raw.toString(),
        parsedAmountB.raw.toString(),
        amountsMin[Field.CURRENCY_A].toString(),
        amountsMin[Field.CURRENCY_B].toString(),
        account,
        deadline.toHexString()
      ]
      value = null
    }

    setAttemptingTxn(true)
    await estimate(...args, value ? { value } : {})
      .then(estimatedGasLimit =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit)
        }).then(response => {
          setAttemptingTxn(false)

          addTransaction(response, {
            summary: {
              type: TransactionType.ADD,
              token0Amount: parsedAmounts[Field.CURRENCY_A]?.toSignificant(3),
              token0Symbol: currencies[Field.CURRENCY_A]?.symbol,
              token1Amount: parsedAmounts[Field.CURRENCY_B]?.toSignificant(3),
              token1Symbol: currencies[Field.CURRENCY_B]?.symbol
            }
          })

          setTxHash(response.hash)

          ReactGA.event({
            category: 'Liquidity',
            action: 'Add',
            label: [currencies[Field.CURRENCY_A]?.symbol, currencies[Field.CURRENCY_B]?.symbol].join('/')
          })
        })
      )
      .catch(error => {
        setAttemptingTxn(false)
        // we only care if the error is something _other_ than the user rejected the tx
        if (error?.code !== 4001) {
          console.error(error)
        }
      })
  }

  const modalHeader = useCallback(() => {
    return (
      <AutoColumn gap={isUpToExtraSmall ? '10px' : '15px'} style={{ marginTop: '20px' }}>
        <RowBetween align="flex-end">
          <RowFixed gap={'0px'}>
            <TruncatedText fontSize={isUpToExtraSmall ? '20px' : '28px'} fontWeight={600}>
              123,456,789
            </TruncatedText>
          </RowFixed>
          {/* zIndex để hiển thị đè lên SwapVector. */}
          <RowFixed gap={'0px'} style={{ height: '100%', zIndex: 1 }} align={'center'}>
            <CurrencyLogo currency={currencies[Field.CURRENCY_A]} size={'24px'} style={{ marginRight: '5px' }} />
            <Text fontSize={isUpToExtraSmall ? 16 : 24} fontWeight={500}>
              {currencies[Field.CURRENCY_A]?.symbol}
            </Text>
          </RowFixed>
        </RowBetween>
        <RowFixed>
          <Plus size="20" color={theme.text2} style={{ minWidth: '16px' }} />
        </RowFixed>
        <RowBetween align="flex-end">
          <RowFixed gap={'0px'}>
            <TruncatedText fontSize={isUpToExtraSmall ? '20px' : '28px'} fontWeight={600}>
              987,654,321
            </TruncatedText>
          </RowFixed>
          <RowFixed gap={'0px'} style={{ height: '100%' }} align={'center'}>
            <CurrencyLogo currency={currencies[Field.CURRENCY_B]} size={'24px'} style={{ marginRight: '5px' }} />
            <Text fontSize={isUpToExtraSmall ? 16 : 24} fontWeight={500}>
              {currencies[Field.CURRENCY_B]?.symbol}
            </Text>
          </RowFixed>
        </RowBetween>
        {/*askdjlkdsajlksajlsadjlsajdlk */}
        {/*<RowFlat>*/}
        {/*  <Text fontSize="48px" fontWeight={500} lineHeight="42px" marginRight={10}>*/}
        {/*    {liquidityMinted?.toSignificant(6)}*/}
        {/*  </Text>*/}
        {/*  <DoubleCurrencyLogo*/}
        {/*    currency0={currencies[Field.CURRENCY_A]}*/}
        {/*    currency1={currencies[Field.CURRENCY_B]}*/}
        {/*    size={30}*/}
        {/*  />*/}
        {/*</RowFlat>*/}
        {/*<Row>*/}
        {/*  <Text fontSize="24px">*/}
        {/*    {currencies[Field.CURRENCY_A]?.symbol + '/' + currencies[Field.CURRENCY_B]?.symbol + ' Pool Tokens'}*/}
        {/*  </Text>*/}
        {/*</Row>*/}
        {/*<TYPE.italic fontSize={12} textAlign="left" padding={'8px 0 0 0 '}>*/}
        {/*  {`Output is estimated. If the price changes by more than ${allowedSlippage /*/}
        {/*    100}% your transaction will revert.`}*/}
        {/*</TYPE.italic>*/}
      </AutoColumn>
    )
  }, [currencies, theme, isUpToExtraSmall])

  const modalBottom = () => {
    return (
      <ConfirmAddModalBottom
        price={price}
        currencies={currencies}
        parsedAmounts={parsedAmounts}
        noLiquidity={noLiquidity}
        onAdd={onAdd}
        poolTokenPercentage={poolTokenPercentage}
      />
    )
  }

  const pendingText = `Supplying ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)} ${
    currencies[Field.CURRENCY_A]?.symbol
  } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)} ${currencies[Field.CURRENCY_B]?.symbol}`

  const handleCurrencyASelect = useCallback(
    (currencyA: Currency) => {
      const newCurrencyIdA = currencyId(currencyA)
      if (newCurrencyIdA === currencyIdB) {
        history.push(`/add/${currencyIdB}/${currencyIdA}`)
      } else {
        history.push(`/add/${newCurrencyIdA}/${currencyIdB}`)
      }
    },
    [currencyIdB, history, currencyIdA]
  )
  const handleCurrencyBSelect = useCallback(
    (currencyB: Currency) => {
      const newCurrencyIdB = currencyId(currencyB)
      if (currencyIdA === newCurrencyIdB) {
        if (currencyIdB) {
          history.push(`/add/${currencyIdB}/${newCurrencyIdB}`)
        } else {
          history.push(`/add/${newCurrencyIdB}`)
        }
      } else {
        history.push(`/add/${currencyIdA ? currencyIdA : 'ETH'}/${newCurrencyIdB}`)
      }
    },
    [currencyIdA, history, currencyIdB]
  )

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('')
    }
    setTxHash('')
  }, [onFieldAInput, txHash])

  const addIsUnsupported = useIsTransactionUnsupported(currencies?.CURRENCY_A, currencies?.CURRENCY_B)

  const isPairFilledAndValid = useMemo(
    () => currencies[Field.CURRENCY_A] && currencies[Field.CURRENCY_B] && pairState !== PairState.INVALID,
    [currencies, pairState]
  )

  return (
    <>
      <AppBody>
        <AppBodyTitleDescriptionSettings transactionType={TransactionType.ADD} />
        <AddLiquidityMode />
        <Wrapper>
          <TransactionConfirmationModal
            isOpen={showConfirm}
            onDismiss={handleDismissConfirmation}
            attemptingTxn={attemptingTxn}
            hash={txHash}
            content={() => (
              <ConfirmationModalContent
                title="Confirm Add Liquidity"
                onDismiss={handleDismissConfirmation}
                topContent={modalHeader}
                bottomContent={modalBottom}
                transactionType={TransactionType.ADD}
              />
            )}
            pendingText={pendingText}
            currencyToAdd={pair?.liquidityToken}
          />
          <AutoColumn gap={'md'}>
            <CurrencyInputPanel
              value={formattedAmounts[Field.CURRENCY_A]}
              onUserInput={onFieldAInput}
              onMax={() => {
                onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
              }}
              onCurrencySelect={handleCurrencyASelect}
              showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
              currency={currencies[Field.CURRENCY_A]}
              id="add-liquidity-input-tokena"
              showCommonBases
            />
            <AutoColumn justify="space-between">
              <AutoRow justify={'center'}>
                <ArrowWrapper clickable>
                  <Plus size={isUpToExtraSmall ? '14' : '22'} color={theme.text1Sone} />
                </ArrowWrapper>
              </AutoRow>
            </AutoColumn>
            <CurrencyInputPanel
              value={formattedAmounts[Field.CURRENCY_B]}
              onUserInput={onFieldBInput}
              onCurrencySelect={handleCurrencyBSelect}
              onMax={() => {
                onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
              }}
              showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
              currency={currencies[Field.CURRENCY_B]}
              id="add-liquidity-input-tokenb"
              showCommonBases
            />
          </AutoColumn>
          <ButtonWrapper>
            {addIsUnsupported ? (
              <ButtonPrimary disabled={true}>
                <TYPE.main mb="4px">Unsupported Asset</TYPE.main>
              </ButtonPrimary>
            ) : !account ? (
              <ButtonPrimary onClick={toggleWalletModal}>Connect Wallet</ButtonPrimary>
            ) : (
              <AutoColumn gap={'md'}>
                {(approvalA === ApprovalState.NOT_APPROVED ||
                  approvalA === ApprovalState.PENDING ||
                  approvalB === ApprovalState.NOT_APPROVED ||
                  approvalB === ApprovalState.PENDING) &&
                  isValid && (
                    <RowBetween>
                      {approvalA !== ApprovalState.APPROVED && (
                        <ButtonPrimary
                          onClick={approveACallback}
                          disabled={approvalA === ApprovalState.PENDING}
                          width={approvalB !== ApprovalState.APPROVED ? '48%' : '100%'}
                        >
                          {approvalA === ApprovalState.PENDING ? (
                            <Dots>Approving {currencies[Field.CURRENCY_A]?.symbol}</Dots>
                          ) : (
                            'Approve ' + currencies[Field.CURRENCY_A]?.symbol
                          )}
                        </ButtonPrimary>
                      )}
                      {approvalB !== ApprovalState.APPROVED && (
                        <ButtonPrimary
                          onClick={approveBCallback}
                          disabled={approvalB === ApprovalState.PENDING}
                          width={approvalA !== ApprovalState.APPROVED ? '48%' : '100%'}
                        >
                          {approvalB === ApprovalState.PENDING ? (
                            <Dots>Approving {currencies[Field.CURRENCY_B]?.symbol}</Dots>
                          ) : (
                            'Approve ' + currencies[Field.CURRENCY_B]?.symbol
                          )}
                        </ButtonPrimary>
                      )}
                    </RowBetween>
                  )}
                <ButtonError
                  onClick={() => {
                    expertMode ? onAdd() : setShowConfirm(true)
                  }}
                  disabled={!isValid || approvalA !== ApprovalState.APPROVED || approvalB !== ApprovalState.APPROVED}
                  error={!isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]}
                >
                  <Text fontSize={20} fontWeight={500}>
                    {error ?? 'Add Liquidity'}
                  </Text>
                </ButtonError>
              </AutoColumn>
            )}
          </ButtonWrapper>
          {isPairFilledAndValid && !isShowTransactionDetails && (
            <ColumnCenter style={{ marginTop: '17.5px' }}>
              <ClickableText
                fontSize={mobile13Desktop16}
                fontWeight={500}
                color={theme.text5Sone}
                onClick={toggleIsShowTransactionDetails}
              >
                Show more information <ChevronDown size={12} />
              </ClickableText>
            </ColumnCenter>
          )}
          {isPairFilledAndValid && isShowTransactionDetails ? (
            <>
              <AutoColumn gap={'15px'} style={{ width: '100%', padding: '17.5px 8px 0' }}>
                <RowBetween>
                  <RowFixed>
                    <Text fontWeight={500} fontSize={mobile13Desktop16} color={theme.text4Sone}>
                      Price
                    </Text>
                    <QuestionHelper1416 text="Lorem ipsum dolor sit amet." />
                  </RowFixed>
                  <TradePrice price={price} showInverted={showInverted} setShowInverted={setShowInverted} />
                </RowBetween>
                {allowedSlippage !== INITIAL_ALLOWED_SLIPPAGE && (
                  <RowBetween align="center">
                    <RowFixed>
                      <ClickableText
                        fontWeight={500}
                        fontSize={mobile13Desktop16}
                        color={theme.text4Sone}
                        onClick={toggleSettings}
                      >
                        Slippage Tolerance
                      </ClickableText>
                      <QuestionHelper1416 text="Lorem ipsum" />
                    </RowFixed>
                    <ClickableText
                      fontWeight={700}
                      fontSize={mobile13Desktop16}
                      color={theme.text6Sone}
                      onClick={toggleSettings}
                    >
                      {allowedSlippage / 100}%
                    </ClickableText>
                  </RowBetween>
                )}
                <RowBetween>
                  <RowFixed>
                    <Text fontWeight={500} fontSize={mobile13Desktop16} color={theme.text4Sone}>
                      Share of Pair
                    </Text>
                    <QuestionHelper1416 text="Lorem ipsum dolor sit amet." />
                  </RowFixed>
                  <Text fontWeight={700} fontSize={mobile13Desktop16} color={theme.text6Sone}>
                    {noLiquidity && price
                      ? '100'
                      : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'}
                    %
                  </Text>
                </RowBetween>
              </AutoColumn>
              {pair?.liquidityToken.address && (
                <ColumnCenter style={{ marginTop: isUpToExtraSmall ? '25px' : '35px' }}>
                  <InfoLink href={'https://info.uniswap.org/pair/' + pair.liquidityToken.address} target="_blank">
                    View {unwrappedToken(pair.token0).symbol} - {unwrappedToken(pair.token1).symbol} analytics
                  </InfoLink>
                </ColumnCenter>
              )}
            </>
          ) : (
            isShowTransactionDetails &&
            allowedSlippage !== INITIAL_ALLOWED_SLIPPAGE && (
              <RowBetween align="center" padding="17.5px 8px 0">
                <RowFixed>
                  <ClickableText
                    fontWeight={500}
                    fontSize={mobile13Desktop16}
                    color={theme.text4Sone}
                    onClick={toggleSettings}
                  >
                    Slippage Tolerance
                  </ClickableText>
                  <QuestionHelper1416 text="Lorem ipsum" />
                </RowFixed>
                <ClickableText
                  fontWeight={700}
                  fontSize={mobile13Desktop16}
                  color={theme.text6Sone}
                  onClick={toggleSettings}
                >
                  {allowedSlippage / 100}%
                </ClickableText>
              </RowBetween>
            )
          )}
          {isPairFilledAndValid && isShowTransactionDetails && (
            <ColumnCenter>
              <ClickableText
                marginTop="17.5px"
                fontSize={mobile13Desktop16}
                fontWeight={500}
                color={theme.text5Sone}
                onClick={toggleIsShowTransactionDetails}
              >
                Show less <ChevronUp size={12} />
              </ClickableText>
            </ColumnCenter>
          )}
        </Wrapper>
      </AppBody>
    </>
  )
}
