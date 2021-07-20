import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useMyAccountStaked from 'hooks/masterfarmer/useMyAccountStaked'
import { MyStakeItem } from './MyStakeItem'
import { UserInfoSushi } from '@s-one-finance/sdk-core'

export default function MyStaking() {
  const [netApy, setNetApy] = useState(0)
  const myAccountStaked: UserInfoSushi[] = useMyAccountStaked()

  useEffect(() => {
    let totalSoneHarvestUSD = 0
    let totalLPStakeUSD = 0
    myAccountStaked.forEach((user: UserInfoSushi) => {
      totalSoneHarvestUSD += Number(user.sushiHarvestedUSD)
      totalLPStakeUSD += (Number(user.amount) / 1e18) * Number(user.pool?.LPTokenPrice)
    })
    if (totalLPStakeUSD) {
      setNetApy(totalSoneHarvestUSD / totalLPStakeUSD)
    }
  }, [myAccountStaked])

  return (
    <div>
      <Link to={`/staking`}>Stake</Link>
      <div>NET APY: {netApy * 100}%</div>
      <hr />
      {myAccountStaked.map((item, key) => {
        return <MyStakeItem key={key} userInfo={item} />
      })}
    </div>
  )
}
