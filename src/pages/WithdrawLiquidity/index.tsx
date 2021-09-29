import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { AppBody, StyledPadding } from 'theme/components'
import AppBodyTitleDescriptionSettings from '../../components/AppBodyTitleDescriptionSettings'
import { TransactionType } from '../../state/transactions/types'
import PanelSelectPair from '../../components/PanelSelectPair'
import useAddedLiquidityPairs from '../../hooks/useAddedLiquidityPairs'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import PanelWithdrawLiquidityInput from '../../components/PanelCurrencyInputAndSelectPercentage'
import { currencyEquals, ETHER, Pair, Percent, WETH } from '@s-one-finance/sdk-core'
import { wrappedCurrency } from '../../utils/wrappedCurrency'
import { Dots, IconWrapper, TruncatedText } from '../../components/swap/styleds'
import { StyledArrowDown, StyledPlus } from '../../theme'
import Row, { RowBetween, RowFixed } from '../../components/Row'
import PanelCurrencyInput from '../../components/PanelCurrencyInput'
import { Text } from 'rebass'
import { QuestionHelper1416 } from '../../components/QuestionHelper'
import styled from 'styled-components'
import TradePrice from '../../components/swap/TradePrice'
import { ROUTER_ADDRESS } from '../../constants'
import { ButtonPrimary } from '../../components/Button'
import { RouteComponentProps } from 'react-router'
import { useCurrency } from '../../hooks/Tokens'
import { useActiveWeb3React } from '../../hooks'
import useTheme from '../../hooks/useTheme'
import { useBurnActionHandlers, useBurnState, useDerivedBurnInfo } from '../../state/burn/hooks'
import useTransactionDeadline from '../../hooks/useTransactionDeadline'
import { useIsExpertMode } from '../../state/user/hooks'
import { Field } from '../../state/burn/actions'
import { Contract } from '@ethersproject/contracts'
import { usePairContract } from '../../hooks/useContract'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import useIsArgentWallet from '../../hooks/useIsArgentWallet'
import { splitSignature } from '@ethersproject/bytes'
import CurrencyLogo from '../../components/CurrencyLogo'
import { Plus } from 'react-feather'
import ViewPairAnalytics from '../../components/ViewPairAnalytics'
import useWithdrawLiquidityCallback from '../../hooks/useWithdrawLiquidityCallback'
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../components/TransactionConfirmationModal'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import BrandIdentitySoneForMobile from '../../components/BrandIdentitySoneForMobile'
import { useTranslation } from 'react-i18next'

const TextPrice = styled(Text)`
  font-weight: 500;
  font-size: 16px;
  color: ${({ theme }) => theme.text4Sone};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;
  `}
`

const DetailWrapper = styled(AutoColumn)`
  margin-top: 23px;
  padding: 0 14px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-top: 5.5px;
    padding: 0 8px;
  `}
`

const RowButton = styled(Row)`
  margin-top: 23px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-top: 5.5px;
  `}
`

const RowAnalytics = styled(Row)`
  margin-top: 23px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-top: 13px;
  `}
`

const _25 = new Percent('25', '100')
const _50 = new Percent('50', '100')
const _75 = new Percent('75', '100')
const _100 = new Percent('100', '100')

