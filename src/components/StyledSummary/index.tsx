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
  if (summary.type === TransactionType.WRAP) {
    const i18nKey = 'summary_wrap'
    const { wrapAmount } = summary
    return <Trans i18nKey={i18nKey} values={{ wrapAmount }} components={[<Bold key="bold" />]} />
  }

  if (summary.type === TransactionType.UNWRAP) {
    const i18nKey = 'summary_unwrap'
    const { unwrapAmount } = summary
    return <Trans i18nKey={i18nKey} values={{ unwrapAmount }} components={[<Bold key="bold" />]} />
  }

  if (summary.type === TransactionType.APPROVE) {
    const i18nKey = 'summary_approve'
    const { symbol } = summary
    return <Trans i18nKey={i18nKey} values={{ symbol }} components={[<Bold key="bold" />]} />
  }

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
        components={[<Red key="red" />, <Bold key="bold" />]}
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
        components={[<Red key="red" />, <Bold key="bold" />]}
      />
    )
  }

  if (summary.type === TransactionType.WITHDRAW) {
    const i18nKey = 'summary_withdraw'
    const { currencyAAmount, currencyASymbol, currencyBAmount, currencyBSymbol } = summary
    return (
      <Trans
        i18nKey={i18nKey}
        values={{ currencyAAmount, currencyASymbol, currencyBAmount, currencyBSymbol }}
        components={[<Green key="green" />, <Bold key="bold" />]}
      />
    )
  }

  if (summary.type === TransactionType.STAKE) {
    const i18nKey = 'summary_stake'
    const { amount, symbol } = summary
    return <Trans i18nKey={i18nKey} values={{ amount, symbol }} components={[<Red key="red" />, <Bold key="bold" />]} />
  }

  if (summary.type === TransactionType.UNSTAKE) {
    const i18nKey = 'summary_unstake'
    const { amount, symbol } = summary
    return (
      <Trans i18nKey={i18nKey} values={{ amount, symbol }} components={[<Green key="green" />, <Bold key="bold" />]} />
    )
  }

  if (summary.type === TransactionType.CLAIM_REWARD) {
    const i18nKey = 'summary_claim_reward'
    const { amount } = summary
    return <Trans i18nKey={i18nKey} values={{ amount }} components={[<Green key="green" />, <Bold key="bold" />]} />
  }

  if (summary.type === TransactionType.UNLOCK_SONE) {
    const i18nKey = 'summary_unlock_sone'
    const { amount } = summary
    return <Trans i18nKey={i18nKey} values={{ amount }} components={[<Green key="green" />, <Bold key="bold" />]} />
  }

  return null
}
