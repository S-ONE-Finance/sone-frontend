import React, { useState } from 'react'
import { Heading, Section, SectionButton, SectionText, PlusIcon, CardStaking, StakingList } from '../components'
import { RowBetween, RowFitContent } from '../../../components/Row'
import MyStakingItem from './MyStakingItem'
import { Link } from 'react-router-dom'
import useAddedLiquidityPairs from '../../../hooks/useAddedLiquidityPairs'
import OverallNetAPY from './OverallNetAPY'

export default function MyStaking() {
  const [isLoading, allPairs] = useAddedLiquidityPairs()
  const [detailPair, setDetailPair] = useState<string | undefined>()

  return (
    <Section>
      <RowBetween>
        <Heading>My Staking</Heading>
        <SectionButton as={Link} to="/add/ETH">
          <RowFitContent gap="8px">
            <PlusIcon />
            <SectionText>Stake</SectionText>
          </RowFitContent>
        </SectionButton>
      </RowBetween>
      <CardStaking>
        <OverallNetAPY />
        <StakingList>
          {isLoading
            ? 'Loading...'
            : allPairs.length > 0
            ? allPairs.map(pair => (
                <MyStakingItem
                  key={pair.liquidityToken.address}
                  pair={pair}
                  isShowDetailedSection={detailPair === pair.liquidityToken.address}
                  setDetailPair={setDetailPair}
                />
              ))
            : 'No item to show.'}
        </StakingList>
      </CardStaking>
    </Section>
  )
}
