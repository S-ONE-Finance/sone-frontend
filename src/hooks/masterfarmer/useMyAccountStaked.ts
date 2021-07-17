import { calculateAPY } from '@s-one-finance/sdk-core'
import { exchange, masterchef } from 'apollo/client'
import { getAverageBlockTime } from 'apollo/getAverageBlockTime'
import { pairSubsetQuery, poolUserWithPoolDetailQuery } from 'apollo/queries'
import { useActiveWeb3React } from 'hooks'
import _ from 'lodash'
import orderBy from 'lodash/orderBy'
import { useCallback, useEffect, useState } from 'react'
import { useBlockNumber } from 'state/application/hooks'
import { UserInfo } from './interfaces'
import useSonePrice from './useSonePrice'

const useMyAccountStaked = () => {
  const { account, chainId } = useActiveWeb3React()
  const [users, setUsers] = useState<UserInfo[]>([])
  const sushiPrice = useSonePrice()
  const block = useBlockNumber()

  const fetchDataStaked = useCallback(async () => {
    const results = await Promise.all([
      masterchef.query({
        query: poolUserWithPoolDetailQuery,
        // TODO_STAKING: remove fake account
        variables: {
          address: '0x9ae383135ef1ead2bab41c1f97640d51ae8f458f'
        }
      }),
      getAverageBlockTime()
    ])
    const users = results[0]?.data.users
    const pairAddresses = users
      .map((user: UserInfo) => {
        return user.pool?.pair
      })
      .sort()
    const pairsQuery = await exchange.query({
      query: pairSubsetQuery,
      variables: { pairAddresses }
    })
    const averageBlockTime = results[1]

    const pairs = pairsQuery?.data.pairs

    const userData: UserInfo[] = users.map((user: any) => {
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
        ((user.pool?.allocPoint / user.pool?.owner.totalAllocPoint) * user.pool?.owner.sushiPerBlock) / 1e18

      const investedValue = 1000
      const LPTokenPrice = pair.reserveUSD / pair.totalSupply
      const LPTokenValue = investedValue / LPTokenPrice
      const poolShare = LPTokenValue / (LPTokenValue + Number(balance))
      const roiPerBlock = (rewardPerBlock * sushiPrice * poolShare) / investedValue
      const multiplierYear = calculateAPY(Number(averageBlockTime), block || 0)
      const roiPerYear = multiplierYear * roiPerBlock

      const rewardPerDay = rewardPerBlock * blocksPerHour * 24
      const sushiHarvested = user.pool?.sushiHarvested > 0 ? user.pool?.sushiHarvested : 0
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
        sushiRewardPerDay: rewardPerDay,
        liquidityPair: pair,
        rewardPerBlock,
        roiPerBlock,
        roiPerYear,
        sushiHarvested,
        multiplier,
        balanceUSD,
        sushiPrice,
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
  }, [sushiPrice])

  useEffect(() => {
    const fetchData = async () => {
      const results: UserInfo[] = await fetchDataStaked()
      const uniqResult = _.uniq(results)
      const sorted = orderBy(uniqResult, ['id'], ['desc'])
      setUsers(sorted)
    }
    fetchData()
  }, [account, chainId, fetchDataStaked])
  return users
}

export default useMyAccountStaked
