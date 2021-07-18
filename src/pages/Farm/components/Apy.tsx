import { PoolInfo, UserInfo } from '@s-one-finance/sdk-core/'
import React, { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { Farm } from 'hooks/masterfarmer/interfaces'
import { getBalanceNumber } from 'hooks/masterfarmer/utils'
import { useBlockNumber } from 'state/application/hooks'
interface ApyProps {
  val: string
  farm: Farm | undefined
}

const Apy: React.FC<ApyProps> = ({ val, farm }) => {
  const [totalStakedAfterStake, setTotalStakedAfterStake] = useState('0')
  const [earnedRewardAfterStake, setEarnedRewardAfterStake] = useState('0')
  const [apyAfterStake, setAPYAfterStake] = useState('0')

  const block = useBlockNumber()

  useEffect(() => {
    const poolInfo = new PoolInfo(farm)
    if (val && farm?.userInfo) {
      const userInfo = new UserInfo(poolInfo, farm.userInfo)
      const newTotalStaked = userInfo.getTotalStakedValueAfterStake(
        new BigNumber(val).times(new BigNumber(10).pow(18)).toString()
      )
      setTotalStakedAfterStake(newTotalStaked)
      const newEarnedReward = userInfo.getEarnedRewardAfterStake(
        new BigNumber(val).times(new BigNumber(10).pow(18)).toString(),
        block || 0
      )
      setEarnedRewardAfterStake(newEarnedReward)
      const newAPY = userInfo.getAPYAfterStake(
        new BigNumber(val).times(new BigNumber(10).pow(18)).toString(),
        block || 0
      )
      setAPYAfterStake(newAPY)
    }
  }, [val, farm, block])

  return (
    <div>
      <div>
        <span>Total staked value</span>
        <span>- {getBalanceNumber(totalStakedAfterStake)}</span>
      </div>
      <div>
        <span>Earned reward</span>
        <span>- {earnedRewardAfterStake}</span>
      </div>
      <div>
        <span>APY</span>
        <span>- {Number(apyAfterStake) * 100}</span>
      </div>
      <div>
        <span>Reward / block -----</span>
        <span>{farm ? farm.rewardPerBlock : '~'} SONE</span>
      </div>
      <div>
        <span>Total liquidity ----- </span>
        <span>${farm ? farm.balanceUSD : '~'}</span>
      </div>
      <div>
        <span>My Reward ----- </span>
        <span>{farm?.userInfo ? farm.userInfo.sushiHarvested : '~'} SONE</span>
      </div>
    </div>
  )
}

export default Apy
