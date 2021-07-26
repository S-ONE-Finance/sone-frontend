/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Farm, LiquidityPosition, UserInfoSushi } from '@s-one-finance/sdk-core'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import useMyStaked from 'hooks/masterfarmer/useMyStaked'
import useMyLPToken from 'hooks/masterfarmer/useMyLPToken'
import Balances from './components/Balances'
import FarmCards from './components/FarmCards'
import StakingHeader from './components/StakingHeader'
import useFarms from '../../hooks/masterfarmer/useFarms'
import FilterC from './components/FilterC'
import iconFilter from '../../assets/images/icon-filter.svg'
import iconSort from '../../assets/images/icon-sort.svg'

type Options = {
  value: string
  label: string
}

export default function Farms() {
  const { t } = useTranslation()
  const [farmData, setFarmData] = useState<Farm[] | undefined>([])
  const [totalLockValue, setTotalLockValue] = useState<BigNumber>(new BigNumber(0))
  const [circulatingSupplyValue, setCirculatingSupplyValue] = useState<BigNumber>(new BigNumber(0))

  const farms: Farm[] = useFarms()
  const myStaked: UserInfoSushi[] = useMyStaked()
  const myLpToken: LiquidityPosition[] = useMyLPToken()

  const [sortBy, setSortBy] = useState(t('bonus_campaign'))
  const [filter, setFilter] = useState(t('active_pool'))
  const [optionsSort, setOptionsSort] = useState<Options[]>([])
  const [optionsFilter, setOptionsFilter] = useState<Options[]>([])

  const orderBy: { [key: string]: any } = {
    [t('apy')]: {
      condition: 'roiPerYear',
      by: 'desc'
    },
    [t('total_liquidity')]: {
      condition: 'balanceUSD',
      by: 'desc'
    },
    [t('bonus_campaign')]: {
      condition: 'multiplier',
      by: 'desc'
    },
    [t('lp_name')]: {
      condition: 'name',
      by: 'desc'
    }
  }

  useEffect(() => {
    setSortBy(t('bonus_campaign'))
    setFilter(t('active_pool'))

    setOptionsSort([
      {
        label: t('apy'),
        value: t('apy')
      },
      {
        label: t('total_liquidity'),
        value: t('total_liquidity')
      },
      {
        label: t('bonus_campaign'),
        value: t('bonus_campaign')
      },
      {
        label: t('lp_name'),
        value: t('lp_name')
      }
    ])

    setOptionsFilter([
      {
        label: t('active_pool'),
        value: t('active_pool')
      },
      {
        label: t('inactive'),
        value: t('inactive')
      },
      {
        label: t('my_lp_tokens'),
        value: t('my_lp_tokens')
      },
      {
        label: t('staked'),
        value: t('staked')
      }
    ])
  }, [t])

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
        return farm
      })
      setTotalLockValue(totalLock)
      setCirculatingSupplyValue(circulatingSupply)

      // action filter
      let result: Farm[] = []
      switch (filter) {
        case t('active_pool'):
          result = farms.filter((farm: Farm) => Number(farm.allocPoint) !== 0)
          break
        case t('inactive'):
          result = farms.filter((farm: Farm) => Number(farm.allocPoint) === 0)
          break
        case t('my_lp_tokens'):
          const lpTokens = myLpToken.map((lp: LiquidityPosition) => lp.pair.id)
          result = farms.filter((farm: Farm) => lpTokens.includes(farm.pairAddress))
          break
        case t('staked'):
          const pairStaked = myStaked.map(pool => Number(pool.pool?.id))
          result = farms.filter((farm: Farm) => pairStaked.includes(farm.pid))
          break
        default:
          break
      }

      const resultsAfterSort = handlingSortBy(result, sortBy)

      result = _.filter(resultsAfterSort, item => !isNaN(item.roiPerYear))
      setFarmData(result)
    }
  }

  useEffect(() => {
    handlingFilterValue()
  }, [farms, sortBy, filter, myLpToken, myStaked])

  return (
    <StakingWrapper>
      <StakingHeader />
      <WrapTitle>
        <StyledCurrently
          dangerouslySetInnerHTML={{
            __html: t('sone_finance_currently_has_$2,189,400_of_total_locked_value', {
              soneFinance: '<b>S-ONE Finance</b>',
              lockValue: `<span>$${totalLockValue.toNumber()}</span>`
            })
          }}
        />
        <Balances circulatingSupplyValue={circulatingSupplyValue.toNumber()} />
      </WrapTitle>
      <StyledFilterWrap>
        <StyledFilter>
          <FilterC
            title={t('sort_by')}
            icon={iconSort}
            options={optionsSort}
            value={sortBy}
            handleOnchange={e => handleChangeDropDown(e, setSortBy)}
          />
          <FilterC
            title={t('filter')}
            icon={iconFilter}
            options={optionsFilter}
            value={filter}
            handleOnchange={e => handleChangeDropDown(e, setFilter)}
          />
        </StyledFilter>
      </StyledFilterWrap>
      <Box>
        <FarmCards farms={farmData} />
      </Box>
    </StakingWrapper>
  )
}

const StakingWrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.bg15Sone};
`

const Box = styled.div`
  width: 100%;
  margin-bottom: 2.5rem;
  // TODO: refactor hết đống này sử dụng mediaWith.
  @media (min-width: 1200px) {
    background-image: url(${({ theme }) => theme.bgStakingPage});
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: top center;
  }
`

const WrapTitle = styled.div`
  background: ${({ theme }) => theme.bg14Sone};
  width: 100%;
  padding: 23px 21px 34px 36px;
  font-size: 20px;
  // TODO: refactor hết đống này sử dụng mediaWith.
  @media (min-width: 1200px) {
    background: ${({ theme }) => theme.bg13Sone};
    height: 300px;
    padding: 59px 0 71px 0;
    font-size: 45px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
`

const StyledCurrently = styled.div`
  margin-bottom: 18px;
  line-height: 24px;

  & > span {
    color: #65bac5;
    font-weight: 700;
  }

  @media (min-width: 768px) {
    line-height: normal;
  }
  @media (min-width: 1200px) {
    margin-bottom: 30px;
    & > span {
      font-size: 45px;
    }
  }
`

const StyledFilter = styled.div`
  width: 100%;
  min-width: 300px
  max-width: 1000px
  padding: 0 21px 0 25px;
  margin-bottom: 25px;
  @media (min-width: 1024px) {
    display: flex;
    align-items: center;
  }

  @media (min-width: 1200px) {
    padding: 0;
    margin-bottom: 50px;
  }
`

const StyledFilterWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`
