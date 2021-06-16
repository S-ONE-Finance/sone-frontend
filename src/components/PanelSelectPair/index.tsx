import React, { useState } from 'react'
import styled from 'styled-components'
import { Currency, Pair } from '@s-one-finance/sdk-core'

import { PairSelect, TextPanelLabel, StyledTokenName, StyledDropDown } from '../../theme'
import { RowBetween } from '../Row'
import CurrencyLogoDouble from '../CurrencyLogoDouble'
import ModalSearchPair from '../ModalSearchPair'
import { useGetPairFromSubgraphAndParse } from 'subgraph'
import { unwrappedToken } from 'utils/wrappedCurrency'

const PanelWrapper = styled(RowBetween)`
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

type PanelSelectPairProps = {
  selectedPair?: Pair | null
  onPairSelect: (pair: Pair) => void
}

export default function PanelSelectPair({ selectedPair, onPairSelect }: PanelSelectPairProps) {
  const [modalOpen, setModalOpen] = useState(false)

  const handleDismissSearch = () => {
    setModalOpen(false)
  }

  const currency0: Currency | null = selectedPair?.token0 ? unwrappedToken(selectedPair.token0) : null
  const currency1: Currency | null = selectedPair?.token1 ? unwrappedToken(selectedPair.token1) : null

  return (
    <PanelWrapper>
      <TextPanelLabel>Pair</TextPanelLabel>
      <PairSelect
        selected={Boolean(selectedPair)}
        onClick={() => {
          if (modalOpen === false) {
            setModalOpen(true)
          }
        }}
      >
        <RowBetween>
          {Boolean(selectedPair) && (
            <CurrencyLogoDouble currency0={currency0} currency1={currency1} size={22} margin={true} />
          )}
          <StyledTokenName active={Boolean(selectedPair)}>
            {selectedPair ? `${currency0?.symbol || '?'} - ${currency1?.symbol || '?'}` : 'Select Pair'}
          </StyledTokenName>
          <StyledDropDown selected={Boolean(selectedPair)} />
        </RowBetween>
      </PairSelect>
      <ModalSearchPair
        isOpen={modalOpen}
        onDismiss={handleDismissSearch}
        onPairSelect={onPairSelect}
        selectedPair={selectedPair}
      />
    </PanelWrapper>
  )
}
