import { useEffect, useState } from 'react'
import { UserInfoSone } from '@s-one-finance/sdk-core'
import useMyAccountStaked from './useMyAccountStaked'

/**
 * Need refactor file name and code.
 */

export default function useNetApy() {
  const [netApy, setNetApy] = useState(0)
  const [, myAccountStaked] = useMyAccountStaked()

  useEffect(() => {
    let totalSoneHarvestUSD = 0
    let totalLPStakeUSD = 0
    myAccountStaked.forEach((user: UserInfoSone) => {
      totalSoneHarvestUSD += Number(user.soneHarvestedUSD)
      totalLPStakeUSD += (Number(user.amount) / 1e18) * Number(user.pool?.LPTokenPrice)
    })
    if (totalLPStakeUSD) {
      setNetApy(totalSoneHarvestUSD / totalLPStakeUSD)
    }
  }, [myAccountStaked])

  return netApy
}
