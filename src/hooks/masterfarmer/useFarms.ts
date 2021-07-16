import { exchange, masterchef } from 'apollo/client'
import { liquidityPositionSubsetQuery, pairSubsetQuery, poolsQuery } from 'apollo/queries'
import { useCallback, useEffect, useState } from 'react'

import { getAverageBlockTime } from 'apollo/getAverageBlockTime'
import _ from 'lodash'
import orderBy from 'lodash/orderBy'
import { calculateAPY, ChainId } from '@s-one-finance/sdk-core'
import { useActiveWeb3React } from 'hooks'
import { Farm } from './interfaces'
import useSonePrice from './useSonePrice'
import { useBlockNumber } from 'state/application/hooks'

const useFarms = () => {
  const { account, chainId } = useActiveWeb3React()
  const [farms, setFarms] = useState<Farm[]>([])
  const sushiPrice = useSonePrice()
  const block = useBlockNumber()

  const fetchSLPFarms = useCallback(async () => {
    const results = await Promise.all([
      masterchef.query({
        query: poolsQuery
      }),
      exchange.query({
        query: liquidityPositionSubsetQuery,
        variables: { user: '0xc2edad668740f1aa35e4d8f227fb8e17dca888cd' }
      }),
      getAverageBlockTime()
    ])
    const pools = results[0]?.data.pools
    const pairAddresses = pools
      .map((pool: any) => {
        return pool.pair
      })
      .sort()
    const pairsQuery = await exchange.query({
      query: pairSubsetQuery,
      variables: { pairAddresses }
    })

    const liquidityPositions = results[1]?.data.liquidityPositions
    const averageBlockTime = results[2]

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
        const rewardPerBlock = ((pool.allocPoint / pool.owner.totalAllocPoint) * pool.owner.sushiPerBlock) / 1e18

        const investedValue = 1000
        const LPTokenPrice = pair.reserveUSD / pair.totalSupply
        const LPTokenValue = investedValue / LPTokenPrice
        const poolShare = LPTokenValue / (LPTokenValue + Number(balance))
        const roiPerBlock = (rewardPerBlock * sushiPrice * poolShare) / investedValue
        const multiplierYear = calculateAPY(Number(averageBlockTime), block || 0)
        const roiPerYear = multiplierYear * roiPerBlock

        const rewardPerDay = rewardPerBlock * blocksPerHour * 24
        const sushiHarvested = pool.sushiHarvested > 0 ? pool.sushiHarvested : 0
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
          sushiRewardPerDay: rewardPerDay,
          liquidityPair: pair,
          rewardPerBlock,
          roiPerBlock,
          roiPerYear,
          sushiHarvested,
          multiplier,
          balanceUSD,
          tvl: liquidityPosition?.liquidityTokenBalance
            ? (pair.reserveUSD / pair.totalSupply) * liquidityPosition.liquidityTokenBalance
            : 0.1,
          sushiPrice,
          LPTokenPrice,
          secondsPerBlock: Number(averageBlockTime)
        }
      })
      .filter((item: Farm | false) => {
        return item !== false
      })

    const sorted = orderBy(farms, ['pid'], ['desc'])
    return sorted
  }, [sushiPrice])

  useEffect(() => {
    const fetchData = async () => {
      if (chainId === ChainId.MAINNET || !account) {
        const results = await fetchSLPFarms()
        const uniqResult = _.uniq(results)
        const sorted = orderBy(uniqResult, ['pid'], ['desc'])
        setFarms(sorted)
      } else {
        setFarms([])
      }
    }
    fetchData()
  }, [account, chainId, fetchSLPFarms])
  return farms
}

export default useFarms
