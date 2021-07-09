import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Balances from './components/Balances'
import FarmCards from './components/FarmCards'
import StakingHeader from './components/StakingHeader'
import { Filter } from 'react-feather'
import useFarms from '../../hooks/masterfarmer/useFarms'
import BigNumber from 'bignumber.js'
import { Farm } from 'hooks/masterfarmer/interfaces'

export default function Farms() {
  //TODO_STAKING: remove fake data
  // const fakeData = {
  //   totalLockValue: '10000000000'
  // }

  const [totalLockValue, setTotalLockValue] = useState<BigNumber>(new BigNumber(0))

  const farms: Farm[] | undefined = useFarms()
  console.log('farms', farms)

  useEffect(() => {
    if (farms) {
      let totalLockValue: BigNumber = new BigNumber(0)
      farms.map((farm: Farm) => {
        totalLockValue = totalLockValue.plus(new BigNumber(farm.tvl | 0))
      })
      setTotalLockValue(totalLockValue)
    }
  }, [farms, setTotalLockValue])

  return (
    <>
      <StakingHeader />
      <div style={{ marginTop: '60px' }}>
        <div style={{ fontSize: 40, color: '#333333', textAlign: 'center' }}>
          <span style={{ fontWeight: 'bold' }}>S-ONE Finance</span> Currently Has{' '}
          <span style={{ color: '#65BAC5', fontSize: 40 }}>$ {totalLockValue.toNumber()}</span> Of Total Locked Value
        </div>
        <Balances />
      </div>
      <div>
        <span>
          <span>Sort by</span>
          <select defaultValue="APY">
            <option value="APY">APY</option>
            <option value="Total liquidity">Total liquidity</option>
            <option value="Bonus campaign">Bonus campaign</option>
            <option value="LP Name">LP Name</option>
          </select>
        </span>
        <span style={{ marginLeft: '100px' }}>
          <span>
            {' '}
            <Filter size={16} /> Filter
          </span>
          <select defaultValue="Active pool">
            <option value="Active pool">Active pool</option>
            <option value="Inactive">Inactive</option>
            <option value="My LP tokens">My LP tokens</option>
            <option value="Staked">Staked</option>
          </select>
        </span>
      </div>
      <Box className="mt-4">
        <FarmCards farms={farms} />
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
