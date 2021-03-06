import { Percent } from '@s-one-finance/sdk-core'
import React from 'react'
import { ONE_BIPS } from '../../constants'
import { warningSeverity } from '../../utils/prices'
import { ErrorText } from './styleds'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'

/**
 * Formatted version of price impact text with warning colors
 */
export default function FormattedPriceImpact({ priceImpact }: { priceImpact?: Percent }) {
  const isUpToExtraSmall = useIsUpToExtraSmall()

  return (
    <ErrorText
      fontWeight={700}
      fontSize={isUpToExtraSmall ? 13 : 16}
      severity={warningSeverity(priceImpact)}
      onClick={() => alert(priceImpact?.toSignificant(10))}
    >
      {priceImpact ? (priceImpact.lessThan(ONE_BIPS) ? '<0.01%' : `${priceImpact.toFixed(2)}%`) : '-'}
    </ErrorText>
  )
}
