import React, { useEffect, useState } from 'react'
import PanelSelectPair from 'components/PanelSelectPair'
import { useCurrency } from 'hooks/Tokens'
import { Pair, WETH } from '@s-one-finance/sdk-core'
import { PairState, usePair } from 'data/Reserves'
import { useHistory } from 'react-router-dom'
import { unwrappedToken } from 'utils/wrappedCurrency'
import { currencyId } from 'utils/currencyId'
import { useActiveWeb3React } from 'hooks'
import PanelCurrencyInput, { SelectOrToggle } from 'components/PanelCurrencyInput'
import { AutoColumn } from 'components/Column'
import { useDerivedMintSimpleInfo, useMintSimpleActionHandlers, useMintSimpleState } from 'state/mintSimple/hooks'
import useToggle from 'hooks/useToggle'

type AddLiquidityTwoTokensModeProps = {
  currencyIdA: string | undefined
  currencyIdB: string | undefined
}

export default function AddLiquidityOneTokenMode({ currencyIdA, currencyIdB }: AddLiquidityTwoTokensModeProps) {
  const { chainId } = useActiveWeb3React()
  const history = useHistory()

  // useEffect(() => {
  //   if (selectedPairState === PairState.NOT_EXISTS) {
  //     throw new Error('Pair not exist')
  //   } else if (selectedPairState === PairState.INVALID) {
  //     throw new Error('Pair invalid')
  //   }
  // }, [selectedPairState])

  // Đang chọn WETH mà switch sang one token mode thì đổi url thành eth.
  useEffect(() => {
    if (chainId) {
      if (currencyIdA === WETH[chainId].address) history.push(`/add/ETH/${currencyIdB}`)
      else if (currencyIdB === WETH[chainId].address) history.push(`/add/${currencyIdA}/ETH`)
    }
  }, [chainId, currencyIdA, currencyIdB, history])

  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)
  const pair = usePair(currencyA ?? undefined, currencyB ?? undefined)

  const [selectedPairState, selectedPair] = pair
  const [isSelectFirstCurrency, onCurrencyToggle] = useToggle()
  const selectedCurrency = isSelectFirstCurrency ? currencyB : currencyA

  // Chỉ select được ETH, ko cho select WETH
  const handlePairSelect = (pair: Pair) => {
    const { token0, token1 } = pair
    const currency0 = unwrappedToken(token0)
    const currency1 = unwrappedToken(token1)
    const currencyId0 = currencyId(currency0)
    const currencyId1 = currencyId(currency1)
    history.push(`/add/${currencyId0}/${currencyId1}`)
  }

  const { typedValue } = useMintSimpleState()

  const { onFieldInput } = useMintSimpleActionHandlers()

  const { maxAmount } = useDerivedMintSimpleInfo(selectedPairState, selectedPair, selectedCurrency)

  return (
    <AutoColumn gap="20px">
      <PanelSelectPair selectedPair={selectedPair} onPairSelect={handlePairSelect} />
      <PanelCurrencyInput
        id="add-liquidity-simple-input-tokena"
        value={typedValue}
        onUserInput={onFieldInput}
        showMaxButton
        onMax={() => {
          onFieldInput(maxAmount?.toExact() ?? '')
        }}
        currency={selectedCurrency}
        isCurrencySelectOrToggle={SelectOrToggle.TOGGLE}
        onCurrencyToggle={onCurrencyToggle}
      />
    </AutoColumn>
  )
}
