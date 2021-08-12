import { Contract } from '@ethersproject/contracts'
import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useLPContract } from 'hooks/useContract'
import { MASTER_FARMER_ADDRESS } from '../../constants'
import { ChainId } from '@s-one-finance/sdk-core'
import { TransactionResponse } from '@ethersproject/providers'

const MaxUint256 = '999999999900000000000000000000000000000'

const useApprove = (pairAddress: string) => {
  const addTransaction = useTransactionAdder()

  const { chainId } = useWeb3React()
  const masterFarmerAddress = MASTER_FARMER_ADDRESS[chainId as ChainId]

  const lpContract: Contract | null = useLPContract(pairAddress)

  const handleApprove = useCallback(
    async (symbol: string) => {
      try {
        const tx = lpContract
          ?.approve(masterFarmerAddress, MaxUint256)
          .then((txResponse: TransactionResponse) => {
            addTransaction(txResponse, {
              summary: `Approved ${symbol} LP Token`
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
    [lpContract, masterFarmerAddress, addTransaction]
  )

  return { onApprove: handleApprove }
}

export default useApprove
