import { useMemo } from 'react'
import { calculateAPY, ChainId } from '@s-one-finance/sdk-core'
import { useQuery } from 'react-query'

import useAverageBlockTime from 'hooks/staking/useAverageBlockTime'
import { pairSubsetQuery, poolsQueryDetail, poolUserDetailQuery } from 'graphql/stakingQueries'
import { useActiveWeb3React } from 'hooks'
import { useBlockNumber } from 'state/application/hooks'
import { stakingClients, swapClients } from '../../graphql/clients'
import useOneSoneInUSD from '../useOneSoneInUSD'
import { CONFIG_MASTER_FARMER, DEFAULT_CHAIN_ID } from '../../constants'
import { useLastTruthy } from '../useLast'

const useFarm = (id: string) => {
  const { account, chainId } = useActiveWeb3React()
  const block = useBlockNumber()
  const sonePrice = useOneSoneInUSD()
  const averageBlockTime = useAverageBlockTime()

  const { data: farmQuery } = useQuery(
    ['useFarm_poolsQueryDetail', chainId, id, block],
    async () => {
      const data = await stakingClients[account && chainId ? chainId : DEFAULT_CHAIN_ID].query({
        query: poolsQueryDetail,
        variables: { id },
        fetchPolicy: 'network-only'
      })
      return data?.data.pools[0]
    },
    { enabled: Boolean(chainId) }
  )

  const farm = useLastTruthy(farmQuery)

  const { data: userInfoQuery } = useQuery(
    ['useFarm_poolUserDetailQuery', chainId, id, account, block],
    async () => {
      const data = await stakingClients[account && chainId ? chainId : DEFAULT_CHAIN_ID].query({
        query: poolUserDetailQuery,
        variables: {
          id: `${id}-${account?.toLowerCase()}`
        },
        fetchPolicy: 'network-only'
      })
      return data?.data?.users[0]
    },
    { enabled: Boolean(chainId && account) }
  )

  const userInfo = useLastTruthy(userInfoQuery)

  const { data: pairQuery } = useQuery(
    ['useFarm_pairSubsetQuery', chainId, farm?.pair, block],
    async () => {
      const data = await swapClients[account && chainId ? chainId : DEFAULT_CHAIN_ID].query({
        query: pairSubsetQuery,
        variables: { pairAddresses: [farm?.pair] },
        fetchPolicy: 'network-only'
      })
      return data?.data?.pairs[0]
    },
    { enabled: Boolean(chainId && account && farm?.pair) }
  )

  const pair = useLastTruthy(pairQuery)

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
    const multiplierYear = calculateAPY(
      Number(averageBlockTime),
      block || 0,
      CONFIG_MASTER_FARMER[chainId || (3 as ChainId)]
    )
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
      balance,
      balanceUSD,
      sonePrice,
      LPTokenPrice,
      secondsPerBlock: Number(averageBlockTime),
      userInfo: userInfo || {}
    }
  }, [averageBlockTime, block, chainId, farm, pair, sonePrice, userInfo])
}

export default useFarm
