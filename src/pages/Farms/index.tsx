import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import Balances from './components/Balances'
import FarmCards from './components/FarmCards'
import StakingHeader from './components/StakingHeader'
import { Filter } from 'react-feather'
import useFarms from '../../hooks/masterfarmer/useFarms'
import BigNumber from 'bignumber.js'
import { Farm, LiquidityPosition, UserInfoSushi } from '@s-one-finance/sdk-core'
import _ from 'lodash'
import useMyStaked from 'hooks/masterfarmer/useMyStaked'
import useMyLPToken from 'hooks/masterfarmer/useMyLPToken'

export default function Farms() {
  const [farmData, setFarmData] = useState<Farm[] | undefined>([])
  const [totalLockValue, setTotalLockValue] = useState<BigNumber>(new BigNumber(0))
  const [circulatingSupplyValue, setCirculatingSupplyValue] = useState<BigNumber>(new BigNumber(0))
  const [sortBy, setSortBy] = useState('Bonus campaign')
  const [filter, setFilter] = useState('Active pool')

  const farms: Farm[] = useFarms()
  const myStaked: UserInfoSushi[] = useMyStaked()
  const myLpToken: LiquidityPosition[] = useMyLPToken()

  const handleSortBy = useCallback((e: React.FormEvent<HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement
    setSortBy(target.value)
  }, [])

  const handleFilter = useCallback((e: React.FormEvent<HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement
    setFilter(target.value)
  }, [])

  useEffect(() => {
    if (farms) {
      let totalLock: BigNumber = new BigNumber(0)
      let circulatingSupply: BigNumber = new BigNumber(0)
      farms.map((farm: Farm) => {
        totalLock = totalLock.plus(new BigNumber(farm.tvl | 0))
        circulatingSupply = circulatingSupply.plus(new BigNumber(farm.sushiHarvested | 0))
        return farm
      })
      setTotalLockValue(totalLock)
      setCirculatingSupplyValue(circulatingSupply)

      // action filter
      let result
      switch (filter) {
        case 'Active pool':
          result = farms.filter((farm: Farm) => Number(farm.allocPoint) !== 0)
          break
        case 'Inactive':
          result = farms.filter((farm: Farm) => Number(farm.allocPoint) === 0)
          break
        case 'My LP tokens':
          const lpTokens = myLpToken.map((lp: LiquidityPosition) => lp.pair.id)
          result = farms.filter((farm: Farm) => lpTokens.includes(farm.pairAddress))
          break
        case 'Staked':
          const pairStaked = myStaked.map(pool => Number(pool.pool?.id))
          result = farms.filter((farm: Farm) => pairStaked.includes(farm.pid))
          break
        default:
          break
      }
      // action sort
      switch (sortBy) {
        case 'APY':
          result = _.orderBy(result, ['roiPerYear'], ['desc'])
          break
        case 'Total liquidity':
          result = _.orderBy(result, ['balanceUSD'], ['desc'])
          break
        case 'Bonus campaign':
          result = _.orderBy(result, ['multiplier'], ['desc'])
          break
        case 'LP Name':
          result = _.orderBy(result, ['name'], ['desc'])
          break
        default:
          break
      }
      result = result && result.filter(item => !isNaN(item.roiPerYear))
      console.log('result', result)
      setFarmData(result)
    }
  }, [farms, setTotalLockValue, sortBy, filter, setFarmData, myLpToken, myStaked])

  return (
    <>
      <StakingHeader />
      <div style={{ marginTop: '60px' }}>
        <div style={{ fontSize: 40, color: '#333333', textAlign: 'center' }}>
          <span style={{ fontWeight: 'bold' }}>S-ONE Finance</span> Currently Has{' '}
          <span style={{ color: '#65BAC5', fontSize: 40 }}>$ {totalLockValue.toNumber()}</span> Of Total Locked Value
        </div>
        <Balances circulatingSupplyValue={circulatingSupplyValue.toNumber()} />
      </div>
      <div>
        <span>
          <span>Sort by</span>
          <select value={sortBy} onChange={handleSortBy}>
            <option value="APY">APY</option>
            <option value="Total liquidity">Total liquidity</option>
            <option value="Bonus campaign">Bonus campaign</option>
            <option value="LP Name">LP Name</option>
          </select>
        </span>
        <span style={{ marginLeft: '100px' }}>
          <span>
            <Filter size={16} /> Filter
          </span>
          <select value={filter} onChange={handleFilter}>
            <option value="Active pool">Active pool</option>
            <option value="Inactive">Inactive</option>
            <option value="My LP tokens">My LP tokens</option>
            <option value="Staked">Staked</option>
          </select>
        </span>
      </div>
      <Box className="mt-4">
        <FarmCards farms={farmData} />
      </Box>
    </>
  )
}

const Box = styled.div`
  &.mt-4 {
    margin-top: 40px;
    @media (max-width: 767px) {
      margin-top: 30px;
    }
  }
`
