import React, { useMemo } from 'react'
import styled from 'styled-components'

import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'
import { TransactionDetails } from '../../state/transactions/reducer'

import { ExternalLink, TYPE } from '../../theme'
import Column from '../Column'
import TransactionSone from './TransactionSone'
import Row from '../Row'

const ColumnScroll = styled(Column)`
  padding-left: 0;
  padding-right: 0;
  padding-bottom: 0.5rem;
  max-height: 200px;
  overflow-x: hidden;
  overflow-y: auto;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    max-height: 25vh;
  `}
`

const TransactionList = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};

  > * {
    margin-bottom: 0.25rem;
  }
`

const ViewMore = styled(ExternalLink)`
  color: ${({ theme }) => theme.red1Sone}
  cursor: pointer;
  font-weight: 400;
  font-size: 14px;
  margin-bottom: 0.5rem;
`

// We want the latest one to come first, so return negative if a is after b.
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

function renderTransactions(transactions: string[]) {
  return (
    <TransactionList>
      {transactions.map((hash, i) => {
        return <TransactionSone key={i} hash={hash} />
      })}
    </TransactionList>
  )
}

export default function RecentTransactions({ isSmall = false }: { isSmall?: boolean }) {
  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)
  const confirmed = sortedRecentTransactions.filter(tx => tx.receipt).map(tx => tx.hash)

  return (
    <ColumnScroll>
      <TYPE.red1Sone marginBottom={'0.75rem'} fontSize={isSmall ? '18px' : '20px'} fontWeight={700}>
        Transaction History
      </TYPE.red1Sone>
      {pending.length || confirmed.length ? (
        <>
          {renderTransactions(pending)}
          {renderTransactions(confirmed)}
          <Row justify={'center'}>
            {/* TODO: href chưa fill. */}
            <ViewMore href="#">View more</ViewMore>
          </Row>
        </>
      ) : (
        <TYPE.subText paddingBottom={'0.75rem'}>Your recent transactions will appear here...</TYPE.subText>
      )}
    </ColumnScroll>
  )
}
