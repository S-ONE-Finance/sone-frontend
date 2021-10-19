import { useCallback } from 'react'
import { Contract } from '@ethersproject/contracts'
import { TransactionResponse } from '@ethersproject/providers'

import { useSoneContract } from 'hooks/useContract'
import { useTransactionAdder } from 'state/transactions/hooks'
import { TransactionType } from '../../state/transactions/types'

export default function useUnlockHandler() {
  const addTransaction = useTransactionAdder()
  const soneContract: Contract | null = useSoneContract()

  return useCallback(
    async (amount: string) => {
      try {
        const tx = soneContract
          ?.unlock()
          .then((txResponse: TransactionResponse) => {
            addTransaction(txResponse, {
              summary: {
                type: TransactionType.UNLOCK_SONE,
                amount
              }
            })
            return txResponse
          })
          .catch((err: any) => console.log('err', err))
        return tx
      } catch (e) {
        console.error(e)
        return false
      }
    },
    [soneContract, addTransaction]
  )
}
