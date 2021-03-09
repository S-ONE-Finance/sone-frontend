import React from 'react'
import styled from 'styled-components'
import { CheckCircle, Triangle } from 'react-feather'

import { useActiveWeb3React } from '../../hooks'
import { useAllTransactions } from '../../state/transactions/hooks'
import { getEtherscanLink } from '../../utils'

import { ExternalLink } from '../../theme'
import { RowFixed } from '../Row'
import LoaderSone from '../LoaderSone'
import StyledSummary from '../StyledSummary'

const TransactionWrapper = styled.div``

const TransactionStatusText = styled.div`
  padding: 0 0.5rem;
  display: flex;
  align-items: center;
  white-space: pre-wrap;
  flex-wrap: wrap;
  align-items: flex-end; /* Need it to render text pretty with Japanese */

  ::after {
    font-family: 'Inter var', sans-serif;
    content: ' ↗';
    font-size: 14px;
    /* margin-left: 0.25rem; */
    margin-top: -0.25rem;
  }

  :hover {
    text-decoration: underline;
  }
`

const TransactionState = styled(ExternalLink)<{ pending: boolean; success?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none !important;
  border-radius: 0.5rem;
  padding: 0.25rem 0rem;
  font-weight: 500;
  /* font-size: 0.825rem; */
  font-size: 14px;
  color: ${({ theme }) => theme.text1Sone};
`

const IconWrapper = styled.div<{ pending: boolean; success?: boolean }>`
  color: ${({ pending, success, theme }) => (pending ? theme.primary1 : success ? theme.green1 : theme.red1)};
  display: flex;
  align-items: center;
`

export default function TransactionSone({ hash }: { hash: string }) {
  const { chainId } = useActiveWeb3React()
  const allTransactions = useAllTransactions()

  const tx = allTransactions?.[hash]
  // console.log(`tx`, tx)
  const summary = tx?.summary
  const pending = !tx?.receipt
  const success = !pending && tx && (tx.receipt?.status === 1 || typeof tx.receipt?.status === 'undefined')
  // const pending = true
  // const success = false

  if (!chainId) return null

  return (
    <TransactionWrapper>
      <TransactionState href={getEtherscanLink(chainId, hash, 'transaction')} pending={pending} success={success}>
        <RowFixed>
          <IconWrapper pending={pending} success={success}>
            {pending ? <LoaderSone size="24px" /> : success ? <CheckCircle size="24" /> : <Triangle size="24" />}
          </IconWrapper>
          <TransactionStatusText>
            {typeof summary === 'string' || typeof summary === 'undefined' ? (
              summary ?? hash
            ) : (
              <StyledSummary summary={summary} />
            )}
          </TransactionStatusText>
        </RowFixed>
      </TransactionState>
    </TransactionWrapper>
  )
}
