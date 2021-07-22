import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { UserInfoSushi } from '@s-one-finance/sdk-core'
import useClaimReward from '../../../hooks/masterfarmer/useClaimReward'
import { getBalanceNumber } from 'hooks/masterfarmer/utils'
import usePendingReward from 'hooks/masterfarmer/usePendingReward'

export const MyStakeItem: React.FC<{ userInfo: UserInfoSushi }> = ({ userInfo }) => {
  const { onClaimReward } = useClaimReward()
  const pendingReward = usePendingReward(Number(userInfo.pool?.pid))

  const [poolRequestPending, setPoolRequestPending] = useState(false)

  const claimReward = async (farmId: number | undefined) => {
    console.log('farmId', farmId)
    if (farmId !== undefined) {
      setPoolRequestPending(true)
      await onClaimReward(farmId)
      setPoolRequestPending(false)
    }
  }

  return (
    <div>
      <div>{userInfo.pool?.symbol} LP TOKEN</div>
      <div>My Staked LP Token: {getBalanceNumber(userInfo.amount)}</div>
      <div>APY: {Number(userInfo.pool?.roiPerYear) * 100}%</div>
      <div>Rewarded SONE: {userInfo.sushiHarvested}</div>
      <div>Available Reward: {pendingReward?.toString()}</div>
      <Link to={`/unstake/${userInfo.pool?.pid}`}>Unstake</Link>
      <br />
      <Link to={`/staking/${userInfo.pool?.pid}`}>Stake more</Link>
      <br />
      <button disabled={poolRequestPending} onClick={() => claimReward(userInfo.pool?.pid)}>
        Request reward
      </button>
    </div>
  )
}
