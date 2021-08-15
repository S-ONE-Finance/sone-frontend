import { useEffect, useState } from 'react'
import { UserInfoSone } from '@s-one-finance/sdk-core'

import { poolUserQuery } from 'graphql/stakingQueries'
import { useActiveWeb3React } from 'hooks'
import { stakingClients } from '../../graphql/clients'

const useMyStaked = () => {
  const { account, chainId } = useActiveWeb3React()
  const [myStaked, setMyStaked] = useState<UserInfoSone[]>([])

  useEffect(() => {
    ;(async () => {
      if (account) {
        const result: any = await stakingClients[chainId ?? 1].query({
          query: poolUserQuery,
          variables: {
            address: account.toLowerCase()
          }
        })
        setMyStaked(result?.data?.users)
      }
    })()
  }, [account, chainId, setMyStaked])

  return myStaked
}

export default useMyStaked
