import { useQuery } from 'react-query'

import { poolUserQuery } from 'graphql/stakingQueries'
import { useActiveWeb3React } from 'hooks'
import { stakingClients } from '../../graphql/clients'
import { UserInfoSone } from '@s-one-finance/sdk-core'
import { useMemo } from 'react'
import { DEFAULT_CHAIN_ID } from '../../constants'

/**
 * TODO: myStaked cái gì? Đặt tên lại.
 */
export default function useMyStaked(): UserInfoSone[] {
  const { account, chainId } = useActiveWeb3React()

  const { data: users } = useQuery(
    ['useMyStaked', chainId, account],
    async () => {
      const result = await stakingClients[account && chainId ? chainId : DEFAULT_CHAIN_ID].query({
        query: poolUserQuery,
        variables: {
          address: account?.toLowerCase()
        }
      })
      return result?.data.users
    },
    { enabled: Boolean(chainId && account) }
  )

  return useMemo(() => users ?? [], [users])
}
