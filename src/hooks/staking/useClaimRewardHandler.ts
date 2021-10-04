import { useCallback } from 'react'
import { Contract } from '@ethersproject/contracts'
import { TransactionResponse } from '@ethersproject/providers'

import { useSoneMasterFarmerContract } from 'hooks/useContract'
import { useTransactionAdder } from 'state/transactions/hooks'
import { TransactionType } from '../../state/transactions/types'

export default function useClaimRewardHandler() {
  const addTransaction = useTransactionAdder()

  const masterContract: Contract | null = useSoneMasterFarmerContract()

  return useCallback(
    async (pid: number, formattedClaimReward: string) => {
      try {
        const tx = masterContract
          ?.claimReward(pid)
          .then((txResponse: TransactionResponse) => {
            addTransaction(txResponse, {
              summary: {
                type: TransactionType.CLAIM_REWARD,
                amount: formattedClaimReward
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
    [masterContract, addTransaction]
  )
}
