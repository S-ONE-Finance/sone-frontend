// TODO: dungnh: Not refactor yet!

import { useCallback, useEffect, useState } from 'react'
import { calculateAPY, UserInfoSone } from '@s-one-finance/sdk-core'
import _ from 'lodash'
import orderBy from 'lodash/orderBy'

import useAverageBlockTime from 'hooks/staking/useAverageBlockTime'
import { pairSubsetQuery, poolUserWithPoolDetailQuery } from 'graphql/stakingQueries'
import { useActiveWeb3React } from 'hooks'
import { useBlockNumber } from 'state/application/hooks'
import useSonePrice from './useSonePrice'
import { stakingClients, swapClients } from '../../graphql/clients'

const useMyAccountStaked = () => {
  const [isLoading, setIsLoading] = useState(true)
  const { account, chainId } = useActiveWeb3React()
  const [users, setUsers] = useState<UserInfoSone[]>([])
  const sonePrice = useSonePrice()
  const block = useBlockNumber()
  const averageBlockTime = useAverageBlockTime()

  const fetchDataStaked = useCallback(async () => {
    const results = await Promise.all([
      stakingClients[chainId ?? 1].query({
        query: poolUserWithPoolDetailQuery,
        variables: {
          address: account?.toLowerCase()
        }
      })
    ])
    const users = results[0]?.data.users
    const pairAddresses = users
      .map((user: UserInfoSone) => {
        return user.pool?.pair
      })
      .sort()
    const pairsQuery = await swapClients[chainId ?? 1].query({
      query: pairSubsetQuery,
      variables: { pairAddresses }
    })
    const pairs = pairsQuery?.data.pairs

    const userData: UserInfoSone[] = users.map((user: any) => {
      const pair = pairs.find((pair: any) => pair.id === user.pool?.pair)
      if (pair === undefined) {
        return false
      }
      const blocksPerHour = 3600 / Number(averageBlockTime)
      const balance = Number(user.pool?.balance / 1e18)
      const totalSupply = pair.totalSupply > 0 ? pair.totalSupply : 0.1
      const reserveUSD = pair.reserveUSD > 0 ? pair.reserveUSD : 0.1
      const balanceUSD = (balance / Number(totalSupply)) * Number(reserveUSD)
      const rewardPerBlock =
        ((user.pool?.allocPoint / user.pool?.owner.totalAllocPoint) * user.pool?.owner.sonePerBlock) / 1e18

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

    const sorted = orderBy(userData, ['id'], ['desc'])
    return sorted
  }, [chainId, account, averageBlockTime, sonePrice, block])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const results: UserInfoSone[] = await fetchDataStaked()
      const uniqResult = _.uniq(results)
      const sorted = orderBy(uniqResult, ['id'], ['desc'])
      setIsLoading(false)
      setUsers(sorted)
    }
    fetchData()
  }, [account, chainId, fetchDataStaked])
  return [isLoading, users] as const
}

export default useMyAccountStaked
