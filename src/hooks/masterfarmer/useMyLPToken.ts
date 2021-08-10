import { exchange } from 'apollo/client'
import { liquidityPositionSubsetQuery } from 'apollo/queries'
import { useActiveWeb3React } from 'hooks'
import { useEffect, useState } from 'react'
import { LiquidityPosition } from '@s-one-finance/sdk-core'

const useMyLPToken = () => {
  const { account, chainId } = useActiveWeb3React()
  const [myLiquidity, setMyLiquidity] = useState<LiquidityPosition[]>([])
  useEffect(() => {
    ;(async () => {
      const result = await exchange.query({
        query: liquidityPositionSubsetQuery,
        variables: { user: account }
      })
      const data = result?.data?.liquidityPositions
      setMyLiquidity(data)
    })()
  }, [account, chainId, setMyLiquidity])
  return myLiquidity
}

export default useMyLPToken
