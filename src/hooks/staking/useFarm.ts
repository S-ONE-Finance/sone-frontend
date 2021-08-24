import { useMemo } from 'react'
import { calculateAPY } from '@s-one-finance/sdk-core'
import { useQuery } from 'react-query'

import useAverageBlockTime from 'hooks/staking/useAverageBlockTime'
import { pairSubsetQuery, poolsQueryDetail, poolUserDetailQuery } from 'graphql/stakingQueries'
import { useActiveWeb3React } from 'hooks'
import { useBlockNumber } from 'state/application/hooks'
import { stakingClients, swapClients } from '../../graphql/clients'
import useOneSoneInUSD from '../useOneSoneInUSD'

const useFarm = (id: string) => {
  const { account, chainId } = useActiveWeb3React()
  const block = useBlockNumber()
  const sonePrice = useOneSoneInUSD()
  const averageBlockTime = useAverageBlockTime()

  const { data: farm } = useQuery(
    ['useFarm_poolsQueryDetail', chainId, id],
    async () => {
      const data = await stakingClients[chainId ?? 1].query({
        query: poolsQueryDetail,
        variables: { id: id }
      })
      return data?.data.pools[0]
    },
    { enabled: Boolean(chainId) }
  )

  const { data: userInfo } = useQuery(
    ['useFarm_poolUserDetailQuery', chainId, id, account],
    async () => {
      const data = await stakingClients[chainId ?? 1].query({
        query: poolUserDetailQuery,
        variables: {
          id: `${id}-${account?.toLowerCase()}`
        }
      })
      return data?.data?.users[0]
    },
    { enabled: Boolean(chainId && account) }
  )

  const { data: pair } = useQuery(
    ['useFarm_pairSubsetQuery', chainId, farm?.pair],
    async () => {
      const data = await swapClients[chainId ?? 1].query({
        query: pairSubsetQuery,
        variables: { pairAddresses: [farm?.pair] }
      })
      return data?.data?.pairs[0]
    },
    { enabled: Boolean(chainId && account && farm?.pair) }
  )

  return useMemo(() => {
    if (pair === undefined || farm === undefined) return {}

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
  }, [averageBlockTime, block, farm, pair, sonePrice, userInfo])
}

export default useFarm
