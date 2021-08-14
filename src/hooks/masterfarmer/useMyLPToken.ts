import { useEffect, useState } from 'react'
import { LiquidityPosition } from '@s-one-finance/sdk-core'

import { exchange } from 'apollo/client'
import { liquidityPositionSubsetQuery } from 'apollo/queries'
import { useActiveWeb3React } from 'hooks'

const useMyLPToken = () => {
  const { account, chainId } = useActiveWeb3React()
  const [myLiquidity, setMyLiquidity] = useState<LiquidityPosition[]>([])

  useEffect(() => {
    ;(async () => {
      const result = await exchange.query({
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
