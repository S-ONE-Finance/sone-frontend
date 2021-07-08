import { exchange, masterchef } from 'apollo/client'
import { liquidityPositionSubsetQuery, pairSubsetQuery, poolsQuery } from 'apollo/queries'
import { useCallback, useEffect, useState } from 'react'

import { getAverageBlockTime } from 'apollo/getAverageBlockTime'
import _ from 'lodash'
import orderBy from 'lodash/orderBy'
//import range from 'lodash/range'
import { ChainId } from '@s-one-finance/sdk-core'
import { useActiveWeb3React } from 'hooks'

// Todo: Rewrite in terms of web3 as opposed to subgraph
const useFarms = () => {
  const { account, chainId } = useActiveWeb3React()
  const [farms, setFarms] = useState<any | undefined>()

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
      // sushiData.sushi.priceUSD()
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
    console.log('pairsQuery', pairsQuery)

    const liquidityPositions = results[1]?.data.liquidityPositions
    const averageBlockTime = results[2]
    // const sushiPrice = results[3]

    // TODO_STAKING: remove fake data
    const sushiPrice = 20

    const pairs = pairsQuery?.data.pairs

    const farms = pools.map((pool: any) => {
      const pair = pairs.find((pair: any) => pair.id === pool.pair)
      if (pair === undefined) {
        return false
      }
      console.log('pair', pair)
      const liquidityPosition = liquidityPositions.find(
        (liquidityPosition: any) => liquidityPosition.pair?.id === pair?.id
      )
      const blocksPerHour = 3600 / Number(averageBlockTime)
      const balance = Number(pool.balance / 1e18)
      const totalSupply = pair.totalSupply > 0 ? pair.totalSupply : 0.1
      const reserveUSD = pair.reserveUSD > 0 ? pair.reserveUSD : 0.1
      const balanceUSD = (balance / Number(totalSupply)) * Number(reserveUSD)
      const rewardPerBlock = ((pool.allocPoint / pool.owner.totalAllocPoint) * pool.owner.sushiPerBlock) / 1e18

      const roiPerBlock = (rewardPerBlock * sushiPrice) / balanceUSD
      const roiPerHour = roiPerBlock * blocksPerHour
      const roiPerDay = roiPerHour * 24
      const roiPerMonth = roiPerDay * 30
      const roiPerYear = roiPerMonth * 12

      const rewardPerDay = rewardPerBlock * blocksPerHour * 24

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
        roiPerBlock,
        roiPerHour,
        roiPerDay,
        roiPerMonth,
        roiPerYear,
        rewardPerThousand: 1 * roiPerDay * (1000 / sushiPrice),
        tvl: liquidityPosition?.liquidityTokenBalance
          ? (pair.reserveUSD / pair.totalSupply) * liquidityPosition.liquidityTokenBalance
          : 0.1
      }
    })

    const sorted = orderBy(farms, ['pid'], ['desc'])
    return sorted
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (chainId === ChainId.MAINNET || !account) {
        const results = await fetchSLPFarms()
        const aaa = _.uniq(results)
        const sorted = orderBy(aaa, ['pid'], ['desc'])
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
