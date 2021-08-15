import { useCallback } from 'react'
import { Contract } from '@ethersproject/contracts'
import { TransactionResponse } from '@ethersproject/providers'
import BigNumber from 'bignumber.js'

import { useSoneMasterFarmerContract } from 'hooks/useContract'
import { useTransactionAdder } from 'state/transactions/hooks'

export default function useStakeHandler(pid: number) {
  const addTransaction = useTransactionAdder()
  const masterContract: Contract | null = useSoneMasterFarmerContract()

  return useCallback(
    async (amount: string, symbol: string) => {
      try {
        const tx = masterContract
          ?.deposit(pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
          .then((txResponse: TransactionResponse) => {
            addTransaction(txResponse, {
              summary: `Stake (Staking??) ${amount} ${symbol} LP Token`
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
