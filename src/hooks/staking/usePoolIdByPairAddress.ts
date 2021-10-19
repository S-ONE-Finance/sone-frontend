import { useQuery } from 'react-query'

import { getPoolsByPairAddressQuery } from 'graphql/stakingQueries'
import { useActiveWeb3React } from 'hooks'
import { stakingClients } from '../../graphql/clients'
import { useMemo } from 'react'
import { DEFAULT_CHAIN_ID } from '../../constants'

export default function usePoolIdByPairAddress(pairAddress: string): string | undefined {
  const { account, chainId } = useActiveWeb3React()

  const { data: poolId } = useQuery<string | undefined>(
    ['usePoolIdByPairAddress', account, chainId, pairAddress],
    async () => {
      const result = await stakingClients[account && chainId ? chainId : DEFAULT_CHAIN_ID].query({
        query: getPoolsByPairAddressQuery(pairAddress)
      })
      return result?.data.pools ? result?.data.pools[0]?.id : undefined
    },
    { enabled: Boolean(chainId && pairAddress) }
  )

  return useMemo(() => poolId, [poolId])
}
