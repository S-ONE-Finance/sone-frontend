import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { Contract } from '@ethersproject/contracts'
import { TransactionResponse } from '@ethersproject/providers'

import { useSoneMasterFarmerContract } from 'hooks/useContract'
import { useTransactionAdder } from 'state/transactions/hooks'
import { TransactionType } from '../../state/transactions/types'
import { plainNumber } from '../../utils/formatNumber'

export default function useUnstakeHandler(pid: number) {
  const addTransaction = useTransactionAdder()
  const masterContract: Contract | null = useSoneMasterFarmerContract()

  return useCallback(
    async (amount: string, symbol: string) => {
      try {
        const tx = masterContract
          ?.withdraw(pid, plainNumber(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()))
          .then((txResponse: TransactionResponse) => {
            addTransaction(txResponse, {
              summary: {
                type: TransactionType.UNSTAKE,
                amount,
                symbol
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
    [masterContract, pid, addTransaction]
  )
}
