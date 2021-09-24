import { useCallback } from 'react'
import { Contract } from '@ethersproject/contracts'
import { TransactionResponse } from '@ethersproject/providers'

import { useSoneContract } from 'hooks/useContract'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useTranslation } from 'react-i18next'

export default function useUnlockHandler() {
  const addTransaction = useTransactionAdder()
  const soneContract: Contract | null = useSoneContract()
  const { t } = useTranslation()

  return useCallback(async () => {
    try {
      const tx = soneContract
        ?.unlock()
        .then((txResponse: TransactionResponse) => {
          addTransaction(txResponse, {
            summary: t('unlock_sone')
          })
          return txResponse
        })
        .catch((err: any) => console.log('err', err))
      return tx
    } catch (e) {
      console.error(e)
      return false
    }
  }, [soneContract, addTransaction, t])
}
