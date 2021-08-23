import { useMemo } from 'react'
import { calculateAPY, UserInfoSone } from '@s-one-finance/sdk-core'
import _ from 'lodash'
import orderBy from 'lodash/orderBy'
import { useQuery } from 'react-query'

import useAverageBlockTime from 'hooks/staking/useAverageBlockTime'
import { pairSubsetQuery, poolUserWithPoolDetailQuery } from 'graphql/stakingQueries'
import { useActiveWeb3React } from 'hooks'
import { useBlockNumber } from 'state/application/hooks'
import { stakingClients, swapClients } from '../../graphql/clients'
import useOneSoneInUSD from '../useOneSoneInUSD'

const useMyAccountStaked = (): [boolean, UserInfoSone[]] => {
  const { account, chainId } = useActiveWeb3React()
  const sonePrice = useOneSoneInUSD()
  const block = useBlockNumber()
  const averageBlockTime = useAverageBlockTime()

  const { data: users, isLoading: usersIsLoading } = useQuery(
    ['useMyAccountStaked_poolUserWithPoolDetailQuery', chainId, account],
    async () => {
      const data = await stakingClients[chainId ?? 1].query({
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
      const data = await swapClients[chainId ?? 1].query({
        query: pairSubsetQuery,
        variables: { pairAddresses }
      })
      return data?.data.pairs
    },
    { enabled: Boolean(chainId && account) }
  )

  return useMemo((): [boolean, UserInfoSone[]] => {
    const isLoading = usersIsLoading || pairsIsLoading

    const userData: UserInfoSone[] = (users ?? [])
      .map((user: any) => {
        const pair = (pairs || []).find((pair: any) => pair.id === user.pool?.pair)
        if (pair === undefined) {
          return undefined
        }
        const blocksPerHour = 3600 / Number(averageBlockTime)
        const balance = Number(user.pool?.balance / 1e18)
        const totalSupply = pair.totalSupply > 0 ? pair.totalSupply : 0.1
        const reserveUSD = pair.reserveUSD > 0 ? pair.reserveUSD : 0.1
        const balanceUSD = (balance / Number(totalSupply)) * Number(reserveUSD)
        const rewardPerBlock =
          (user.pool?.allocPoint / user.pool?.owner.totalAllocPoint) * user.pool?.owner.sonePerBlock

        const investedValue = 1000
        const LPTokenPrice = pair.reserveUSD / pair.totalSupply
        const LPTokenValue = investedValue / LPTokenPrice
        const poolShare = LPTokenValue / (LPTokenValue + Number(balance))
        const roiPerBlock = (rewardPerBlock * sonePrice * poolShare) / investedValue
        const multiplierYear = calculateAPY(Number(averageBlockTime), block || 0)
        const roiPerYear = multiplierYear * roiPerBlock

        const rewardPerDay = rewardPerBlock * blocksPerHour * 24
        const soneHarvested = user.pool?.soneHarvested > 0 ? user.pool?.soneHarvested : 0
        const multiplier = (user.pool?.owner.bonusMultiplier * user.pool?.allocPoint) / 100

        // const roiPerYear = (soneHarvested + pendingReward) / user.amount
        // console.log(`soneHarvested`, soneHarvested)
        // console.log(`pendingReward`, pendingReward.toString())
        // console.log(`user.amount`, user.amount)
        // console.log(`roiPerYear`, roiPerYear)

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
          roiPerBlock,
          roiPerYear,
          soneHarvested,
          multiplier,
          balanceUSD,
          sonePrice,
          LPTokenPrice,
          secondsPerBlock: Number(averageBlockTime)
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
  }, [averageBlockTime, block, pairs, pairsIsLoading, sonePrice, users, usersIsLoading])
}

export default useMyAccountStaked
