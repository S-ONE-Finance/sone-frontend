import { Contract } from '@ethersproject/contracts'
import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useLPContract } from 'hooks/useContract'
import { MASTER_FARMER_ADDRESS } from '../../constants'
import { ChainId } from '@s-one-finance/sdk-core'
import { TransactionResponse } from '@ethersproject/providers'

const useApprove = (pairAddress: string) => {
  const addTransaction = useTransactionAdder()

  const { chainId, account } = useWeb3React()
  const masterFarmerAddress = MASTER_FARMER_ADDRESS[chainId as ChainId]

  const lpContract: Contract | null = useLPContract('0x9019e228ac3524885c803dc6fbfb7e6111a5f049')

  const handleApprove = useCallback(
    async (tokenName: string) => {
      try {
        const tx = lpContract
          ?.approve(account, masterFarmerAddress)
          .then((data: TransactionResponse) => {
            console.log('data', data)
          })
          .catch((err: any) => console.log('err', err))
        return tx
      } catch (e) {
        return false
      }
    },
    [account, lpContract, chainId, addTransaction]
  )

  return { onApprove: handleApprove }
}

export default useApprove
