import React, { useCallback } from 'react'
import { useWeeklyRanking } from '../../subgraph'
import CurrencyLogo from '../CurrencyLogo'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import Row, { RowBetween } from '../Row'
import QuestionHelper from '../QuestionHelper'
import { ColumnCenter } from '../Column'
import { getFormatNumber } from '../../subgraph/utils/formatter'

const Container = styled.div`
  display: grid;
  row-gap: 26px;
  grid-template-rows: auto auto;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  background-color: ${({ theme }) => theme.bg1Sone};
  width: 602px;
  border-radius: 40px;
  padding: 2rem;
  box-shadow: 0px 4px 40px rgba(0, 0, 0, 0.15);
`

const SpanFullColumns = styled(Row)`
  grid-column: 1 / -1;
`

const Title = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.text6Sone};
  margin-right: 11px;
`

const TextChange = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text7Sone};
`

const CurrencyLogoContainer = styled(Row)`
  width: fit-content;
  margin-bottom: 11px;
`

// Ranking theo volume.
function WeeklyRanking() {
  const { t } = useTranslation()
  const ranking = useWeeklyRanking()

  const getWeeklyRankingItem = useCallback((address0: string, address1: string, change: number) => {
    return (
      <ColumnCenter>
        <CurrencyLogoContainer>
          <CurrencyLogo address={address0} style={{ marginRight: '3px' }} />
          <CurrencyLogo address={address1} />
        </CurrencyLogoContainer>
        <TextChange>{getFormatNumber(change, 3)}%</TextChange>
      </ColumnCenter>
    )
  }, [])

  if (Array.isArray(ranking) && ranking?.length >= 5) {
    return (
      <Container>
        <SpanFullColumns>
          <Title>{t('weekly-ranking')}</Title>
          <QuestionHelper text={t('question-helper-weekly-ranking')} size={23} />
        </SpanFullColumns>
        {getWeeklyRankingItem(ranking[0].token0.id, ranking[0].token1.id, ranking[0].oneWeekVolumeChangeUSD)}
        {getWeeklyRankingItem(ranking[1].token0.id, ranking[1].token1.id, ranking[1].oneWeekVolumeChangeUSD)}
        {getWeeklyRankingItem(ranking[2].token0.id, ranking[2].token1.id, ranking[2].oneWeekVolumeChangeUSD)}
        {getWeeklyRankingItem(ranking[3].token0.id, ranking[3].token1.id, ranking[3].oneWeekVolumeChangeUSD)}
        {getWeeklyRankingItem(ranking[4].token0.id, ranking[4].token1.id, ranking[4].oneWeekVolumeChangeUSD)}
      </Container>
    )
  }
  return null
}

export default WeeklyRanking
