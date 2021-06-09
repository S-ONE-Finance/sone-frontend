import React, { useEffect, useState, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import useSushi from '../../../hooks/farms/useSushi'
import { BigNumber } from '../../../sushi'
import { getLPTokenStaked } from '../../../sushi/utils'
import { getContract } from '../../../sushi/format/erc20'
import  provider  from 'web3'
import { getBalanceNumber } from '../../../sushi/format/formatBalance'
import useStakedValue from '../../../hooks/farms/useStakedValue'
import { NUMBER_BLOCKS_PER_YEAR } from '../../../config'
import useLuaPrice from '../../../hooks/farms/useLuaPrice'
import useNewReward from '../../../hooks/farms/useNewReward'
import { PoolInfo, UserInfo, JSBI } from '@s-one-finance/sdk-core/'

interface ApyProps {
  pid: number
  lpTokenAddress: string
  val: string
}

const Apy: React.FC<ApyProps> = ({ pid, lpTokenAddress, val }) => {

  const [totalStakedAfterStake, setTotalStakedAfterStake] = useState(new BigNumber(0))
  const [earnedRewardAfterStake, setEarnedRewardAfterStake] = useState(new BigNumber(0))

  React.useEffect(() => {
    const poolInfo = new PoolInfo(
      JSBI.BigInt(totalStake.toNumber()),
      JSBI.BigInt(newReward.toNumber()),
      JSBI.BigInt(20)
    )
    const userInfo = new UserInfo(
      poolInfo,
      JSBI.BigInt(8000000000000000000)
    )
    if(val){
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
  }, [val])

  const sushi = useSushi()
  const { chainId, library: ethereum } = useWeb3React()
  const ID = chainId === 3 ? 3 : 1
  // const block = useBlock()
  const stakedValue = useStakedValue(pid)
  const luaPrice = useLuaPrice()
  
  const lpContract = useMemo(() => {
    const e_provider = ethereum && ethereum.provider ? ethereum.provider : null
    return getContract(e_provider as provider, lpTokenAddress)
  }, [ethereum, lpTokenAddress])

  // const newReward = useNewReward(pid + 1)
  // fake data
  const newReward = new BigNumber(5000000000000000000) // 5 SONE per block
  //

  const [totalStake, setTotalStake] = useState<BigNumber>(new BigNumber(0))
  useEffect(() => {
    async function fetchData() {
      // const data = await getLPTokenStaked(sushi, lpContract, chainId)
      // fake data
      const data = new BigNumber(20000000000000000000) // 20 LP token
      //
      setTotalStake(data)
    }
    if (sushi && lpContract) {
      fetchData()
    } 
  }, [sushi, setTotalStake, lpContract, chainId])

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
          {newReward &&
          stakedValue &&
          luaPrice &&
          stakedValue.usdValue &&
          stakedValue.totalToken2Value &&
          stakedValue.poolWeight
            ? `${parseFloat(
                luaPrice
                  .times(NUMBER_BLOCKS_PER_YEAR[ID])
                  .times(newReward.div(10 ** 18))
                  .div(stakedValue.usdValue)
                  .div(10 ** 8)
                  .times(100)
                  .toFixed(2)
              ).toLocaleString('en-US')}%`
            : 'loading'}
        </span>
      </div>
      <div>
        <span>Reward / block</span>
        <span>{newReward ? getBalanceNumber(newReward).toFixed(3) : '~'} SONE</span>
      </div>
      <div>
        <span>Total liquidity</span>
        <span>${stakedValue?.usdValue}</span>
      </div>
    </div>
  )
}

export default Apy
