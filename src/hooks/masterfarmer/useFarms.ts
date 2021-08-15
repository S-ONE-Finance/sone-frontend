import { useCallback, useEffect, useState } from 'react'
import _ from 'lodash'
import orderBy from 'lodash/orderBy'
import { calculateAPY, ChainId } from '@s-one-finance/sdk-core'
import { Farm } from '@s-one-finance/sdk-core/'

import { liquidityPositionSubsetQuery, pairSubsetQuery, poolsQuery } from 'apollo/queries'
import useAverageBlockTime from 'hooks/masterfarmer/useAverageBlockTime'
import { useActiveWeb3React } from 'hooks'
import { useBlockNumber } from 'state/application/hooks'
import useSonePrice from './useSonePrice'
import { MASTER_FARMER_ADDRESS } from '../../constants'
import { stakingClients, swapClients } from '../../subgraph/clients'

const useFarms = () => {
  const { account, chainId } = useActiveWeb3React()
  const [farms, setFarms] = useState<Farm[]>([])
  const sonePrice = useSonePrice()
  const block = useBlockNumber()
  const masterFarmerAddress: string = MASTER_FARMER_ADDRESS[chainId as ChainId]
  const averageBlockTime = useAverageBlockTime()

  const fetchSLPFarms = useCallback(async () => {
    const results = await Promise.all([
      stakingClients[chainId ?? 1].query({
        query: poolsQuery
      }),
      swapClients[chainId ?? 1].query({
        query: liquidityPositionSubsetQuery,
        variables: { user: masterFarmerAddress.toLowerCase() }
      })
    ])
    const pools = results[0]?.data.pools
    const pairAddresses = pools
      .map((pool: any) => {
        return pool.pair
      })
      .sort()
    const pairsQuery = await swapClients[chainId ?? 1].query({
      query: pairSubsetQuery,
      variables: { pairAddresses }
    })
    const liquidityPositions = results[1]?.data.liquidityPositions
    const pairs = pairsQuery?.data.pairs

    const farms: Farm[] = pools
      .map((pool: any) => {
        const pair = pairs.find((pair: any) => pair.id === pool.pair)
        if (pair === undefined) {
          return false
        }
        const liquidityPosition = liquidityPositions.find(
          (liquidityPosition: any) => liquidityPosition.pair?.id === pair?.id
        )
        const blocksPerHour = 3600 / Number(averageBlockTime)
        const balance = Number(pool.balance / 1e18)
        const totalSupply = pair.totalSupply > 0 ? pair.totalSupply : 0.1
        const reserveUSD = pair.reserveUSD > 0 ? pair.reserveUSD : 0.1
        const balanceUSD = (balance / Number(totalSupply)) * Number(reserveUSD)
        const rewardPerBlock = ((pool.allocPoint / pool.owner.totalAllocPoint) * pool.owner.sonePerBlock) / 1e18

        const investedValue = 1000
        const LPTokenPrice = pair.reserveUSD / pair.totalSupply
        const LPTokenValue = investedValue / LPTokenPrice
        const poolShare = LPTokenValue / (LPTokenValue + Number(balance))
        const roiPerBlock = (rewardPerBlock * sonePrice * poolShare) / investedValue
        const multiplierYear = calculateAPY(Number(averageBlockTime), block || 0)
        const roiPerYear = multiplierYear * roiPerBlock

        const rewardPerDay = rewardPerBlock * blocksPerHour * 24
        const soneHarvested = pool.soneHarvested > 0 ? pool.soneHarvested : 0
        const multiplier = (pool.owner.bonusMultiplier * pool.allocPoint) / 100
        return {
          ...pool,
          contract: 'masterchefv1',
          type: 'SLP',
          symbol: pair.token0.symbol + '-' + pair.token1.symbol,
          name: pair.token0.name + ' ' + pair.token1.name,
          pid: Number(pool.id),
          pairAddress: pair.id,
          slpBalance: pool.balance,
          soneRewardPerDay: rewardPerDay,
          liquidityPair: pair,
          rewardPerBlock,
          roiPerBlock,
          roiPerYear,
          soneHarvested,
          multiplier,
          balanceUSD,
          tvl: liquidityPosition?.liquidityTokenBalance
            ? (pair.reserveUSD / pair.totalSupply) * liquidityPosition.liquidityTokenBalance
            : 0.1,
          sonePrice,
          LPTokenPrice,
          secondsPerBlock: Number(averageBlockTime)
        }
      })
      .filter((item: Farm | false) => {
        return item !== false
      })

    const sorted = orderBy(farms, ['pid'], ['desc'])
    return sorted
  }, [chainId, masterFarmerAddress, averageBlockTime, sonePrice, block])

  useEffect(() => {
    const fetchData = async () => {
      const results = await fetchSLPFarms()
      const uniqResult = _.uniq(results)
      const sorted = orderBy(uniqResult, ['pid'], ['desc'])
      setFarms(sorted)
    }
    fetchData()
  }, [account, chainId, fetchSLPFarms])
  return farms
}

export default useFarms
