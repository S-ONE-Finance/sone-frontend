import { useCallback } from 'react'

import useSushi from './useSushi'

import { useWeb3React } from '@web3-react/core'

import { stake, getMasterChefContract } from '../../sushi/utils'
import { useTransactionAdder } from 'state/transactions/hooks'

const useStake = (pid: number) => {
  const addTransaction = useTransactionAdder()

  const { chainId, account } = useWeb3React()
  const sushi = useSushi()

  const handleStake = useCallback(
    async (amount: string, tokenName: string) => {
      try {
        const txHash = await stake(getMasterChefContract(sushi), pid, amount, account, chainId, addTransaction, {
          tokenName
        })
        console.log('txHash', txHash);
        return txHash
      } catch (ex) {
        return ''
      }
    },
    [account, pid, sushi, addTransaction, chainId]
  )

  return { onStake: handleStake }
}

export default useStake
