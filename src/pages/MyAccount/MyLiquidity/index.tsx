import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Heading, Section, SectionButton, SectionText, PlusIcon, CardLiquidity } from '../components'
import { RowBetween, RowFitContent } from '../../../components/Row'
import MyLiquidityItem from './MyLiquidityItem'
import useAddedLiquidityPairs from '../../../hooks/useAddedLiquidityPairs'
import LoaderSone from '../../../components/LoaderSone'

export default function MyLiquidity() {
  const { t } = useTranslation()
  const [isLoading, allPairs] = useAddedLiquidityPairs()
  const [detailPair, setDetailPair] = useState<string | undefined>()

  return (
    <Section>
      <RowBetween>
        <Heading>{t('my_liquidity')}</Heading>
        <SectionButton as={Link} to="/add/ETH">
          <RowFitContent gap="8px">
            <PlusIcon />
            <SectionText>{t('add_liquidity')}</SectionText>
          </RowFitContent>
        </SectionButton>
      </RowBetween>
      <CardLiquidity>
        {isLoading ? (
          <LoaderSone size="24px" />
        ) : allPairs.length > 0 ? (
          allPairs.map(pair => (
            <MyLiquidityItem
              key={pair.liquidityToken.address}
              pair={pair}
              isShowDetailedSection={detailPair === pair.liquidityToken.address}
              setDetailPair={setDetailPair}
            />
          ))
        ) : (
          t('No item to show.')
        )}
      </CardLiquidity>
    </Section>
  )
}
