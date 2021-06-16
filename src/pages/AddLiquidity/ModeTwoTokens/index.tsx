import { Currency, TokenAmount } from '@s-one-finance/sdk-core'
import { QuestionHelper1416 } from 'components/QuestionHelper'
import { InfoLink } from 'components/swap/AdvancedSwapDetailsContent'
import TradePrice from 'components/swap/TradePrice'
import TransactionConfirmationModal, { ConfirmationModalContent } from 'components/TransactionConfirmationModal'
import { PairState } from 'data/Reserves'
import { ClickableText } from 'pages/Pool/styleds'
import React, { useCallback, useMemo, useState } from 'react'
import { ChevronDown, ChevronUp, Plus } from 'react-feather'
import { useHistory } from 'react-router-dom'
import { Text } from 'rebass'
import { useToggleSettingsMenu } from 'state/application/hooks'
import { TransactionType } from 'state/transactions/types'
import { useShowTransactionDetailsManager, useUserSlippageTolerance } from 'state/user/hooks'
import { unwrappedToken } from 'utils/wrappedCurrency'
import { AutoColumn, ColumnCenter } from '../../../components/Column'
import PanelCurrencyInput from '../../../components/PanelCurrencyInput'
import { AutoRow, RowBetween, RowFixed } from '../../../components/Row'
import { IconWrapper } from '../../../components/swap/styleds'
import { INITIAL_ALLOWED_SLIPPAGE, ONE_BIPS } from '../../../constants'
import { useCurrency } from '../../../hooks/Tokens'
import useAddLiquidityTwoTokensHandler from '../../../hooks/useAddLiquidityTwoTokensHandler'
import useTheme from '../../../hooks/useTheme'
import { useIsUpToExtraSmall } from '../../../hooks/useWindowSize'
import { Field } from '../../../state/mint/actions'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from '../../../state/mint/hooks'
import { currencyId } from '../../../utils/currencyId'
import { maxAmountSpend } from '../../../utils/maxAmountSpend'
import ModalFooter from '../ModalFooter'
import ModalHeader from '../ModalHeader'
import ButtonGrouping from './ButtonGrouping'

type ModeTwoTokensProps = {
  currencyIdA: string | undefined
  currencyIdB: string | undefined
}

export default function ModeTwoTokens({ currencyIdA, currencyIdB }: ModeTwoTokensProps) {
  const history = useHistory()

  const isUpToExtraSmall = useIsUpToExtraSmall()
  const theme = useTheme()

  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  // mint state
  const { independentField, typedValue, otherTypedValue } = useMintState()
  const { dependentField, currencies, currencyBalances, parsedAmounts, noLiquidity } = useDerivedMintInfo(
    currencyA ?? undefined,
    currencyB ?? undefined
  )

  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? ''
  }

  // Get the max amounts user can add: bản chất chính là balance của đồng đó,
  // trong trường hợp đồng đó là ETH thì phải để lại 1 ít, ko đc dùng hết.
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

  // bring from index.tsx

  const mobile13Desktop16 = isUpToExtraSmall ? 13 : 16

  // Show transaction details.
  const [isShowTransactionDetails, toggleIsShowTransactionDetails] = useShowTransactionDetailsManager()

  // Show price invert or not.
  const [showInverted, setShowInverted] = useState<boolean>(false)

  const toggleSettings = useToggleSettingsMenu()

  // mint state
  const { pair, pairState, price, poolTokenPercentage } = useDerivedMintInfo(
    currencyA ?? undefined,
    currencyB ?? undefined
  )

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm

  // txn values
  const [allowedSlippage] = useUserSlippageTolerance() // custom from users
  const [txHash, setTxHash] = useState<string>('')

  const onAdd = useAddLiquidityTwoTokensHandler({
    currencyA: currencies[Field.CURRENCY_A],
    currencyB: currencies[Field.CURRENCY_B],
    setAttemptingTxn,
    setTxHash
  })

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

  const isPairFilledAndValid = useMemo(
    () => currencies[Field.CURRENCY_A] && currencies[Field.CURRENCY_B] && pairState !== PairState.INVALID,
    [currencies, pairState]
  )

  return (
    <>
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
            bottomContent={() => (
              <ModalFooter
                price={price}
                currencies={currencies}
                parsedAmounts={parsedAmounts}
                noLiquidity={noLiquidity}
                onAdd={onAdd}
                poolTokenPercentage={poolTokenPercentage}
              />
            )}
            transactionType={TransactionType.ADD}
          />
        )}
        pendingText={pendingText}
        currencyToAdd={pair?.liquidityToken}
      />
      <AutoColumn gap={'md'}>
        <PanelCurrencyInput
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
            <IconWrapper clickable={false}>
              <Plus size={isUpToExtraSmall ? '14' : '22'} color={theme.text1Sone} />
            </IconWrapper>
          </AutoRow>
        </AutoColumn>
        <PanelCurrencyInput
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
      <ButtonGrouping
        currencyA={currencies[Field.CURRENCY_A]}
        currencyB={currencies[Field.CURRENCY_B]}
        setAttemptingTxn={setAttemptingTxn}
        setTxHash={setTxHash}
        setShowConfirm={setShowConfirm}
      />
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
    </>
  )
}
