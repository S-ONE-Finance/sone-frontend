import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { Contract } from '@ethersproject/contracts'
import { TransactionResponse } from '@ethersproject/providers'

import { useSoneMasterFarmerContract } from 'hooks/useContract'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useTranslation } from 'react-i18next'

export default function useUnstakeHandler(pid: number) {
  const addTransaction = useTransactionAdder()
  const masterContract: Contract | null = useSoneMasterFarmerContract()
  const { t } = useTranslation()

  return useCallback(
    async (amount: string, symbol: string) => {
      try {
        const tx = masterContract
          ?.withdraw(pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
          .then((txResponse: TransactionResponse) => {
            addTransaction(txResponse, {
              summary: t('unstake_123_eth_lp_token', { amount, symbol })
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
    [masterContract, pid, addTransaction, t]
  )
}