export default function WithdrawLiquidity({
  history,
  match: {
    params: { currencyIdA, currencyIdB }
  }
}: RouteComponentProps<{ currencyIdA: string; currencyIdB: string }>) {
  const [isLoading, addedPairs] = useAddedLiquidityPairs()
  const [showInverted, setShowInverted] = useState(false)

  const [currencyA, currencyB] = [useCurrency(currencyIdA) ?? undefined, useCurrency(currencyIdB) ?? undefined]
  const { account, chainId = 1, library } = useActiveWeb3React()
  const [tokenA, tokenB] = useMemo(() => [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)], [
    currencyA,
    currencyB,
    chainId
  ])

  const { t } = useTranslation()
  const theme = useTheme()
  const isUpToExtraSmall = useIsUpToExtraSmall()

  // burn state
  const { independentField, typedValue } = useBurnState()
  const { pair, parsedAmounts, error } = useDerivedBurnInfo(currencyA ?? undefined, currencyB ?? undefined)

  useEffect(() => {
    if (!pair || !tokenA || !tokenB) return
    if (tokenA.equals(pair.token1) && tokenB.equals(pair.token0)) {
      history.push(`/my-account/withdraw/${currencyIdB}/${currencyIdA}`)
    }
  }, [pair, tokenA, tokenB, currencyIdA, currencyIdB, history])

  const selectedPercentage: '25' | '50' | '75' | '100' | undefined = useMemo(() => {
    const percent = parsedAmounts[Field.LIQUIDITY_PERCENT]
    return percent.equalTo(_25)
      ? '25'
      : percent.equalTo(_50)
      ? '50'
      : percent.equalTo(_75)
      ? '75'
      : percent.equalTo(_100)
      ? '100'
      : undefined
  }, [parsedAmounts])
  const { onUserInput: _onUserInput } = useBurnActionHandlers()
  const isValid = !error

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState(false) // clicked confirm

  // txn values
  const [txHash, setTxHash] = useState<string>('')
  const deadline = useTransactionDeadline()

  const formattedAmounts = {
    [Field.LIQUIDITY_PERCENT]: parsedAmounts[Field.LIQUIDITY_PERCENT].equalTo('0')
      ? '0'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].lessThan(new Percent('1', '100'))
      ? '<1'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0),
    [Field.LIQUIDITY]:
      independentField === Field.LIQUIDITY ? typedValue : parsedAmounts[Field.LIQUIDITY]?.toExact() ?? '',
    [Field.CURRENCY_A]:
      independentField === Field.CURRENCY_A ? typedValue : parsedAmounts[Field.CURRENCY_A]?.toExact() ?? '',
    [Field.CURRENCY_B]:
      independentField === Field.CURRENCY_B ? typedValue : parsedAmounts[Field.CURRENCY_B]?.toExact() ?? ''
  }

  // pair contract
  const pairContract: Contract | null = usePairContract(pair?.liquidityToken?.address)

  // allowance handling
  const [signatureData, setSignatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(null)
  const [approval, approveCallback] = useApproveCallback(parsedAmounts[Field.LIQUIDITY], ROUTER_ADDRESS[chainId])

  const isArgentWallet = useIsArgentWallet()

  async function onAttemptToApprove() {
    if (!pairContract || !pair || !library || !deadline) throw new Error('missing dependencies')
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
    if (!liquidityAmount) throw new Error('missing liquidity amount')

    if (isArgentWallet) {
      return approveCallback()
    }

    // try to gather a signature for permission
    const nonce = await pairContract.nonces(account)

    const EIP712Domain = [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' }
    ]
    const domain = {
      name: 'SoneSwap LP Token V1',
      version: '1',
      chainId: chainId,
      verifyingContract: pair.liquidityToken.address
    }
    const Permit = [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' }
    ]
    const message = {
      owner: account,
      spender: ROUTER_ADDRESS[chainId],
      value: liquidityAmount.raw.toString(),
      nonce: nonce.toHexString(),
      deadline: deadline.toNumber()
    }
    const data = JSON.stringify({
      types: {
        EIP712Domain,
        Permit
      },
      domain,
      primaryType: 'Permit',
      message
    })

    library
      .send('eth_signTypedData_v4', [account, data])
      .then(splitSignature)
      .then(signature => {
        setSignatureData({
          v: signature.v,
          r: signature.r,
          s: signature.s,
          deadline: deadline.toNumber()
        })
      })
      .catch(error => {
        // for all errors other than 4001 (EIP-1193 user rejected request), fall back to manual approve
        if (error?.code !== 4001) {
          approveCallback()
        }
      })
  }

  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      setSignatureData(null)
      return _onUserInput(field, typedValue)
    },
    [_onUserInput]
  )

  const onCurrencyAInput = useCallback((typedValue: string): void => onUserInput(Field.CURRENCY_A, typedValue), [
    onUserInput
  ])
  const onCurrencyBInput = useCallback((typedValue: string): void => onUserInput(Field.CURRENCY_B, typedValue), [
    onUserInput
  ])

  const currencyAIsETH = currencyA === ETHER
  const currencyBIsETH = currencyB === ETHER
  const currencyAIsWETH = Boolean(chainId && currencyA && currencyEquals(WETH[chainId], currencyA))
  const currencyBIsWETH = Boolean(chainId && currencyB && currencyEquals(WETH[chainId], currencyB))
  const oneCurrencyIsETH = currencyAIsETH || currencyBIsETH
  const oneCurrencyIsWETH = currencyAIsWETH || currencyBIsWETH

  const onReceiveWETHToggle = () => {
    if (!chainId || !tokenA || !tokenB) return
    if (!oneCurrencyIsWETH && !oneCurrencyIsETH) {
      throw new Error('None of token is ETH or WETH.')
    }
    if (currencyAIsETH) {
      history.push(`/my-account/withdraw/${WETH[chainId].address}/${tokenB.address}`)
    }
    if (currencyAIsWETH) {
      history.push(`/my-account/withdraw/ETH/${tokenB.address}`)
    }
    if (currencyBIsETH) {
      history.push(`/my-account/withdraw/${tokenA.address}/${WETH[chainId].address}`)
    }
    if (currencyBIsWETH) {
      history.push(`/my-account/withdraw/${tokenA.address}/ETH`)
    }
  }

  const onWithdrawLiquidity = useWithdrawLiquidityCallback({
    currencyA,
    currencyB,
    signatureData,
    setAttemptingTxn,
    setTxHash
  })

  // const LPTokenName = pair?.token0.symbol + '-' + pair?.token1.symbol + ' ' + t('lp_token')
  const LPTokenName = t('lp_token')

  function modalHeader() {
    return (
      <AutoColumn gap={isUpToExtraSmall ? '10px' : '15px'} style={{ marginTop: '20px' }}>
        <RowBetween align="flex-end">
          <TruncatedText fontSize={isUpToExtraSmall ? 20 : 28} fontWeight={600}>
            {parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}
          </TruncatedText>
          <RowFixed gap="0" style={{ height: '100%', zIndex: 1 }} align={'center'}>
            <CurrencyLogo currency={currencyA} size="28px" sizeMobile="16px" style={{ marginRight: '5px' }} />
            <Text fontSize={isUpToExtraSmall ? 16 : 24} fontWeight={500}>
              {currencyA?.symbol}
            </Text>
          </RowFixed>
        </RowBetween>
        <RowFixed>
          <Plus size="20" style={{ minWidth: '16px' }} />
        </RowFixed>
        <RowBetween align="flex-end">
          <TruncatedText fontSize={isUpToExtraSmall ? 20 : 28} fontWeight={600}>
            {parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}
          </TruncatedText>
          <RowFixed gap="0" style={{ height: '100%', zIndex: 1 }} align={'center'}>
            <CurrencyLogo currency={currencyB} size="28px" sizeMobile="16px" style={{ marginRight: '5px' }} />
            <Text fontSize={isUpToExtraSmall ? 16 : 24} fontWeight={500}>
              {currencyB?.symbol}
            </Text>
          </RowFixed>
        </RowBetween>
      </AutoColumn>
    )
  }

  function modalBottom() {
    if (!pair) {
      return null
    }

    return (
      <>
        <AutoColumn gap={isUpToExtraSmall ? '10px' : '15px'}>
          <RowBetween>
            <Text fontWeight={500} fontSize={isUpToExtraSmall ? 13 : 16} color={theme.text4Sone}>
              {t('lp_token_burned')}
            </Text>
            <RowFixed align="baseline">
              <Text fontWeight={700} fontSize={isUpToExtraSmall ? 13 : 16}>
                {parsedAmounts[Field.LIQUIDITY]?.toSignificant(6) ?? 0}
              </Text>
              <Text fontWeight={700} fontSize={13}>
                &nbsp;{LPTokenName}
              </Text>
            </RowFixed>
          </RowBetween>
          <RowBetween>
            <Text fontWeight={500} fontSize={isUpToExtraSmall ? 13 : 16} color={theme.text4Sone}>
              {t('price')}
            </Text>
            <TradePrice
              price={(pair && pair.token0Price) ?? undefined}
              showInverted={showInverted}
              setShowInverted={setShowInverted}
            />
          </RowBetween>
        </AutoColumn>
        <ButtonPrimary
          onClick={onWithdrawLiquidity}
          disabled={!(approval === ApprovalState.APPROVED || signatureData !== null)}
        >
          <Text fontSize={isUpToExtraSmall ? 16 : 20} fontWeight={700}>
            {t('withdraw_liquidity')}
          </Text>
        </ButtonPrimary>
      </>
    )
  }

  const expertMode = useIsExpertMode()

  const pendingText = t('removing_123_eth_and_456_sone', {
    token0Amount: parsedAmounts[Field.CURRENCY_A]?.toSignificant(6),
    token0Symbol: currencyA?.symbol,
    token1Amount: parsedAmounts[Field.CURRENCY_B]?.toSignificant(6),
    token1Symbol: currencyB?.symbol
  })

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.LIQUIDITY_PERCENT, '0')
    }
    setTxHash('')
  }, [onUserInput, txHash])

  const onPairSelect = (pair: Pair) => {
    if (!chainId) return
    history.push(
      `/my-account/withdraw/${pair.token0.equals(WETH[chainId]) ? 'ETH' : pair.token0.address}/${
        pair.token1.equals(WETH[chainId]) ? 'ETH' : pair.token1.address
      }`
    )
  }

  useEffect(() => {
    onUserInput(Field.LIQUIDITY_PERCENT, '0')
  }, [onUserInput])

  return (
    <>
      <TransactionConfirmationModal
        isOpen={showConfirm}
        onDismiss={handleDismissConfirmation}
        attemptingTxn={attemptingTxn}
        hash={txHash ? txHash : ''}
        content={() => (
          <ConfirmationModalContent
            title={t('you_will_receive_withdraw')}
            onDismiss={handleDismissConfirmation}
            topContent={modalHeader}
            bottomContent={modalBottom}
            transactionType={TransactionType.WITHDRAW}
          />
        )}
        pendingText={pendingText}
      />
      <BrandIdentitySoneForMobile />
      <AppBody style={{ marginTop: isUpToExtraSmall ? '1.25rem' : '1.5rem' }}>
        <AppBodyTitleDescriptionSettings transactionType={TransactionType.WITHDRAW} />
        <StyledPadding>
          <AutoColumn gap="md">
            <PanelSelectPair
              selectedPair={pair}
              onPairSelect={onPairSelect}
              isLoading={isLoading}
              allPairs={addedPairs}
            />
            {pair && (
              <>
                <PanelWithdrawLiquidityInput
                  label={t('input')}
                  value={formattedAmounts[Field.LIQUIDITY]}
                  onUserInput={onUserInput}
                  lpToken={pair?.liquidityToken}
                  LPTokenName={LPTokenName}
                  id="withdraw-input-lptoken"
                  selectedPercentage={selectedPercentage}
                />
                <Row justify="center">
                  <IconWrapper clickable={false}>
                    <StyledArrowDown />
                  </IconWrapper>
                </Row>
                <PanelCurrencyInput
                  label={t('output')}
                  value={formattedAmounts[Field.CURRENCY_A]}
                  onUserInput={onCurrencyAInput}
                  showMaxButton={false}
                  onMax={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')}
                  id="withdraw-output-token0"
                  currency={currencyA}
                  showCurrencySelect={false}
                  showReceiveWETH={currencyAIsETH || currencyAIsWETH}
                  onReceiveWETHToggle={onReceiveWETHToggle}
                />
                <Row justify="center">
                  <IconWrapper clickable={false}>
                    <StyledPlus />
                  </IconWrapper>
                </Row>
                <PanelCurrencyInput
                  label={t('output')}
                  value={formattedAmounts[Field.CURRENCY_B]}
                  onUserInput={onCurrencyBInput}
                  showMaxButton={false}
                  onMax={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')}
                  id="withdraw-output-token0"
                  currency={currencyB}
                  showCurrencySelect={false}
                  showReceiveWETH={currencyBIsETH || currencyBIsWETH}
                  onReceiveWETHToggle={onReceiveWETHToggle}
                />
                <DetailWrapper gap={isUpToExtraSmall ? '10px' : '15px'}>
                  <RowBetween>
                    <RowFixed>
                      <TextPrice>{t('lp_token_burned')}</TextPrice>
                      <QuestionHelper1416 text={t('question_helper_lp_token_burned')} />
                    </RowFixed>
                    <RowFixed align="baseline">
                      <Text fontWeight={700} fontSize={isUpToExtraSmall ? 13 : 16}>
                        {parsedAmounts[Field.LIQUIDITY]?.toSignificant(6) ?? 0}
                      </Text>
                      <Text fontWeight={700} fontSize={13}>
                        &nbsp;{LPTokenName}
                      </Text>
                    </RowFixed>
                  </RowBetween>
                  <RowBetween>
                    <RowFixed>
                      <TextPrice>{t('price')}</TextPrice>
                      <QuestionHelper1416 text={t('question_helper_price')} />
                    </RowFixed>
                    <TradePrice
                      price={(pair && pair.token0Price) ?? undefined}
                      showInverted={showInverted}
                      setShowInverted={setShowInverted}
                    />
                  </RowBetween>
                </DetailWrapper>
                <RowButton>
                  {approval === ApprovalState.APPROVED || signatureData !== null ? (
                    <ButtonPrimary
                      onClick={() => {
                        if (expertMode) {
                          onWithdrawLiquidity()
                        } else {
                          setShowConfirm(true)
                        }
                      }}
                    >
                      {t('withdraw_liquidity')}
                    </ButtonPrimary>
                  ) : (
                    <ButtonPrimary onClick={onAttemptToApprove} disabled={approval !== ApprovalState.NOT_APPROVED}>
                      {approval === ApprovalState.PENDING ? (
                        <Dots>{t('approving')}</Dots>
                      ) : isValid ? (
                        t('approve')
                      ) : (
                        error
                      )}
                    </ButtonPrimary>
                  )}
                </RowButton>
                <RowAnalytics>
                  <ColumnCenter>
                    <ViewPairAnalytics pairAddress={pair?.liquidityToken.address} tokenA={tokenA} tokenB={tokenB} />
                  </ColumnCenter>
                </RowAnalytics>
              </>
            )}
          </AutoColumn>
        </StyledPadding>
      </AppBody>
    </>
  )
}
