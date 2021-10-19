import { LiquidityPosition } from '@s-one-finance/sdk-core'

import { liquidityPositionSubsetQuery } from 'graphql/stakingQueries'
import { useActiveWeb3React } from 'hooks'
import { swapClients } from '../../graphql/clients'
import { useQuery } from 'react-query'
import { useMemo } from 'react'
import { DEFAULT_CHAIN_ID } from '../../constants'

export default function useMyLpToken(): LiquidityPosition[] {
  const { account, chainId } = useActiveWeb3React()

  const { data: myLpToken } = useQuery(
    ['useMyLpToken', account, chainId],
    async () => {
      const result = await swapClients[account && chainId ? chainId : DEFAULT_CHAIN_ID].query({
        query: liquidityPositionSubsetQuery,
        variables: { user: account?.toLowerCase() }
      })
      return result?.data?.liquidityPositions
    },
    { enabled: Boolean(chainId && account) }
  )

  return useMemo(() => myLpToken ?? [], [myLpToken])
}
