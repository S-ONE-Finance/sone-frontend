import { useMemo } from 'react'
import { ChainId, UserInfoSone } from '@s-one-finance/sdk-core'
import _ from 'lodash'
import orderBy from 'lodash/orderBy'
import { useQuery } from 'react-query'

import useAverageBlockTime from 'hooks/staking/useAverageBlockTime'
import { pairSubsetQuery, poolUserWithPoolDetailQuery } from 'graphql/stakingQueries'
import { useActiveWeb3React } from 'hooks'
import { stakingClients, swapClients } from '../../graphql/clients'
import useOneSoneInUSD from '../useOneSoneInUSD'
import { FAKE_CHAIN_ID } from './useFarm'
import { useManyPendingReward } from './usePendingReward'

const LP_TOKEN_DECIMALS = 18
const LP_TOKEN_DECIMALS_POWER = 10 ** LP_TOKEN_DECIMALS

const useMyAccountStaked = (): [boolean, UserInfoSone[]] => {
  const { account, chainId } = useActiveWeb3React()
  const sonePrice = useOneSoneInUSD()
  const averageBlockTime = useAverageBlockTime()

  const { data: users, isLoading: usersIsLoading } = useQuery(
    ['useMyAccountStaked_poolUserWithPoolDetailQuery', chainId, account],
    async () => {
      const data = await stakingClients[FAKE_CHAIN_ID].query({
        query: poolUserWithPoolDetailQuery,
        variables: {
          address: account?.toLowerCase()
        }
      })
      return data?.data.users
    },
    { enabled: Boolean(chainId && account) }
  )

  const pairAddresses = useMemo(
    () =>
      (users ?? [])
        .map((user: UserInfoSone) => {
          return user.pool?.pair
        })
        .sort(),
    [users]
  )

  const { data: pairs, isLoading: pairsIsLoading } = useQuery(
    ['useMyAccountStaked_pairSubsetQuery', chainId, pairAddresses],
    async () => {
      const data = await swapClients[chainId as ChainId].query({
        query: pairSubsetQuery,
        variables: { pairAddresses }
      })
      return data?.data.pairs
    },
    { enabled: Boolean(chainId && account) }
  )

  const pids = users && users.map((user: any) => +user?.pool.id)
  const pendingRewards = useManyPendingReward(pids)

  return useMemo((): [boolean, UserInfoSone[]] => {
    const isLoading = usersIsLoading || pairsIsLoading

    const userData: UserInfoSone[] = (users ?? [])
      .map((user: any) => {
        const pair = (pairs || []).find((pair: any) => pair.id === user.pool?.pair)
        if (pair === undefined) {
          return undefined
        }
        const blocksPerHour = 3600 / Number(averageBlockTime)
        const balance = Number(user.pool?.balance / LP_TOKEN_DECIMALS_POWER)
        const totalSupply = pair.totalSupply > 0 ? pair.totalSupply : 0.1
        const reserveUSD = pair.reserveUSD > 0 ? pair.reserveUSD : 0.1
        const balanceUSD = (balance / Number(totalSupply)) * Number(reserveUSD)
        const rewardPerBlock =
          ((user.pool?.allocPoint / user.pool?.owner.totalAllocPoint) * user.pool?.owner.sonePerBlock) /
          LP_TOKEN_DECIMALS_POWER
        const LPTokenPrice = pair.reserveUSD / pair.totalSupply
        const rewardPerDay = rewardPerBlock * blocksPerHour * 24
        const soneHarvested = user.pool?.soneHarvested > 0 ? user.pool?.soneHarvested : 0
        const multiplier = (user.pool?.owner.bonusMultiplier * user.pool?.allocPoint) / 100
        const pendingReward =
          +(pendingRewards[user?.pool.id] ? pendingRewards[user?.pool.id].toString() : 0) / LP_TOKEN_DECIMALS_POWER
        const roiPerYear =
          ((Number(soneHarvested) + pendingReward) * sonePrice) /
          ((user.amount * LPTokenPrice) / LP_TOKEN_DECIMALS_POWER)
        const poolData = {
          ...user.pool,
          contract: 'masterchefv1',
          type: 'SLP',
          symbol: pair.token0.symbol + '-' + pair.token1.symbol,
          name: pair.token0.name + ' ' + pair.token1.name,
          pid: Number(user.pool.id),
          pairAddress: pair.id,
          slpBalance: user.pool.balance,
          soneRewardPerDay: rewardPerDay,
          liquidityPair: pair,
          rewardPerBlock,
          roiPerYear,
          soneHarvested,
          multiplier,
          balance,
          balanceUSD,
          sonePrice,
          LPTokenPrice,
          secondsPerBlock: Number(averageBlockTime),
          bonusMultiplier: user.pool?.owner.bonusMultiplier
        }

        return {
          ...user,
          pool: poolData
        }
      })
      .filter((user: any) => !!user)

    const sorted = orderBy(userData, ['id'], ['desc'])
    const unique = _.uniq(sorted)

    // TODO: Dùng biến isSuccess để detect loading không đúng lắm nhưng tạm thời ok.
    return [isLoading, unique]
  }, [averageBlockTime, pairs, pairsIsLoading, pendingRewards, sonePrice, users, usersIsLoading])
}

export default useMyAccountStaked
