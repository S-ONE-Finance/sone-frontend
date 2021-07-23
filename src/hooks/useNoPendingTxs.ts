import { useWeb3React } from '@web3-react/core'
import { NetworkContextName } from '../constants'
import { isTransactionRecent, useAllTransactions } from '../state/transactions/hooks'
import { useMemo } from 'react'
import { TransactionDetails } from '../state/transactions/reducer'

// We want the latest one to come first, so return negative if a is after b.
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

export default function useNoPendingTxs(): number | undefined {
  const { active, account } = useWeb3React()
  const contextNetwork = useWeb3React(NetworkContextName)

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions: Array<TransactionDetails> = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = useMemo(() => sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash), [
    sortedRecentTransactions
  ])

  if (!contextNetwork.active && !active) return undefined

  if (!account || pending.length === 0) return undefined

  return pending.length
}
