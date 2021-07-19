import React, { useState } from 'react'
import { Heading, Section, SectionButton, SectionText, PlusIcon, CardLiquidity } from '../components'
import { RowBetween, RowFitContent } from '../../../components/Row'
import MyLiquidityItem from './MyLiquidityItem'
import { Link } from 'react-router-dom'
import useAddedLiquidityPairs from '../../../hooks/useAddedLiquidityPairs'

export default function MyLiquidity() {
  const [isLoading, allPairs] = useAddedLiquidityPairs()
  const [detailPair, setDetailPair] = useState<string | undefined>()

  return (
    <Section>
      <RowBetween>
        <Heading>My Liquidity</Heading>
        <SectionButton as={Link} to="/add/ETH">
          <RowFitContent gap="8px">
            <PlusIcon />
            <SectionText>Add Liquidity</SectionText>
          </RowFitContent>
        </SectionButton>
      </RowBetween>
      <CardLiquidity>
        {isLoading
          ? 'Loading...'
          : allPairs.length > 0
          ? allPairs.map(pair => (
              <MyLiquidityItem
                key={pair.liquidityToken.address}
                pair={pair}
                isShowDetailedSection={detailPair === pair.liquidityToken.address}
                setDetailPair={setDetailPair}
              />
            ))
          : 'No item to show.'}
      </CardLiquidity>
    </Section>
  )
}
