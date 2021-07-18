import useClaimReward from '../../../hooks/masterfarmer/useClaimReward'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { UserInfo } from 'hooks/masterfarmer/interfaces'
import { getBalanceNumber } from 'hooks/masterfarmer/utils'
import usePendingReward from 'hooks/masterfarmer/usePendingReward'

export const MyStakeItem: React.FC<{ userInfor: UserInfo }> = ({ userInfor }) => {
  const { onClaimReward } = useClaimReward()
  const pendingReward = usePendingReward(Number(userInfor.pool?.pid))

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
      <div>{userInfor.pool?.symbol} LP TOKEN</div>
      <div>My Staked LP Token: {getBalanceNumber(userInfor.amount)}</div>
      <div>APY: {Number(userInfor.pool?.roiPerYear) * 100}%</div>
      <div>Rewarded SONE: {userInfor.sushiHarvested}</div>
      <div>Available Reward: {pendingReward.toNumber()}</div>
      <Link to={`/unstake/${userInfor.pool?.pid}`}>Unstake</Link>
      <br />
      <Link to={`/staking/${userInfor.pool?.pid}`}>Stake more</Link>
      <br />
      <button disabled={poolRequestPending} onClick={() => claimReward(userInfor.pool?.pid)}>
        Request reward
      </button>
    </div>
  )
}
