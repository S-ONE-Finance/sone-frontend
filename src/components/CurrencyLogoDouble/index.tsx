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
  position: absolute;
  left: ${({ sizeraw }) => (sizeraw / 2).toString() + 'px'} !important;
`

interface CurrencyLogoDoubleProps {
  currency0?: Currency
  currency1?: Currency
  token0Address?: string
  token1Address?: string
  size?: number
  sizeMobile?: number
  margin?: boolean
}

/**
 * Có thể truyền vào Currency hoặc address để render ra icon của currency.
 * @param currency0
 * @param currency1
 * @param token0Address
 * @param token1Address
 * @param size
 * @param sizeMobile
 * @param margin
 * @constructor
 */
export default function CurrencyLogoDouble({
  currency0,
  currency1,
  token0Address,
  token1Address,
  size = 24,
  sizeMobile = 16,
  margin = false
}: CurrencyLogoDoubleProps) {
  return (
    <Wrapper sizeraw={size} margin={margin}>
      <CurrencyLogo currency={currency0} address={token0Address} size={size + 'px'} sizeMobile={sizeMobile + 'px'} />
      {currency1 && (
        <HigherLogoWrapper sizeraw={size}>
          <CurrencyLogo
            currency={currency1}
            address={token1Address}
            size={size + 'px'}
            sizeMobile={sizeMobile + 'px'}
          />
        </HigherLogoWrapper>
      )}
    </Wrapper>
  )
}
