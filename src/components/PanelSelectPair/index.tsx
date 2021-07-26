import React, { useState } from 'react'
import styled from 'styled-components'
import { Pair } from '@s-one-finance/sdk-core'
import { useTranslation } from 'react-i18next'

import { PairSelect, StyledDropDown, StyledTokenName, TextPanelLabel } from '../../theme'
import { RowBetween } from '../Row'
import CurrencyLogoDouble from '../CurrencyLogoDouble'
import ModalSearchPair from '../ModalSearchPair'
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
  isLoading: boolean
  allPairs: Array<Pair>
}

export default function PanelSelectPair({ selectedPair, onPairSelect, isLoading, allPairs }: PanelSelectPairProps) {
  const { t } = useTranslation()
  const [modalOpen, setModalOpen] = useState(false)

  const handleDismissSearch = () => {
    setModalOpen(false)
  }

  const currency0 = selectedPair?.token0 ? unwrappedToken(selectedPair.token0) : undefined
  const currency1 = selectedPair?.token1 ? unwrappedToken(selectedPair.token1) : undefined

  return (
    <PanelWrapper>
      <TextPanelLabel>{t('pair')}</TextPanelLabel>
      <PairSelect
        selected={Boolean(selectedPair)}
        onClick={() => {
          if (!modalOpen) {
            setModalOpen(true)
          }
        }}
      >
        <RowBetween>
          {Boolean(selectedPair) && (
            <CurrencyLogoDouble currency0={currency0} currency1={currency1} size={22} margin={true} />
          )}
          <StyledTokenName active={Boolean(selectedPair)}>
            {selectedPair ? `${currency0?.symbol || '?'} - ${currency1?.symbol || '?'}` : t('select_a_pair')}
          </StyledTokenName>
          <StyledDropDown selected={Boolean(selectedPair)} />
        </RowBetween>
      </PairSelect>
      <ModalSearchPair
        isOpen={modalOpen}
        onDismiss={handleDismissSearch}
        onPairSelect={onPairSelect}
        selectedPair={selectedPair}
        isLoading={isLoading}
        allPairs={allPairs}
      />
    </PanelWrapper>
  )
}
