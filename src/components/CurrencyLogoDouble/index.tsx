import { Currency } from '@s-one-finance/sdk-core'
import React from 'react'
import styled from 'styled-components'
import CurrencyLogo from '../CurrencyLogo'

const Wrapper = styled.div<{ margin: boolean; sizeraw: number }>`
  position: relative;
  display: flex;
  flex-direction: row;
  margin-right: ${({ sizeraw, margin }) => margin && (sizeraw / 3 + 1.5).toString() + 'px'};
  user-select: none;
`

const HigherLogoWrapper = styled.div<{ sizeraw: number }>`
  z-index: 2;
  position: absolute;
  left: ${({ sizeraw }) => (sizeraw / 2).toString() + 'px'} !important;
`

interface CurrencyLogoDoubleProps {
  currency0?: Currency | null
  currency1?: Currency | null
  size?: number
  sizeMobile?: number
  margin?: boolean
}

export default function CurrencyLogoDouble({
  currency0,
  currency1,
  size = 24,
  sizeMobile = 16,
  margin = false
}: CurrencyLogoDoubleProps) {
  return (
    <Wrapper sizeraw={size} margin={margin}>
      {currency0 && <CurrencyLogo currency={currency0} size={size + 'px'} sizeMobile={sizeMobile + 'px'} />}
      {currency1 && (
        <HigherLogoWrapper sizeraw={size}>
          <CurrencyLogo currency={currency1} size={size + 'px'} sizeMobile={sizeMobile + 'px'} />
        </HigherLogoWrapper>
      )}
    </Wrapper>
  )
}
