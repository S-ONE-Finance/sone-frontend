import { useCallback } from 'react'

import useSushi from './useSushi'
import { useWeb3React } from '@web3-react/core'
import { Contract } from 'web3-eth-contract'

import { approve, getMasterChefContract } from '../../sushi/utils'
import { useTransactionAdder } from 'state/transactions/hooks'

const useApprove = (lpContract: Contract) => {
  const addTransaction = useTransactionAdder()

  const { chainId, account } = useWeb3React()
  const sushi = useSushi()
  const masterChefContract = getMasterChefContract(sushi)

  const handleApprove = useCallback(async (tokenName) => {
    try {
      // TODO: Chưa có summary.
      const tx = await approve(lpContract, masterChefContract, account, chainId, addTransaction, {
        tokenName
      })
      return tx
    } catch (e) {
      return false
    }
  }, [account, lpContract, masterChefContract, chainId, addTransaction])

  return { onApprove: handleApprove }
}

export default useApprove
