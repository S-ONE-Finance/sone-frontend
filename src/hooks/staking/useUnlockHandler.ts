import { useCallback } from 'react'
import { Contract } from '@ethersproject/contracts'
import { TransactionResponse } from '@ethersproject/providers'
import BigNumber from 'bignumber.js'

import { useSoneContract } from 'hooks/useContract'
import { useTransactionAdder } from 'state/transactions/hooks'

export default function useUnlockHandler() {
  const addTransaction = useTransactionAdder()
  const soneContract: Contract | null = useSoneContract()

  return useCallback(async () => {
    try {
      const tx = soneContract
        ?.unlock()
        .then((txResponse: TransactionResponse) => {
          addTransaction(txResponse, {
            summary: `Unlock SONE transaction completed`
          })
          return txResponse
        })
        .catch((err: any) => console.log('err', err))
      return tx
    } catch (e) {
      console.error(e)
      return false
    }
  }, [soneContract, addTransaction])
}
