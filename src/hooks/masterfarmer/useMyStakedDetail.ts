import { masterchef } from 'apollo/client'
import { poolUserQuery } from 'apollo/queries'
import { useActiveWeb3React } from 'hooks'
import { useEffect, useState } from 'react'
import { MyStaked } from './interfaces'

const useMyStakedDetail = (pid: number) => {
  const { account, chainId } = useActiveWeb3React()
  const [myStaked, setMyStaked] = useState<MyStaked>({} as MyStaked)
  useEffect(() => {
    ;(async () => {
      const result: any = await masterchef.query({
        query: poolUserQuery,
        // TODO_STAKING: remove fake account
        variables: {
          address: '0x9ae383135ef1ead2bab41c1f97640d51ae8f458f'
        }
      })
      const stakedDetails = result?.data?.users.filter((item: MyStaked) => Number(item.pool.id) === pid)
      if (stakedDetails?.length) {
        setMyStaked(stakedDetails[0])
      }
    })()
  }, [account, chainId, setMyStaked])
  return myStaked
}

export default useMyStakedDetail
