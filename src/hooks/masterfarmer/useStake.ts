import { Contract } from '@ethersproject/contracts'
import { TransactionResponse } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { useMasterFarmerContract } from 'hooks/useContract'
import { useCallback } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'

const useStake = (pid: number) => {
  const addTransaction = useTransactionAdder()
  const { chainId, account } = useWeb3React()
  const masterContract: Contract | null = useMasterFarmerContract()

  const handleStake = useCallback(
    async (amount: string, symbol: string) => {
      try {
        const tx = masterContract
          ?.deposit(pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
          .then((txResponse: TransactionResponse) => {
            addTransaction(txResponse, {
              summary: `Staked ${amount} ${symbol} LP Token`
            })
            return txResponse
          })
          .catch((err: any) => console.log('err', err))
        return tx
      } catch (e) {
        return false
      }
    },
    [account, pid, addTransaction, chainId]
  )

  return { onStake: handleStake }
}

export default useStake
