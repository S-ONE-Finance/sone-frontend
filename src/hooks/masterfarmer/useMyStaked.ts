import { masterchef } from 'apollo/client'
import { poolUserQuery } from 'apollo/queries'
import { useActiveWeb3React } from 'hooks'
import { useEffect, useState } from 'react'
import { UserInfoSushi } from '@s-one-finance/sdk-core'

const useMyStaked = () => {
  const { account, chainId } = useActiveWeb3React()
  const [myStaked, setMyStaked] = useState<UserInfoSushi[]>([])
  useEffect(() => {
    ;(async () => {
      const result: any = await masterchef.query({
        query: poolUserQuery,
        // TODO_STAKING: remove fake account
        variables: {
          address: '0x9ae383135ef1ead2bab41c1f97640d51ae8f458f'
        }
      })
      setMyStaked(result?.data?.users)
    })()
  }, [account, chainId, setMyStaked])
  return myStaked
}

export default useMyStaked
