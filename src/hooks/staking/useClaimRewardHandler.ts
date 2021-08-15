import { useCallback } from 'react'
import { Contract } from '@ethersproject/contracts'
import { TransactionResponse } from '@ethersproject/providers'

import { useSoneMasterFarmerContract } from 'hooks/useContract'
import { useTransactionAdder } from 'state/transactions/hooks'

export default function useClaimRewardHandler() {
  const addTransaction = useTransactionAdder()

  const masterContract: Contract | null = useSoneMasterFarmerContract()

  return useCallback(
    async (pid: number) => {
      try {
        const tx = masterContract
          ?.claimReward(pid)
          .then((txResponse: TransactionResponse) => {
            addTransaction(txResponse, {
              summary: 'Claim reward success'
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
    [masterContract, addTransaction]
  )
}
