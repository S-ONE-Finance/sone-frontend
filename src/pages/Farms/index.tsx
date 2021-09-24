/* eslint-disable @typescript-eslint/camelcase */
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Farm, LiquidityPosition, UserInfoSone } from '@s-one-finance/sdk-core'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import Balances from './Balances'
import FarmCards from './FarmCards'
import StakingHeader from './StakingHeader'
import FilterC from './FilterC'
import { pxToRem } from '../../utils/PxToRem'
import iconFilter from '../../assets/images/icon-filter.svg'
import iconSort from '../../assets/images/icon-sort.svg'
import useFarms from '../../hooks/staking/useFarms'
import useMyStaked from '../../hooks/staking/useMyStaked'
import useMyLpToken from '../../hooks/staking/useMyLpToken'
import { getNumberCommas } from '../../utils/formatNumber'

export type SORT_KEY = 'apy' | 'total_liquidity' | 'bonus_campaign' | 'lp_name'
export type SortOptions = { [p in SORT_KEY]: string }
export type FILTER_KEY = 'active_pool' | 'inactive' | 'my_lp_tokens' | 'staked'
export type FilterOptions = { [p in FILTER_KEY]: string }

export default function Farms() {
  const { t } = useTranslation()

  const [sortedFilteredFarms, setSortedFilteredFarms] = useState<Farm[] | undefined>([])
  const [totalLockValue, setTotalLockValue] = useState<BigNumber>(new BigNumber(0))
  const [circulatingSupplyValue, setCirculatingSupplyValue] = useState<BigNumber>(new BigNumber(0))
  const [isLoading, farms] = useFarms()
  const myStaked: UserInfoSone[] = useMyStaked()
  const myLpToken: LiquidityPosition[] = useMyLpToken()

  const [sortBy, setSortBy] = useState<SORT_KEY>('bonus_campaign')
  const [filterBy, setFilterBy] = useState<FILTER_KEY>('active_pool')

  const sortOptions: SortOptions = useMemo(
    () => ({
      apy: t('apy'),
      total_liquidity: t('total_liquidity'),
      bonus_campaign: t('bonus_campaign'),
      lp_name: t('lp_name')
    }),
    [t]
  )

  const filterOptions: FilterOptions = useMemo(
    () => ({
      active_pool: t('active_pool'),
      inactive: t('inactive'),
      my_lp_tokens: t('my_lp_tokens'),
      staked: t('staked')
    }),
    [t]
  )

  const orderByOptions: { [key in SORT_KEY]: any } = useMemo(
    () => ({
      apy: {
        condition: 'roiPerYear',
        by: 'desc'
      },
      total_liquidity: {
        condition: 'balanceUSD',
        by: 'desc'
      },
      bonus_campaign: {
        condition: 'multiplier',
        by: 'desc'
      },
      lp_name: {
        condition: 'name',
        by: 'asc'
      }
    }),
    []
  )

  const onSortByChange = (value: SORT_KEY) => {
    setSortBy(value)
  }

  const onFilterByChange = (value: FILTER_KEY) => {
    setFilterBy(value)
  }

  useEffect(() => {
    if (farms) {
      let newSortedFilteredFarms: Farm[] = []
      if (filterBy) {
        switch (filterBy) {
          case 'active_pool':
            newSortedFilteredFarms = farms.filter((farm: Farm) => Number(farm.allocPoint) !== 0)
            break
          case 'inactive':
            newSortedFilteredFarms = farms.filter((farm: Farm) => Number(farm.allocPoint) === 0)
            break
          case 'my_lp_tokens':
            const lpTokens = myLpToken.map((lp: LiquidityPosition) => lp.pair.id)
            newSortedFilteredFarms = farms.filter((farm: Farm) => lpTokens.includes(farm.pairAddress))
            break
          case 'staked':
            const pairStaked = myStaked.map(pool => Number(pool.pool?.id))
            newSortedFilteredFarms = farms.filter((farm: Farm) => pairStaked.includes(farm.pid))
            break
          default:
            throw new Error(`filterBy can't be empty.`)
        }
      }
      if (sortBy) {
        const orderBy = orderByOptions[sortBy]
        newSortedFilteredFarms = _.orderBy(newSortedFilteredFarms, [orderBy.condition], [orderBy.by])
        setSortBy(sortBy)
      } else {
        throw new Error(`sortBy can't be empty.`)
      }
      setSortedFilteredFarms(newSortedFilteredFarms)
    }
  }, [farms, filterBy, myLpToken, myStaked, orderByOptions, sortBy])

  // Calculate totalLockValue & circulatingSupplyValue
  useEffect(() => {
    if (farms) {
      let totalLock: BigNumber = new BigNumber(0)
      let circulatingSupply: BigNumber = new BigNumber(0)
      farms.forEach((farm: Farm) => {
        totalLock = totalLock.plus(new BigNumber(farm.tvl | 0))
        circulatingSupply = circulatingSupply.plus(new BigNumber(farm.soneHarvested || 0))
      })
      setTotalLockValue(totalLock)
      setCirculatingSupplyValue(circulatingSupply)
    }
  }, [farms])

  return (
    <StakingWrapper>
      <StakingHeader />
      <WrapTitle>
        <StyledCurrently
          dangerouslySetInnerHTML={{
            __html: t('sone_finance_currently_has_123456_of_total_locked_value', {
              soneFinance: '<b>S-ONE Finance</b>',
              lockValue: `<span>$${totalLockValue.toNumber()}</span>`
            })
          }}
        />
        <Balances circulatingSupplyValue={getNumberCommas(circulatingSupplyValue.toString())} />
      </WrapTitle>
      <StyledFilterWrap>
        <StyledFilter>
          <FilterC
            title={t('sort_by')}
            icon={iconSort}
            options={sortOptions}
            optionKey={sortBy}
            onChange={onSortByChange}
          />
          <FilterC
            title={t('filter')}
            icon={iconFilter}
            options={filterOptions}
            optionKey={filterBy}
            onChange={onFilterByChange}
          />
        </StyledFilter>
      </StyledFilterWrap>
      <Box>
        <FarmCards isLoading={isLoading} farms={sortedFilteredFarms} />
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
      font-size: 1.875rem; // 30px.
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
