import { Currency, TokenAmount } from '@s-one-finance/sdk-core'
import TransactionConfirmationModal, { ConfirmationModalContent } from 'components/TransactionConfirmationModal'
import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { TransactionType } from 'state/transactions/types'
import { AutoColumn } from '../../../components/Column'
import PanelCurrencyInput from '../../../components/PanelCurrencyInput'
import { AutoRow } from '../../../components/Row'
import { IconWrapper } from '../../../components/swap/styleds'
import { useCurrency } from '../../../hooks/Tokens'
import useAddLiquidityTwoTokensHandler from '../../../hooks/useAddLiquidityTwoTokensHandler'
import { Field } from '../../../state/mint/actions'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from '../../../state/mint/hooks'
import { currencyId } from '../../../utils/currencyId'
import { maxAmountSpend } from '../../../utils/maxAmountSpend'
import ModalFooter from './ModalFooter'
import ModalHeader from './ModalHeader'
import ButtonGrouping from './ButtonGrouping'
import TransactionDetails from './TransactionDetails'
import { StyledPlus } from '../../../theme'
import { useGuideStepManager } from '../../../state/user/hooks'

type ModeTwoTokensProps = {
  currencyIdA: string | undefined
  currencyIdB: string | undefined
}

export default function ModeTwoTokens({ currencyIdA, currencyIdB }: ModeTwoTokensProps) {
  const { t } = useTranslation()
  const history = useHistory()
  const [guideStep] = useGuideStepManager()

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

  // mint state
  const { pair, price, poolTokenPercentage } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)

  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // Clicked confirm.
  const [txHash, setTxHash] = useState<string>('')

  const onAdd = useAddLiquidityTwoTokensHandler({
    currencyA: currencies[Field.CURRENCY_A],
    currencyB: currencies[Field.CURRENCY_B],
    setAttemptingTxn,
    setTxHash
  })

  const pendingText = t('adding_123_eth_and_456_sone', {
    input0Amount: parsedAmounts[Field.CURRENCY_A]?.toSignificant(6),
    input0Symbol: currencies[Field.CURRENCY_A]?.symbol,
    input1Amount: parsedAmounts[Field.CURRENCY_B]?.toSignificant(6),
    input1Symbol: currencies[Field.CURRENCY_B]?.symbol
  })

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('')
    }
    setTxHash('')
  }, [onFieldAInput, txHash])

  useEffect(() => {
    onFieldAInput('')
  }, [onFieldAInput])

  return (
    <>
      <TransactionConfirmationModal
        isOpen={showConfirm}
        onDismiss={handleDismissConfirmation}
        attemptingTxn={attemptingTxn}
        hash={txHash}
        content={() => (
          <ConfirmationModalContent
            title={t('confirm_add_liquidity')}
            onDismiss={handleDismissConfirmation}
            topContent={() => ModalHeader({ parsedAmounts, currencies })}
            bottomContent={() => (
              <ModalFooter
                price={price}
                currencies={currencies}
                noLiquidity={noLiquidity}
                onAdd={onAdd}
                poolTokenPercentage={poolTokenPercentage}
              />
            )}
            transactionType={TransactionType.ADD_TWO_TOKENS}
          />
        )}
        pendingText={pendingText}
        currencyToAdd={pair?.liquidityToken}
      />
      <AutoColumn gap="md">
        <PanelCurrencyInput
          value={Number(guideStep.step) > 2 ? '2.71828' : formattedAmounts[Field.CURRENCY_A]}
          onUserInput={onFieldAInput}
          onMax={() => {
            onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
          }}
          onCurrencySelect={handleCurrencyASelect}
          showMaxButton={Number(guideStep.step) > 2 ? true : !atMaxAmounts[Field.CURRENCY_A]}
          currency={currencies[Field.CURRENCY_A]}
          id="add-liquidity-input-tokena"
        />
        <AutoColumn justify="space-between">
          <AutoRow justify={'center'}>
            <IconWrapper clickable={false}>
              <StyledPlus />
            </IconWrapper>
          </AutoRow>
        </AutoColumn>
        <PanelCurrencyInput
          value={Number(guideStep.step) > 2 ? '81.5484' : formattedAmounts[Field.CURRENCY_B]}
          onUserInput={onFieldBInput}
          onCurrencySelect={handleCurrencyBSelect}
          onMax={() => {
            onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
          }}
          showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
          currency={currencies[Field.CURRENCY_B]}
          id="add-liquidity-input-tokenb"
        />
      </AutoColumn>
      <ButtonGrouping
        currencyA={currencies[Field.CURRENCY_A]}
        currencyB={currencies[Field.CURRENCY_B]}
        setAttemptingTxn={setAttemptingTxn}
        setTxHash={setTxHash}
        setShowConfirm={setShowConfirm}
      />
      <TransactionDetails currencyA={currencies[Field.CURRENCY_A]} currencyB={currencies[Field.CURRENCY_B]} />
    </>
  )
}
