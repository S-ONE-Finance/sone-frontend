import React from 'react'
import styled from 'styled-components'
import { Trans } from 'react-i18next'

import { isSummaryTwoToken, TransactionType, TransactionSummary } from '../../state/transactions/types'

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
  if (isSummaryTwoToken(summary)) {
    const { token0Amount, token0Symbol, token1Amount, token1Symbol } = summary
    let i18nKey
    switch (summary.type) {
      case TransactionType.SWAP:
        i18nKey = 'summary_swap'
        break
      case TransactionType.ADD:
        i18nKey = 'summary_add'
        break
      default:
        console.error('This type of summary does not exist. Summary:', summary)
    }
    return (
      <Trans
        i18nKey={i18nKey}
        values={{ token0Amount, token0Symbol, token1Amount, token1Symbol }}
        components={[<Red key="red" />, <Bold key="bold" />, <Green key="green" />]}
      />
    )
  } else {
    throw new Error(`Not exist summary: ${summary}`)
  }
}
