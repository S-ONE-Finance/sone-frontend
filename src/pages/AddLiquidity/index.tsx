import React, { useCallback, useMemo, useState } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'
import { RouteComponentProps } from 'react-router-dom'
import { Text } from 'rebass'
import styled from 'styled-components'

import AppBodyTitleDescriptionSettings from '../../components/AppBodyTitleDescriptionSettings'
import { ButtonError, ButtonPrimary } from '../../components/Button'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import { QuestionHelper1416 } from '../../components/QuestionHelper'
import { RowBetween, RowFixed } from '../../components/Row'
import { InfoLink } from '../../components/swap/AdvancedSwapDetailsContent'
import TradePrice from '../../components/swap/TradePrice'
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../components/TransactionConfirmationModal'
import { INITIAL_ALLOWED_SLIPPAGE, ONE_BIPS, ROUTER_ADDRESS } from '../../constants'
import { PairState } from '../../data/Reserves'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
import { useIsTransactionUnsupported } from '../../hooks/Trades'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import useTheme from '../../hooks/useTheme'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import { useToggleSettingsMenu, useWalletModalToggle } from '../../state/application/hooks'
import { Field } from '../../state/mint/actions'
import { useDerivedMintInfo, useMintActionHandlers } from '../../state/mint/hooks'
import { TransactionType } from '../../state/transactions/types'
import { AddLiquidityModeEnum } from '../../state/user/actions'
import {
  useAddLiquidityModeManager,
  useIsExpertMode,
  useShowTransactionDetailsManager,
  useUserSlippageTolerance
} from '../../state/user/hooks'
import { TYPE } from '../../theme'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import AppBody from '../AppBody'
import { ClickableText, Dots, Wrapper } from '../Pool/styleds'
import ModeToggle from './ModeToggle'
import ModeOneToken from './ModeOneToken'
import ModeTwoTokens from './ModeTwoTokens'
import ModalFooter from './ModalFooter'
import ModalHeader from './ModalHeader'
import useAddLiquidityHandler from './useAddLiquidityHandler'

const ButtonWrapper = styled.div<{ hasTrade?: boolean }>`
  margin: ${({ hasTrade }) => (hasTrade ? '17.5px 0' : '35px 0 0 0')};

  ${({ theme, hasTrade }) => theme.mediaWidth.upToExtraSmall`
    margin: ${hasTrade ? '17.5px 0' : '20px 0 0 0'};
  `}
`

export default function AddLiquidity({
  match: {
    params: { currencyIdA, currencyIdB }
  }
}: RouteComponentProps<{ currencyIdA?: string; currencyIdB?: string }>) {
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const mobile13Desktop16 = isUpToExtraSmall ? 13 : 16

  const [addLiquidityMode] = useAddLiquidityModeManager()

  // Show transaction details.
  const [isShowTransactionDetails, toggleIsShowTransactionDetails] = useShowTransactionDetailsManager()

  // Show price invert or not.
  const [showInverted, setShowInverted] = useState<boolean>(false)

  const { account } = useActiveWeb3React()
  const theme = useTheme()

  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  const toggleWalletModal = useWalletModalToggle() // toggle wallet when disconnected

  const toggleSettings = useToggleSettingsMenu()
  const expertMode = useIsExpertMode()

  // mint state
  const {
    currencies,
    pair,
    pairState,
    parsedAmounts,
    price,
    noLiquidity,
    poolTokenPercentage,
    error
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)

  const { onFieldAInput } = useMintActionHandlers(noLiquidity)

  const isValid = !error

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm

  // txn values
  const [allowedSlippage] = useUserSlippageTolerance() // custom from users
  const [txHash, setTxHash] = useState<string>('')

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_A], ROUTER_ADDRESS)
  const [approvalB, approveBCallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_B], ROUTER_ADDRESS)

  const onAdd = useAddLiquidityHandler({ currencyIdA, currencyIdB, setAttemptingTxn, setTxHash })

  const modalBottom = () => {
    return (
      <ModalFooter
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
        <ModeToggle />
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
                topContent={() => ModalHeader({ parsedAmounts, currencies })}
                bottomContent={modalBottom}
                transactionType={TransactionType.ADD}
              />
            )}
            pendingText={pendingText}
            currencyToAdd={pair?.liquidityToken}
          />
          {addLiquidityMode === AddLiquidityModeEnum.OneToken ? (
            <ModeOneToken currencyIdA={currencyIdA} currencyIdB={currencyIdB} />
          ) : (
            <ModeTwoTokens currencyIdA={currencyIdA} currencyIdB={currencyIdB} />
          )}
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
                  {error ?? 'Add Liquidity'}
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
