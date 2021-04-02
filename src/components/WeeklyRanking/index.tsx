import React, { useCallback, useMemo } from 'react'
import { useWeeklyRanking } from '../../subgraph'
import CurrencyLogo from '../CurrencyLogo'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import Row from '../Row'
import QuestionHelper from '../QuestionHelper'
import { ColumnCenter } from '../Column'
import { getFormatNumber } from '../../subgraph/utils/formatter'
import { useWindowSize } from '../../hooks/useWindowSize'
import { ExternalLink, MEDIA_WIDTHS } from '../../theme'

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

const TextChange = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text7Sone};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;
  `}
`

const CurrencyLogoContainer = styled(Row)`
  width: fit-content;
  margin-bottom: 11px;
`

// Ranking theo volume.
function WeeklyRanking() {
  const { t } = useTranslation()
  const ranking = useWeeklyRanking()
  const { width } = useWindowSize()

  const rankingPlaceholder = useMemo(
    () =>
      width && width <= MEDIA_WIDTHS.upToExtraSmall
        ? [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
        : [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
    [width]
  )

  const getWeeklyRankingItem = useCallback((key: string, address0: string, address1: string, change: number) => {
    return (
      // TODO: Sau này đổi thành link của sone info.
      <ExternalLink href={`https://info.uniswap.org/pair/${key}`} key={key}>
        <ColumnCenter>
          <CurrencyLogoContainer>
            <CurrencyLogo address={address0} style={{ marginRight: '3px' }} />
            <CurrencyLogo address={address1} />
          </CurrencyLogoContainer>
          <TextChange>{getFormatNumber(change, 3)}%</TextChange>
        </ColumnCenter>
      </ExternalLink>
    )
  }, [])

  return (
    <Container>
      <SpanFullColumns>
        <Title>{t('weekly-ranking')}</Title>
        <QuestionHelper
          text={t('question-helper-weekly-ranking')}
          size={width && width <= MEDIA_WIDTHS.upToExtraSmall ? 15 : width && width <= MEDIA_WIDTHS.upToSmall ? 19 : 23}
        />
      </SpanFullColumns>
      {(ranking?.length >= 1 ? ranking : rankingPlaceholder).map((item: any) =>
        getWeeklyRankingItem(item?.id, item?.token0?.id, item?.token1?.id, item?.oneWeekVolumeChangeUSD)
      )}
    </Container>
  )
}

export default WeeklyRanking
