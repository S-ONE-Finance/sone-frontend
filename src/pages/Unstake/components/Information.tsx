import React, { useEffect, useState, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import useSushi from '../../../hooks/farms/useSushi'
import { BigNumber } from '../../../sushi'
import { getContract } from '../../../sushi/format/erc20'
import { PoolInfo, JSBI } from '@s-one-finance/sdk-core/'

interface InfoProps {
  pid: number
  lpTokenAddress: string
  val: string
}

const Information: React.FC<InfoProps> = ({ pid, lpTokenAddress, val }) => {
  const sushi = useSushi()
  const { chainId, library: ethereum } = useWeb3React()

  const lpContract = useMemo(() => {
    const e_provider = ethereum && ethereum.provider ? ethereum.provider : null
    return getContract(e_provider as any, lpTokenAddress)
  }, [ethereum, lpTokenAddress])

  // TODO_STAKING: remove fake data
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
    if (val) {
      console.log('value da thay doi -> xu ly sdk o day')
    }
  }, [val, newReward, totalStake])

  return (
    <div>
      <div>
        <span>Total LP Token</span>
        {/* TODO_STAKING: remove fake data */}
        <span>- {1212121212}</span>
      </div>
      <div>
        <span>Remain Staked LP</span>
        <span>- {1212121212}</span>
      </div>
      <div>
        <span>Available Reward</span>
        <span>
          {/* TODO_STAKING: remove fake data */}
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

export default Information
