import { useQuery } from 'react-query'

import { poolUserQuery } from 'graphql/stakingQueries'
import { useActiveWeb3React } from 'hooks'
import { stakingClients } from '../../graphql/clients'
import { UserInfoSone } from '@s-one-finance/sdk-core'

/**
 * TODO: myStaked cái gì? Đặt tên lại.
 */
export default function useMyStaked(): UserInfoSone[] {
  const { account, chainId } = useActiveWeb3React()

  const { data: users } = useQuery(
    ['useMyStaked', chainId, account],
    async () => {
      const result = await stakingClients[chainId ?? 1].query({
        query: poolUserQuery,
        variables: {
          address: account?.toLowerCase()
        }
      })
      return result?.data.users
    },
    { enabled: Boolean(chainId && account) }
  )

  return users ?? []
}
