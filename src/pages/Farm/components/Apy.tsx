import React, { useEffect, useState, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import useSushi from '../../../hooks/farms/useSushi'
import { BigNumber } from '../../../sushi'
import { getContract } from '../../../sushi/format/erc20'
import { getBalanceNumber } from '../../../sushi/format/formatBalance'
import { PoolInfo, UserInfo, JSBI } from '@s-one-finance/sdk-core/'

interface ApyProps {
  pid: number
  lpTokenAddress: string
  val: string
}

const Apy: React.FC<ApyProps> = ({ pid, lpTokenAddress, val }) => {
  const [totalStakedAfterStake, setTotalStakedAfterStake] = useState(new BigNumber(0))
  const [earnedRewardAfterStake, setEarnedRewardAfterStake] = useState(new BigNumber(0))

  const sushi = useSushi()
  const { chainId, library: ethereum } = useWeb3React()

  const lpContract = useMemo(() => {
    const e_provider = ethereum && ethereum.provider ? ethereum.provider : null
    return getContract(e_provider as any, lpTokenAddress)
  }, [ethereum, lpTokenAddress])

  // fake data
  const newReward = useMemo(() => new BigNumber(5000000000000000000), []) // 5 SONE per block
  //

  const [totalStake, setTotalStake] = useState<BigNumber>(new BigNumber(0))

  useEffect(() => {
    async function fetchData() {
      // TODO_STAKING: remove fake data
      const data = new BigNumber(20000000000000000000) // 20 LP token
      //
      setTotalStake(data)
    }
    if (sushi && lpContract) {
      fetchData()
    }
  }, [sushi, setTotalStake, lpContract, chainId])

  useEffect(() => {
    const poolInfo = new PoolInfo(
      JSBI.BigInt(totalStake.toNumber()),
      JSBI.BigInt(newReward.toNumber()),
      JSBI.BigInt(20)
    )
    const userInfo = new UserInfo(poolInfo, JSBI.BigInt(8000000000000000000))
    if (val) {
      const newTotalStaked = userInfo.getTotalStakedValueAfterStake(
        JSBI.BigInt(new BigNumber(val).times(new BigNumber(10).pow(18)).toNumber())
      )
      const newEarnedReward = userInfo.getEarnedRewardAfterStake(
        JSBI.BigInt(20),
        JSBI.BigInt(newReward.toNumber()),
        JSBI.BigInt(new BigNumber(val).times(new BigNumber(10).pow(18)).toNumber())
      )
      setTotalStakedAfterStake(new BigNumber(newTotalStaked.toString()))
      setEarnedRewardAfterStake(new BigNumber(newEarnedReward.toString()))
    }
  }, [val, newReward, totalStake])

  return (
    <div>
      <div>
        <span>Total staked value</span>
        <span>- {getBalanceNumber(totalStakedAfterStake)}</span>
      </div>
      <div>
        <span>Earned reward</span>
        <span>- {getBalanceNumber(earnedRewardAfterStake)}</span>
      </div>
      <div>
        <span>APY</span>
        <span>
          {/* TODO_STAKING: remove fake data */}
          {21212}
        </span>
      </div>
      <div>
        <span>Reward / block</span>
        <span>{newReward ? getBalanceNumber(newReward).toFixed(3) : '~'} SONE</span>
      </div>
      <div>
        <span>Total liquidity</span>
        <span>
          ${/* TODO_STAKING: remove fake data */}
          {21212}
        </span>
      </div>
      <div>
        <span>My Reward</span>
        <span>
          {/* TODO_STAKING: remove fake data */}
          {21212} SONE
        </span>
      </div>
    </div>
  )
}

export default Apy
