import { Farm, PoolInfo, UserInfo } from '@s-one-finance/sdk-core/'
import { useWeb3React } from '@web3-react/core'
import usePendingReward from 'hooks/masterfarmer/usePendingReward'
import useTokenBalance from 'hooks/masterfarmer/useTokenBalance'
import { getBalanceNumber } from 'hooks/masterfarmer/utils'
import React, { useEffect, useMemo, useState } from 'react'
import { useBlockNumber } from 'state/application/hooks'
import BigNumber from 'bignumber.js'

interface InfoProps {
  farm: Farm | undefined
  val: string
}

const Information: React.FC<InfoProps> = ({ farm, val }) => {
  const { chainId } = useWeb3React()

  const [totalLPToken, setTotalLPToken] = useState('0')
  const [remainStakedLP, setRemainStakedLP] = useState('0')
  const [availableReward, setAvailableReward] = useState('0')

  const tokenBalance = useTokenBalance(farm?.pairAddress)
  const pendingReward = usePendingReward(Number(farm?.id))
  const block = useBlockNumber()

  useEffect(() => {
    const poolInfo = new PoolInfo(farm)
    if (val && farm?.userInfo) {
      const userInfo = new UserInfo(poolInfo, farm.userInfo)
      const newTotalLPToken = userInfo.getTotalLPTokenAfterUnstake(
        tokenBalance.toString(),
        new BigNumber(val).times(new BigNumber(10).pow(18)).toString()
      )
      setTotalLPToken(newTotalLPToken)
      const newTotalStaked = userInfo.getRemainStakedValueAfterUnstake(
        new BigNumber(val).times(new BigNumber(10).pow(18)).toString()
      )
      setRemainStakedLP(newTotalStaked)
      setAvailableReward(pendingReward.toString())
    }
  }, [val, farm, block])

  return (
    <div>
      <div>
        <span>Total LP Token</span>
        <span>- {totalLPToken}</span>
      </div>
      <div>
        <span>Remain Staked LP</span>
        <span>- {getBalanceNumber(remainStakedLP)}</span>
      </div>
      <div>
        <span>Available Reward</span>
        <span>- {availableReward}</span>
      </div>
      <div>
        <span>My Reward</span>
        <span>{farm?.userInfo ? farm.userInfo.sushiHarvested : '~'} SONE</span>
      </div>
    </div>
  )
}

export default Information
