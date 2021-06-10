import React, { useEffect } from 'react'
import PanelSelectPair from 'components/PanelSelectPair'
import { useCurrency } from 'hooks/Tokens'
import { Pair, WETH } from '@s-one-finance/sdk-core'
import { usePair } from 'data/Reserves'
import { useHistory } from 'react-router-dom'
import { unwrappedToken } from 'utils/wrappedCurrency'
import { currencyId } from 'utils/currencyId'
import { useActiveWeb3React } from 'hooks'

type AddLiquidityTwoTokensModeProps = {
  currencyIdA: string | undefined
  currencyIdB: string | undefined
}

export default function AddLiquidityOneTokenMode({ currencyIdA, currencyIdB }: AddLiquidityTwoTokensModeProps) {
  const { chainId } = useActiveWeb3React()
  const history = useHistory()

  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)
  const pair = usePair(currencyA ?? undefined, currencyB ?? undefined)
  const selectedPair = pair[1]

  // Đang chọn WETH mà switch sang one token mode thì đổi url thành eth.
  useEffect(() => {
    if (chainId) {
      if (currencyIdA === WETH[chainId].address) history.push(`/add/ETH/${currencyIdB}`)
      else if (currencyIdB === WETH[chainId].address) history.push(`/add/${currencyIdA}/ETH`)
    }
  }, [chainId, currencyIdA, currencyIdB, history])

  // Chỉ select được ETH, not WETH
  const handlePairSelect = (pair: Pair) => {
    const { token0, token1 } = pair
    const currency0 = unwrappedToken(token0)
    const currency1 = unwrappedToken(token1)
    const currencyId0 = currencyId(currency0)
    const currencyId1 = currencyId(currency1)
    history.push(`/add/${currencyId0}/${currencyId1}`)
  }

  return (
    <div>
      <PanelSelectPair selectedPair={selectedPair} onPairSelect={handlePairSelect} />
    </div>
  )
}
