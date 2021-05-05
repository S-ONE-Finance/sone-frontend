import { useWeb3React } from '@web3-react/core'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { NetworkContextName } from '../../constants'
import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'
import { TransactionDetails } from '../../state/transactions/reducer'

import LoaderSone from '../LoaderSone'
import { useTranslation } from 'react-i18next'

const PendingBox = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  align-items: center;
  user-select: none;
  background: ${({ theme }) => theme.bg1Sone};
  color: ${({ theme }) => theme.text3Sone};
  font-weight: 500;

  :hover,
  :focus {
    outline: none;
  }
`

const Text = styled.p`
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 0 0 0.5rem;
  font-size: 1rem;
  width: fit-content;
  font-weight: 500;
`

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

function Web3StatusInner() {
  const { t } = useTranslation()

  const { account } = useWeb3React()

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)

  const hasPendingTransactions = !!pending.length

  if (account && hasPendingTransactions) {
    return (
      <PendingBox>
        <LoaderSone size={'18px'} />
        <Text>
          {pending?.length} {t('pending')}
        </Text>
      </PendingBox>
    )
  } else {
    return null
  }
}

export default function Web3Status() {
  const { active } = useWeb3React()
  const contextNetwork = useWeb3React(NetworkContextName)

  if (!contextNetwork.active && !active) {
    return null
  }

  return <Web3StatusInner />
}
