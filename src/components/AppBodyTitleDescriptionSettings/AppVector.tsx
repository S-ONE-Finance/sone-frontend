import { TransactionType } from './index'
import React, { useMemo } from 'react'
import SwapVectorDark from '../../assets/images/swap-vector-dark.svg'
import SwapVectorLight from '../../assets/images/swap-vector-light.svg'
import AddLiquidityVectorDark from '../../assets/images/add-liquidity-vector-dark.svg'
import AddLiquidityVectorLight from '../../assets/images/add-liquidity-vector-light.svg'
import { useIsDarkMode } from '../../state/user/hooks'
import styled from 'styled-components'

const Vector = styled.img<{ size?: string }>`
  width: ${({ size }) => size || '83.11px'};

  ${({ theme, size }) => theme.mediaWidth.upToExtraSmall`
    width: ${size || '39.59px'};
  `};
`

export default function AppVector({ type, size }: { type: TransactionType; size?: string }) {
  const isDarkMode = useIsDarkMode()

  const vectorSrc = useMemo(() => {
    return type === 'swap'
      ? isDarkMode
        ? SwapVectorDark
        : SwapVectorLight
      : type === 'add_liquidity'
      ? isDarkMode
        ? AddLiquidityVectorDark
        : AddLiquidityVectorLight
      : null
  }, [isDarkMode, type])

  return vectorSrc ? <Vector src={vectorSrc} size={size} alt="vector" /> : null
}
