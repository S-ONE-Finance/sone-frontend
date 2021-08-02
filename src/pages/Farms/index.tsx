/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Farm, LiquidityPosition, UserInfoSushi } from '@s-one-finance/sdk-core'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import useMyStaked from 'hooks/masterfarmer/useMyStaked'
import useMyLPToken from 'hooks/masterfarmer/useMyLPToken'
import Balances from './Balances'
import FarmCards from './FarmCards'
import StakingHeader from './StakingHeader'
import useFarms from '../../hooks/masterfarmer/useFarms'
import FilterC from './FilterC'
import { pxToRem } from '../../utils/PxToRem'
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
  margin-bottom: 4.75rem;
  background-image: url(${({ theme }) => theme.bgStakingPage});
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: top center;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    background-image: unset;
    margin-bottom: 8.75rem;
  `}

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-bottom: 7.75rem;
  `}
`

const WrapTitle = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.bg13Sone};
  padding: ${pxToRem(76)} 0 ${pxToRem(51)} 0;
  font-size: ${pxToRem(45)};
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    background: ${({ theme }) => theme.bg14Sone};
    padding: 1.4375rem 1.3125rem 2.125rem 2.25rem;
    font-size: 20px;
  `}
}
`

const StyledCurrently = styled.div`
  margin-bottom: ${pxToRem(40)};
  text-align: center;
  font-size: ${pxToRem(45)};
  & > span {
    color: #65bac5;
    font-weight: 700;
    font-size: 3.75rem; // 60px;
  }

  ${({ theme }) => theme.mediaWidth.upToLarge`
  font-size: ${pxToRem(30)};
    & > span {
      font-size: 1.875rem; // 35px.
    }
  `}

  ${({ theme }) => theme.mediaWidth.upToMedium`
  font-size: ${pxToRem(20)};
  text-align: left;
  margin-bottom: ${pxToRem(18)};
    & > span {
      font-size: 1.875rem; // 30px.
    }
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-bottom: ${pxToRem(18)};
  `}
`

const StyledFilter = styled.div`
  width: 100%;
  min-width: ${pxToRem(300)};
  max-width: ${pxToRem(1000)};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin-bottom: ${pxToRem(50)};

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: column;
    margin-bottom: ${pxToRem(25)};
    padding: 0 1.3125rem 0 1.5625rem;
  `}
`

const StyledFilterWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`
