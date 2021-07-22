/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import _ from 'lodash'
import { Farm, LiquidityPosition, MyStaked } from 'hooks/masterfarmer/interfaces'
import useMyStaked from 'hooks/masterfarmer/useMyStaked'
import useMyLPToken from 'hooks/masterfarmer/useMyLPToken'
import Balances from './components/Balances'
import FarmCards from './components/FarmCards'
import StakingHeader from './components/StakingHeader'
import useFarms from '../../hooks/masterfarmer/useFarms'
import FilterC from './components/FilterC'
import iconFilter from '../../assets/images/icon-filter.svg'
import iconSort from '../../assets/images/icon-sort.svg'

export default function Farms() {
  const [farmData, setFarmData] = useState<Farm[] | undefined>([])
  const [totalLockValue, setTotalLockValue] = useState<BigNumber>(new BigNumber(0))
  const [circulatingSupplyValue, setCirculatingSupplyValue] = useState<BigNumber>(new BigNumber(0))

  const farms: Farm[] = useFarms()
  const myStaked: MyStaked[] = useMyStaked()
  const myLpToken: LiquidityPosition[] = useMyLPToken()

  const [sortBy, setSortBy] = useState('Bonus campaign')
  const [filter, setFilter] = useState('Active pool')
  const [optionsSort] = useState([
    {
      label: 'APY',
      value: 'APY'
    },
    {
      label: 'Total liquidity',
      value: 'Total liquidity'
    },
    {
      label: 'Bonus campaign',
      value: 'Bonus campaign'
    },
    {
      label: 'LP Name',
      value: 'LP Name'
    }
  ])

  const [optionsFilter] = useState([
    {
      label: 'Active pool',
      value: 'Active pool'
    },
    {
      label: 'Inactive',
      value: 'Inactive'
    },
    {
      label: 'My LP tokens',
      value: 'My LP tokens'
    },
    {
      label: 'Staked',
      value: 'Staked'
    }
  ])

  const orderBy: { [key: string]: any } = {
    APY: {
      condition: 'roiPerYear',
      by: 'desc'
    },
    'Total liquidity': {
      condition: 'balanceUSD',
      by: 'desc'
    },
    'Bonus campaign': {
      condition: 'multiplier',
      by: 'desc'
    },
    'LP Name': {
      condition: 'name',
      by: 'desc'
    }
  }

  const handlingSortBy = (results: Farm[], sortType: string) => {
    const item = orderBy[sortType]
    results = _.orderBy(results, [item.condition], [item.by])
    return results || {}
  }

  const handleChangeDropDown = (value: string, callback: (item: string) => void) => {
    callback(value)
  }

  const handlingFilterValue = () => {
    if (farms) {
      let totalLock: BigNumber = new BigNumber(0)
      let circulatingSupply: BigNumber = new BigNumber(0)
      farms.map((farm: Farm) => {
        totalLock = totalLock.plus(new BigNumber(farm.tvl | 0))
        circulatingSupply = circulatingSupply.plus(new BigNumber(farm.sushiHarvested | 0))
      })
      setTotalLockValue(totalLock)
      setCirculatingSupplyValue(circulatingSupply)

      // action filter
      let result: Farm[] = []
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
          const pairStaked = myStaked.map(pool => Number(pool.pool.id))
          result = farms.filter((farm: Farm) => pairStaked.includes(farm.pid))
          break
        default:
          break
      }

      const resultsAfterSort = handlingSortBy(result, sortBy)

      result = resultsAfterSort.filter(item => !isNaN(item.roiPerYear))
      setFarmData(result)
    }
  }

  useEffect(() => {
    handlingFilterValue()
  }, [farms, sortBy, filter])

  return (
    <>
      <StakingHeader />
      <WrapTitle>
        <StyledCurrently>
          <b>S-ONE Finance</b> Currently Has <span>${totalLockValue.toNumber()}</span> Of Total Locked Value
        </StyledCurrently>
        <Balances circulatingSupplyValue={circulatingSupplyValue.toNumber()} />
      </WrapTitle>
      <StyledFilterWrap>
        <FilterC
          title="Sort by"
          icon={iconSort}
          options={optionsSort}
          value={sortBy}
          handleOnchange={e => handleChangeDropDown(e, setSortBy)}
        />
        <FilterC
          title="Filter"
          icon={iconFilter}
          options={optionsFilter}
          value={filter}
          handleOnchange={e => handleChangeDropDown(e, setFilter)}
        />
      </StyledFilterWrap>
      <Box>
        <FarmCards farms={farmData} />
      </Box>
    </>
  )
}

const Box = styled.div``
const WrapTitle = styled.div`
  padding: 25px;
  font-size: 20px;
  @media (min-width: 1200px) {
    font-size: 45px;
  }
`

const StyledCurrently = styled.div`
  margin-bottom: 20px;
  & > span {
    color: #65bac5;
    font-weight: 700;
  }
  @media (min-width: 1200px) {
    & > span {
      font-size: 45px;
    }
  }
`

const StyledFilterWrap = styled.div`
  width: 100%;
  min-width: 300px
  max-width: 1000px
  padding: 0 25px;
  @media (min-width: 1024px) {
    display: flex;
    align-items: center;
  }
`
