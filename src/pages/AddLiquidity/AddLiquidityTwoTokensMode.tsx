import PanelCurrencyInput from '../../components/PanelCurrencyInput'
import { Field } from '../../state/mint/actions'
import { AutoColumn } from '../../components/Column'
import { AutoRow } from '../../components/Row'
import { IconWrapper } from '../../components/swap/styleds'
import { Plus } from 'react-feather'
import React, { useCallback } from 'react'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from '../../state/mint/hooks'
import { useCurrency } from '../../hooks/Tokens'
import { Currency, TokenAmount } from '@s-one-finance/sdk-core'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { currencyId } from '../../utils/currencyId'
import { useHistory } from 'react-router-dom'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import useTheme from '../../hooks/useTheme'

type InputsTwoTokensModeProps = {
  // Không dùng `?:` để bắt buộc phải truyền currencyIdA và currencyIdB as prop.
  currencyIdA: string | undefined
  currencyIdB: string | undefined
}

export default function TwoTokensMode({ currencyIdA, currencyIdB }: InputsTwoTokensModeProps) {
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

  return (
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
  )
}
