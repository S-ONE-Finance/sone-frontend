import React from 'react'
import styled from 'styled-components'
import Balances from './components/Balances'
import FarmCards from './components/FarmCards'
import StakingHeader from './components/StakingHeader'
import { Filter } from 'react-feather'


export default function Farms() {
  const fakeData = {
    totalLockValue: '1231321212131'
  }

  return (
    <>
      <StakingHeader/>
      <div style={{marginTop: '60px'}}>
        <div style={{ fontSize: 40, color: '#333333', textAlign: 'center' }}>
          <span style={{fontWeight: 'bold'}}>S-ONE Finance</span> Currently Has{' '}
          <span style={{ color: '#65BAC5', fontSize: 40 }}>
            $ {fakeData.totalLockValue}
          </span>{' '}
          Of Total Locked Value
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
        <span style={{marginLeft: '100px'}}>
          <span> <Filter size={16}/> Filter</span>
          <select defaultValue="Active pool">
            <option value="Active pool">Active pool</option>
            <option value="Inactive">Inactive</option>
            <option value="My LP tokens">My LP tokens</option>
            <option value="Staked">Staked</option>
          </select>
        </span>
      </div>
      <Box className="mt-4">
        <FarmCards />
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