import { JSBI, PoolInfo, UserInfo } from '@s-one-finance/sdk-core/'
import useMyStakedDetail from 'hooks/masterfarmer/useMyStakedDetail'
import React, { useEffect, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { Farm } from 'hooks/masterfarmer/interfaces'
import { getBalanceNumber } from 'hooks/masterfarmer/utils'
import { useBlockNumber } from 'state/application/hooks'

interface ApyProps {
  pid: number
  val: string
  farm: Farm | undefined
}

const Apy: React.FC<ApyProps> = ({ pid, val, farm }) => {
  const [totalStakedAfterStake, setTotalStakedAfterStake] = useState('0')
  const [earnedRewardAfterStake, setEarnedRewardAfterStake] = useState('0')

  const block = useBlockNumber()

  const myStakeDetail = useMyStakedDetail(pid)

  useEffect(() => {
    const poolInfo = new PoolInfo(farm)
    console.log('poolInfo', poolInfo)
    const userInfo = new UserInfo(poolInfo, myStakeDetail)
    console.log('userInfo', userInfo)
    if (val) {
      const newTotalStaked = userInfo.getTotalStakedValueAfterStake(
        new BigNumber(val).times(new BigNumber(10).pow(18)).toString()
      )
      console.log('block', block)
      setTotalStakedAfterStake(newTotalStaked)
      const newEarnedReward = userInfo.getEarnedRewardAfterStake(
        new BigNumber(val).times(new BigNumber(10).pow(18)).toString(),
        block || 0
      )
      console.log('newEarnedReward', newEarnedReward)
      setEarnedRewardAfterStake(newEarnedReward)
      // setEarnedRewardAfterStake(new BigNumber(newEarnedReward.toString()))
    }
  }, [val, myStakeDetail, farm, block])

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
        <span>
          {/* TODO_STAKING: remove fake data */}
          {21212}
        </span>
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
        <span>{myStakeDetail ? getBalanceNumber(myStakeDetail.rewardDebt) : '~'} SONE</span>
      </div>
    </div>
  )
}

export default Apy
