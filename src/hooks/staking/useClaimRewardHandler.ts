import { useCallback } from 'react'
import { Contract } from '@ethersproject/contracts'
import { TransactionResponse } from '@ethersproject/providers'

import { useSoneMasterFarmerContract } from 'hooks/useContract'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useTranslation } from 'react-i18next'

export default function useClaimRewardHandler() {
  const { t } = useTranslation()
  const addTransaction = useTransactionAdder()

  const masterContract: Contract | null = useSoneMasterFarmerContract()

  return useCallback(
    async (pid: number) => {
      try {
        const tx = masterContract
          ?.claimReward(pid)
          .then((txResponse: TransactionResponse) => {
            addTransaction(txResponse, {
              summary: t('claim_reward')
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
    [masterContract, addTransaction, t]
  )
}
