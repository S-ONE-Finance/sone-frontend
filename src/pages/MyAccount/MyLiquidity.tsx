import { AutoColumn } from '../../components/Column'
import React from 'react'
import { Card, Heading } from './components'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import { RowBetween, RowFixedGapChildren } from '../../components/Row'
import { ButtonMainRed } from '../../components/Web3Status'
import { ReactComponent as PlusIconSvg } from '../../assets/images/add-liquidity-vector-light.svg'
import styled from 'styled-components'
import { TYPE } from '../../theme'

const PlusIcon = styled(PlusIconSvg)`
  width: 21px;
  height: 21px;
`

function MyLiquidity() {
  const isUpToExtraSmall = useIsUpToExtraSmall()

  return (
    <AutoColumn gap={isUpToExtraSmall ? '10px' : '2rem'} justify="center">
      <RowBetween>
        <Heading>My Liquidity</Heading>
        <ButtonMainRed padding="18px 28px">
          <RowFixedGapChildren gap="8px">
            <PlusIcon />
            <TYPE.mediumHeader>Add Liquidity</TYPE.mediumHeader>
          </RowFixedGapChildren>
        </ButtonMainRed>
      </RowBetween>
      <Card>No information to show</Card>
    </AutoColumn>
  )
}

export default React.memo(MyLiquidity)
