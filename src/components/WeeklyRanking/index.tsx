import React, { useCallback } from 'react'
import { useWeeklyRanking } from '../../subgraph'
import CurrencyLogo from '../CurrencyLogo'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import Row from '../Row'
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
  box-shadow: 0 4px 40px rgba(0, 0, 0, 0.15);
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

  const getWeeklyRankingItem = useCallback((key: string, address0: string, address1: string, change: number) => {
    return (
      <ColumnCenter key={key}>
        <CurrencyLogoContainer>
          <CurrencyLogo address={address0} style={{ marginRight: '3px' }} />
          <CurrencyLogo address={address1} />
        </CurrencyLogoContainer>
        <TextChange>{getFormatNumber(change, 3)}%</TextChange>
      </ColumnCenter>
    )
  }, [])

  return (
    <Container>
      <SpanFullColumns>
        <Title>{t('weekly-ranking')}</Title>
        <QuestionHelper text={t('question-helper-weekly-ranking')} size={23} />
      </SpanFullColumns>
      {(ranking?.length >= 1 ? ranking : [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]).map((item: any) =>
        getWeeklyRankingItem(item?.id, item?.token0?.id, item?.token1?.id, item?.oneWeekVolumeChangeUSD)
      )}
    </Container>
  )
}

export default WeeklyRanking
