import { LiquidityPosition } from '@s-one-finance/sdk-core'

import { liquidityPositionSubsetQuery } from 'graphql/stakingQueries'
import { useActiveWeb3React } from 'hooks'
import { swapClients } from '../../graphql/clients'
import { useQuery } from 'react-query'

// TODO: useMyLpToken is called many times.
export default function useMyLpToken(): LiquidityPosition[] {
  // console.log(`I'm here:`)
  const { account, chainId } = useActiveWeb3React()

  const { data: myLpToken } = useQuery(
    ['useMyLpToken', account, chainId],
    async () => {
      const result = await swapClients[chainId ?? 1].query({
        query: liquidityPositionSubsetQuery,
        variables: { user: account?.toLowerCase() }
      })
      return result?.data?.liquidityPositions
    },
    { enabled: Boolean(chainId && account) }
  )

  return myLpToken ?? []
}
