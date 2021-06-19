import React from 'react'
import styled from 'styled-components'
import { Trans } from 'react-i18next'

import { TransactionType, TransactionSummary } from '../../state/transactions/types'

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
  // let i18nKey
  // switch (summary.type) {
  //   case TransactionType.SWAP:
  //     i18nKey = 'summary_swap'
  //     break
  //   case TransactionType.ADD_ONE_TOKEN:
  //     i18nKey = 'summary_add_one_token'
  //     break
  //   case TransactionType.ADD_TWO_TOKENS:
  //     i18nKey = 'summary_add_two_tokens'
  //     break
  //   default:
  //     throw new Error(summary)
  // }
  if (summary.type === TransactionType.SWAP) {
    const i18nKey = 'summary_swap'
    const { inputAmount, inputSymbol, outputAmount, outputSymbol } = summary
    return (
      <Trans
        i18nKey={i18nKey}
        values={{ inputAmount, inputSymbol, outputAmount, outputSymbol }}
        components={[<Red key="red" />, <Bold key="bold" />, <Green key="green" />]}
      />
    )
  }

  if (summary.type === TransactionType.ADD_ONE_TOKEN) {
    const i18nKey = 'summary_add_one_token'
    const { userInputAmount, userInputSymbol } = summary
    return (
      <Trans
        i18nKey={i18nKey}
        values={{ userInputAmount, userInputSymbol }}
        components={[<Red key="red" />, <Bold key="bold" />, <Green key="green" />]}
      />
    )
  }

  if (summary.type === TransactionType.ADD_TWO_TOKENS) {
    const i18nKey = 'summary_add_two_tokens'
    const { currencyAAmount, currencyASymbol, currencyBAmount, currencyBSymbol } = summary
    return (
      <Trans
        i18nKey={i18nKey}
        values={{ currencyAAmount, currencyASymbol, currencyBAmount, currencyBSymbol }}
        components={[<Red key="red" />, <Bold key="bold" />, <Green key="green" />]}
      />
    )
  }

  return null
}
