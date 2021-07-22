import { Contract } from '@ethersproject/contracts'
import { TransactionResponse } from '@ethersproject/providers'
import { useMasterFarmerContract } from 'hooks/useContract'
import { useCallback } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'

const useClaimReward = () => {
  const addTransaction = useTransactionAdder()

  const masterContract: Contract | null = useMasterFarmerContract()

  const handleClaimReward = useCallback(
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

  return { onClaimReward: handleClaimReward }
}

export default useClaimReward
