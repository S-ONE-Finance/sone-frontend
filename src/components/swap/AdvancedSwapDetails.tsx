import React from 'react'
import { useLastTruthy } from '../../hooks/useLast'
import { AdvancedSwapDetailsContent, AdvancedSwapDetailsProps } from './AdvancedSwapDetailsContent'

export default function AdvancedSwapDetails({ trade, ...rest }: AdvancedSwapDetailsProps) {
  const lastTrade = useLastTruthy(trade)

  return trade ? <AdvancedSwapDetailsContent {...rest} trade={trade ?? lastTrade ?? undefined} /> : null
}
