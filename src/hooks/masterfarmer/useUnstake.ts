import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { Contract } from '@ethersproject/contracts'
import { TransactionResponse } from '@ethersproject/providers'

import { useMasterFarmerContract } from 'hooks/useContract'
import { useTransactionAdder } from 'state/transactions/hooks'

const useUnstake = (pid: number) => {
  const addTransaction = useTransactionAdder()
  const masterContract: Contract | null = useMasterFarmerContract()

  const handleUnstake = useCallback(
    async (amount: string, symbol: string) => {
      try {
        const tx = masterContract
          ?.withdraw(pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
          .then((txResponse: TransactionResponse) => {
            addTransaction(txResponse, {
              summary: `Unstake ${amount} ${symbol} LP Token`
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

  return { onUnstake: handleUnstake }
}

export default useUnstake
