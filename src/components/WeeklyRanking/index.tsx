import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useWeeklyRankingData } from '../../subgraph/hooks'
import Row from '../Row'
import QuestionHelper from '../QuestionHelper'
import { useIsUpToExtraSmall, useIsUpToSmall } from '../../hooks/useWindowSize'
import WeeklyRankingItem from './WeeklyRankingItem'

const Container = styled.div`
  margin-top: 20px;
  display: grid;
  row-gap: 26px;
  grid-template-rows: auto auto;
  grid-template-columns: repeat(5, 1fr);
  background-color: ${({ theme }) => theme.bg1Sone};
  max-width: 602px;
  width: 100%;
  border-radius: 40px;
  padding: 2rem;
  box-shadow: 0 4px 40px rgba(0, 0, 0, 0.15);

  ${({ theme }) => theme.mediaWidth.upToSmall`
    row-gap: 15px;
    padding: 1.5rem;
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 1rem;
    border-radius: 25px;
    row-gap: 10px;
    grid-template-columns: repeat(4, 1fr);
  `}
`

const SpanFullColumns = styled(Row)`
  grid-column: 1 / -1;
`

const Title = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.text6Sone};
  margin-right: 11px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 20px;
    margin-right: 8px;
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 16px;
    margin-right: 4px;
  `}
`

// Ranking theo volume.
const WeeklyRanking = memo(function WeeklyRanking() {
  const { t } = useTranslation()
  const ranking = useWeeklyRankingData()
  const isUpToSmall = useIsUpToSmall()
  const isUpToExtraSmall = useIsUpToExtraSmall()

  const rankingPlaceholder = useMemo(
    () =>
      isUpToExtraSmall
        ? [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
        : [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
    [isUpToExtraSmall]
  )

  return (
    <Container>
      <SpanFullColumns>
        <Title>{t('weekly_ranking')}</Title>
        <QuestionHelper
          text={t('question_helper_weekly_ranking')}
          size={isUpToExtraSmall ? 15 : isUpToSmall ? 19 : 23}
        />
      </SpanFullColumns>
      {(ranking?.length >= 1 ? ranking : rankingPlaceholder).map((item: any) => (
        <WeeklyRankingItem
          key={item?.id}
          id={item?.id}
          address0={item?.token0?.id}
          address1={item?.token1?.id}
          symbol0={item?.token0?.symbol}
          symbol1={item?.token1?.symbol}
          volume={item?.oneWeekVolumeUSD}
        />
      ))}
    </Container>
  )
})

export default WeeklyRanking
