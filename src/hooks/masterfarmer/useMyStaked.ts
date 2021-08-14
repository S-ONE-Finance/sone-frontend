import { useEffect, useState } from 'react'
import { UserInfoSone } from '@s-one-finance/sdk-core'

import { masterchef } from 'apollo/client'
import { poolUserQuery } from 'apollo/queries'
import { useActiveWeb3React } from 'hooks'

const useMyStaked = () => {
  const { account, chainId } = useActiveWeb3React()
  const [myStaked, setMyStaked] = useState<UserInfoSone[]>([])

  useEffect(() => {
    ;(async () => {
      if (account) {
        const result: any = await masterchef.query({
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
