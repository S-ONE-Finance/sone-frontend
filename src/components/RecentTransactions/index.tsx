import React, { useMemo } from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { useTranslation } from 'react-i18next'

import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'
import { TransactionDetails } from '../../state/transactions/reducer'

import { TYPE } from '../../theme'
import Column from '../Column'
import TransactionSone from './TransactionSone'

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

  /* width */
  ::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background-color: ${({ theme }) => theme.divider1Sone};
    /* border-radius: 10px; */
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.scrollbarThumb};
    /* border-radius: 10px; */
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background-color: ${({ theme }) => `${darken(0.05, theme.scrollbarThumb)}`};
  }
`

const TransactionList = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};

  > * {
    margin-bottom: 0.25rem;
  }
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

export default function RecentTransactions({ inMobileMenu = false }: { inMobileMenu?: boolean }) {
  const { t } = useTranslation()

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)
  const confirmed = sortedRecentTransactions.filter(tx => tx.receipt).map(tx => tx.hash)

  return (
    <ColumnScroll>
      <TYPE.red1Sone marginBottom={'0.75rem'} fontSize={inMobileMenu ? '18px' : '20px'} fontWeight={700}>
        {t('transactionHistory')}
      </TYPE.red1Sone>
      {pending.length || confirmed.length ? (
        <>
          {renderTransactions(pending)}
          {renderTransactions(confirmed)}
        </>
      ) : (
        <TYPE.subText paddingBottom={'0.75rem'}>{t('emptyRecentTransactionsMessage')}</TYPE.subText>
      )}
    </ColumnScroll>
  )
}
