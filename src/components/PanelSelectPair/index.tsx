import { RowBetween } from 'components/Row'
import { PairSelect, TextPanelLabel, StyledTokenName, StyledDropDown } from 'theme'
import React from 'react'
import styled from 'styled-components'
import DoubleCurrencyLogo from '../DoubleLogo'

const Panel = styled(RowBetween)`
  width: 100%;
  height: 86px;
  border-radius: 32px;
  background-color: ${({ theme }) => theme.bgPanels};
  border: ${({ theme }) => `1px solid ${theme.border2Sone}`};
  padding: 0 30px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    height: 50px;
    border-radius: 20px;
    padding: 0 15px;
  `};
`

export default function PanelSelectPair({ pair }: any) {
  const pairName = pair ? `${pair?.token0.symbol || '?'} - ${pair?.token1.symbol || '?'}` : 'Select Pair'

  return (
    <Panel>
      <TextPanelLabel>Pair</TextPanelLabel>
      <PairSelect selected={false}>
        <RowBetween>
          {/* TODO: Chưa responsive ở đây. */}
          <DoubleCurrencyLogo currency0={pair?.token0} currency1={pair?.token1} size={22} margin={true} />
          <StyledTokenName>{pairName}</StyledTokenName>
          <StyledDropDown selected={!!pair} />
        </RowBetween>
      </PairSelect>
    </Panel>
  )
}
