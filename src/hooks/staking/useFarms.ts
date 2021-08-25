import { useMemo } from 'react'
import _ from 'lodash'
import { calculateAPY, ChainId } from '@s-one-finance/sdk-core'
import { Farm } from '@s-one-finance/sdk-core/'

import { liquidityPositionSubsetQuery, pairSubsetQuery, poolsQuery } from 'graphql/stakingQueries'
import useAverageBlockTime from 'hooks/staking/useAverageBlockTime'
import { useActiveWeb3React } from 'hooks'
import { useBlockNumber } from 'state/application/hooks'
import { CONFIG_MASTER_FARMER, SONE_MASTER_FARMER, SONE_PRICE_MINIMUM } from '../../constants'
import { stakingClients, swapClients } from '../../graphql/clients'
import { useQuery } from 'react-query'
import useOneSoneInUSD from '../useOneSoneInUSD'

const FAKE_CHAIN_ID = 3

const useFarms = (): Farm[] => {
  const { chainId } = useActiveWeb3React()
  const sonePrice = useOneSoneInUSD()
  const block = useBlockNumber()
  const soneMasterFarmerAddress: string = useMemo(() => SONE_MASTER_FARMER[chainId as ChainId], [chainId])
  const averageBlockTime = useAverageBlockTime()

  const { data: pools } = useQuery(
    ['useFarms_poolsQuery', chainId],
    async () => {
      // const data = await stakingClients[chainId ?? 1].query({
      const data = await stakingClients[FAKE_CHAIN_ID].query({
        query: poolsQuery
      })
      return data?.data.pools
    },
    { enabled: Boolean(chainId) }
  )
  const { data: liquidityPositions } = useQuery(
    ['useFarms_liquidityPositionSubsetQuery', chainId, soneMasterFarmerAddress],
    async () => {
      // const data = await swapClients[chainId ?? 1].query({
      const data = await swapClients[FAKE_CHAIN_ID].query({
        query: liquidityPositionSubsetQuery,
        variables: { user: soneMasterFarmerAddress.toLowerCase() }
      })
      return data?.data.liquidityPositions
    },
    { enabled: Boolean(chainId && soneMasterFarmerAddress) }
  )

  const pairAddresses = useMemo(
    () =>
      Array.isArray(pools) && pools.length > 0
        ? pools
            .map((pool: any) => {
              return pool.pair
            })
            .sort()
        : [],
    [pools]
  )

  const { data: pairs } = useQuery(
    ['useFarms_pairSubsetQuery', chainId, pairAddresses],
    async () => {
      const data = await swapClients[FAKE_CHAIN_ID].query({
        query: pairSubsetQuery,
        variables: { pairAddresses }
      })
      return data?.data.pairs
    },
    { enabled: Boolean(chainId && pairAddresses) }
  )

  return useMemo(() => {
    const farms: Farm[] = (pools ?? [])
      .map((pool: any) => {
        const pair = (pairs ?? []).find((pair: any) => pair.id === pool.pair)
        if (pair === undefined) {
          return false
        }
        const liquidityPosition = (liquidityPositions ?? []).find(
          (liquidityPosition: any) => liquidityPosition.pair?.id === pair?.id
        )
        const blocksPerHour = 3600 / Number(averageBlockTime)
        const balance = Number(pool.balance / 1e18)
        const totalSupply = pair.totalSupply > 0 ? pair.totalSupply : 0.1
        const reserveUSD = pair.reserveUSD > 0 ? pair.reserveUSD : 0.1
        const balanceUSD = (balance / Number(totalSupply)) * Number(reserveUSD)
        const rewardPerBlock = ((pool.allocPoint / pool.owner.totalAllocPoint) * pool.owner.sonePerBlock) / 1e18
        const investedValue = 1000
        const LPTokenPrice = pair.reserveUSD / pair.totalSupply || SONE_PRICE_MINIMUM
        const LPTokenValue = investedValue / LPTokenPrice
        const poolShare = LPTokenValue / (LPTokenValue + Number(balance))
        const roiPerBlock = (rewardPerBlock * sonePrice * poolShare) / investedValue
        const multiplierYear = calculateAPY(
          averageBlockTime,
          block || 0,
          CONFIG_MASTER_FARMER[chainId || (3 as ChainId)]
        )
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
    const sorted = _.orderBy(farms, ['pid'], ['desc'])
    const unique = _.uniq(sorted)
    return unique
  }, [averageBlockTime, block, chainId, liquidityPositions, pairs, pools, sonePrice])
}

export default useFarms
