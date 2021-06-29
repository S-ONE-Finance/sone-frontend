import { useActiveWeb3React } from 'hooks'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function MyStaking() {
  const { account } = useActiveWeb3React()

  useEffect(() => {
    console.log('account', account)
  }, [account])

  const claimReward = (farmId: number) => {
    console.log('farmId', farmId)
  }

  return (
    <div>
      <Link to={`/staking`}>Stake</Link>
      <div>NET APY: {14.79}%</div>
      <hr />
      <div>
        <div>ETH-DAI LP TOKEN</div>
        <div>My Staked LP Token: {22.3}</div>
        <div>APY: {0.25}%</div>
        <div>Rewarded SONE: {283.229}</div>
        <div>Available Reward: {73.229}%</div>
        <Link to={`/staking`}>Unstake</Link>
        <br />
        <Link to={`/staking/${1}`}>Stake more</Link>
        <br />
        <button onClick={() => claimReward(1)}>Request Reward</button>
      </div>
    </div>
  )
}
