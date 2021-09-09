import { useQuery } from 'react-query'

import { getPoolsByPairAddressQuery } from 'graphql/stakingQueries'
import { useActiveWeb3React } from 'hooks'
import { stakingClients } from '../../graphql/clients'
import { useMemo } from 'react'
import { FAKE_CHAIN_ID } from './useFarm'

export default function usePoolIdByPairAddress(pairAddress: string): string | undefined {
  const { chainId } = useActiveWeb3React()

  const { data: poolId } = useQuery<string | undefined>(
    ['usePoolIdByPairAddress', chainId, pairAddress],
    async () => {
      const result = await stakingClients[FAKE_CHAIN_ID].query({
        query: getPoolsByPairAddressQuery(pairAddress)
      })
      return result?.data.pools ? result?.data.pools[0]?.id : undefined
    },
    { enabled: Boolean(chainId && pairAddress) }
  )

  return useMemo(() => poolId, [poolId])
}
