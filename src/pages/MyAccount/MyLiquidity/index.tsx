import React from 'react'
import { Card, Heading, Section, SectionButton, SectionText } from '../components'
import { RowBetween, RowFitContent } from '../../../components/Row'
import MyLiquidityItem from './MyLiquidityItem'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { ReactComponent as PlusIconSvg } from '../../../assets/images/add-liquidity-vector-light.svg'
import useAddedLiquidityPairs from '../../../hooks/useAddedLiquidityPairs'

const PlusIcon = styled(PlusIconSvg)`
  width: 21px;
  min-width: 21px;
  height: auto;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 16px;
    min-width: 16px;  
  `}
`

const CardLiquidity = styled(Card)`
  border-radius: 15px;
  flex-direction: column;

  & > *:nth-child(even) {
    background-color: ${({ theme }) => theme.bg6Sone};
  }

  & > *:first-child {
    border-radius: 15px 15px 0 0;
  }

  & > *:last-child {
    border-radius: 0 0 15px 15px;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    border-radius: 15px;  
  `}
`

export default function MyLiquidity() {
  const [isLoading, allPairs] = useAddedLiquidityPairs()

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
          ? allPairs.map(pair => <MyLiquidityItem key={pair.liquidityToken.address} pair={pair} />)
          : 'No item to show.'}
      </CardLiquidity>
    </Section>
  )
}
