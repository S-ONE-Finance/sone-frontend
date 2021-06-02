import React, { useMemo } from 'react'
import SwapVectorDark from '../../assets/images/swap-vector-dark.svg'
import SwapVectorLight from '../../assets/images/swap-vector-light.svg'
import AddLiquidityVectorDark from '../../assets/images/add-liquidity-vector-dark.svg'
import AddLiquidityVectorLight from '../../assets/images/add-liquidity-vector-light.svg'
import { useIsDarkMode } from '../../state/user/hooks'
import styled from 'styled-components'
import { TransactionType } from '../../state/transactions/types'

const Vector = styled.img<{ size?: string; sizeMobile?: string }>`
  width: ${({ size }) => size || '83.11px'};

  ${({ theme, sizeMobile }) => theme.mediaWidth.upToExtraSmall`
    width: ${sizeMobile || '39.59px'};
  `};
`

export default function AppVector({
  transactionType,
  size,
  sizeMobile
}: {
  transactionType: TransactionType
  size?: string
  sizeMobile?: string
}) {
  const isDarkMode = useIsDarkMode()

  const vectorSrc = useMemo(() => {
    return transactionType === TransactionType.SWAP
      ? isDarkMode
        ? SwapVectorDark
        : SwapVectorLight
      : TransactionType.ADD
      ? isDarkMode
        ? AddLiquidityVectorDark
        : AddLiquidityVectorLight
      : null
  }, [isDarkMode, transactionType])

  return vectorSrc ? <Vector src={vectorSrc} size={size} sizeMobile={sizeMobile} alt="vector" /> : null
}
