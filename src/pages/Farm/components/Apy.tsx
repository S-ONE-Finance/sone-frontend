import React, { useEffect, useState, useMemo } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import useSushi from '../../../hooks/farms/useSushi'
import { BigNumber } from '../../../sushi'
import { getLPTokenStaked } from '../../../sushi/utils'
import { getContract } from '../../../sushi/format/erc20'
import { provider } from 'web3-core'
import { getBalanceNumber } from '../../../sushi/format/formatBalance'
import useStakedValue from '../../../hooks/farms/useStakedValue'
import { NUMBER_BLOCKS_PER_YEAR } from '../../../config'
import useLuaPrice from '../../../hooks/farms/useLuaPrice'
import useNewReward from '../../../hooks/farms/useNewReward'

interface ApyProps {
  pid: number
  lpTokenAddress: string
}

const Apy: React.FC<ApyProps> = ({ pid, lpTokenAddress }) => {
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
  const newReward = useNewReward(pid + 1)

  const [totalStake, setTotalStake] = useState<BigNumber>()
  useEffect(() => {
    async function fetchData() {
      const data = await getLPTokenStaked(sushi, lpContract, chainId)
      setTotalStake(data)
    }
    if (sushi && lpContract) {
      fetchData()
    } 
  }, [sushi, setTotalStake, lpContract])

  return (
    <div>
      <div>
        <span>Total staked value</span>
        <span>-Get from SDK</span>
      </div>
      <div>
        <span>Earned reward</span>
        <span>-Get from SDK</span>
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
