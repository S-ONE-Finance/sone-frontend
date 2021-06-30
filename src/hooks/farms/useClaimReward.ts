import { useCallback } from 'react'
import useSushi from './useSushi'
import { useWeb3React } from '@web3-react/core'
import { getMasterChefContract, harvest } from '../../sushi/utils'
import { useTransactionAdder } from 'state/transactions/hooks'

const useClaimReward = () => {
  const addTransaction = useTransactionAdder()

  const { chainId, account } = useWeb3React()
  const sushi = useSushi()

  const handleClaimReward = useCallback(
    async (pid: number) => {
      try {
        const txHash = await harvest(getMasterChefContract(sushi), pid, account, chainId, addTransaction)
        return txHash
      } catch (ex) {
        return ''
      }
    },
    [account, sushi, addTransaction, chainId]
  )

  return { onClaimReward: handleClaimReward }
}

export default useClaimReward
