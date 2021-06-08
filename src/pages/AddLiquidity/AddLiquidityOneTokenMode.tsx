import React from 'react'
import PanelSelectPair from 'components/PanelSelectPair'
import { useCurrency } from 'hooks/Tokens'
import { Pair } from '@s-one-finance/sdk-core'
import { usePair } from 'data/Reserves'
import { useHistory } from 'react-router-dom'

type AddLiquidityTwoTokensModeProps = {
  currencyIdA: string | undefined
  currencyIdB: string | undefined
}

export default function AddLiquidityOneTokenMode({ currencyIdA, currencyIdB }: AddLiquidityTwoTokensModeProps) {
  const history = useHistory()

  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)
  const pair = usePair(currencyA ?? undefined, currencyB ?? undefined)
  const selectedPair = pair[1]

  const handlePairSelect = (pair: Pair) => {
    const { token0, token1 } = pair
    history.push(`/add/${token0.address}/${token1.address}`)
  }

  return (
    <div>
      <PanelSelectPair selectedPair={selectedPair} onPairSelect={handlePairSelect} />
    </div>
  )
}
