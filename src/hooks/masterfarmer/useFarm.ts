import { useCallback, useEffect, useState } from 'react'
import { Farm } from '@s-one-finance/sdk-core/'
import { calculateAPY } from '@s-one-finance/sdk-core'

import useAverageBlockTime from 'hooks/masterfarmer/useAverageBlockTime'
import { pairSubsetQuery, poolsQueryDetail, poolUserDetailQuery } from 'graphql/stakingQueries'
import { useActiveWeb3React } from 'hooks'
import { useBlockNumber } from 'state/application/hooks'
import useSonePrice from './useSonePrice'
import { stakingClients, swapClients } from '../../graphql/clients'
import useUnmountedRef from '../useUnmountedRef'

const useFarm = (id: string) => {
  const { account, chainId } = useActiveWeb3React()
  const unmountedRef = useUnmountedRef()
  const block = useBlockNumber()
  const [farm, setFarm] = useState<Farm>()
  const sonePrice = useSonePrice()
  const averageBlockTime = useAverageBlockTime()

  const fetchFarmsDetail = useCallback(async () => {
    const results = await Promise.all([
      stakingClients[chainId ?? 1].query({
        query: poolsQueryDetail,
        variables: { id: id }
      }),
      stakingClients[chainId ?? 1].query({
        query: poolUserDetailQuery,
        variables: {
          id: `${id}-${account?.toLowerCase()}`
        }
      })
    ])
    const farm = results[0]?.data.pools[0]
    const dataPair = await swapClients[chainId ?? 1].query({
      query: pairSubsetQuery,
      variables: { pairAddresses: [farm.pair] }
    })
    const pair = dataPair?.data.pairs[0]
    const userInfo = results[1]?.data?.users[0]
    const blocksPerHour = 3600 / Number(averageBlockTime)
    const balance = Number(farm.balance / 1e18)
    const totalSupply = pair.totalSupply > 0 ? pair.totalSupply : 0.1
    const reserveUSD = pair.reserveUSD > 0 ? pair.reserveUSD : 0.1
    const balanceUSD = (balance / Number(totalSupply)) * Number(reserveUSD)
    const rewardPerBlock = ((farm.allocPoint / farm.owner.totalAllocPoint) * farm.owner.sonePerBlock) / 1e18

    const investedValue = 1000
    const LPTokenPrice = pair.reserveUSD / pair.totalSupply
    const LPTokenValue = investedValue / LPTokenPrice
    const poolShare = LPTokenValue / (LPTokenValue + Number(balance))
    const roiPerBlock = (rewardPerBlock * sonePrice * poolShare) / investedValue
    const multiplierYear = calculateAPY(Number(averageBlockTime), block || 0)
    const roiPerYear = multiplierYear * roiPerBlock

    const rewardPerDay = rewardPerBlock * blocksPerHour * 24
    const soneHarvested = farm.soneHarvested > 0 ? farm.soneHarvested : 0
    const multiplier = (farm.owner.bonusMultiplier * farm.allocPoint) / 100

    return {
      ...farm,
      contract: 'masterchefv1',
      type: 'SLP',
      symbol: pair.token0.symbol + '-' + pair.token1.symbol,
      name: pair.token0.name + ' ' + pair.token1.name,
      pid: Number(farm.id),
      pairAddress: pair.id,
      slpBalance: farm.balance,
      soneRewardPerDay: rewardPerDay,
      liquidityPair: pair,
      rewardPerBlock,
      roiPerBlock,
      roiPerYear,
      soneHarvested,
      multiplier,
      balanceUSD,
      sonePrice,
      LPTokenPrice,
      secondsPerBlock: Number(averageBlockTime),
      userInfo: userInfo || {}
    }
  }, [chainId, id, account, averageBlockTime, sonePrice, block])

  useEffect(() => {
    ;(async () => {
      const results = await fetchFarmsDetail()
      if (!unmountedRef.current) setFarm(results)
    })()
  }, [unmountedRef, chainId, fetchFarmsDetail])

  return farm
}

export default useFarm
