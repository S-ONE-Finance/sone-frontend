import React from 'react'
import styled from 'styled-components'
import { Trans } from 'react-i18next'

import { TransactionSummary } from '../../state/transactions/reducer'

const Bold = styled.span`
  font-weight: 700;
`

const Red = styled(Bold)`
  color: ${({ theme }) => theme.red1Sone};
`

const Green = styled(Bold)`
  color: ${({ theme }) => theme.green1};
`

export default function StyledSummary({ summary }: { summary: TransactionSummary }) {
  if (summary.type === 'swap') {
    const { inputAmount, inputSymbol, outputAmount, outputSymbol } = summary
    return (
      <Trans
        i18nKey="summarySwap"
        values={{ inputAmount, inputSymbol, outputAmount, outputSymbol }}
        components={[<Red key="red" />, <Bold key="bold" />, <Green key="green" />]}
      />
    )
  } else {
    throw new Error(`Not exist summary: ${summary}`)
  }
}
