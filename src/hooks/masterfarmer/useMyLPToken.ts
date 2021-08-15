import { useEffect, useState } from 'react'
import { LiquidityPosition } from '@s-one-finance/sdk-core'

import { liquidityPositionSubsetQuery } from 'graphql/stakingQueries'
import { useActiveWeb3React } from 'hooks'
import { swapClients } from '../../graphql/clients'

const useMyLPToken = () => {
  const { account, chainId } = useActiveWeb3React()
  const [myLiquidity, setMyLiquidity] = useState<LiquidityPosition[]>([])

  useEffect(() => {
    ;(async () => {
      const result = await swapClients[chainId ?? 1].query({
        query: liquidityPositionSubsetQuery,
        variables: { user: account?.toLowerCase() }
      })
      const data = result?.data?.liquidityPositions
      setMyLiquidity(data)
    })()
  }, [account, chainId, setMyLiquidity])
  return myLiquidity
}

export default useMyLPToken
