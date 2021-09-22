import { useCallback } from 'react'
import { Contract } from '@ethersproject/contracts'
import { useWeb3React } from '@web3-react/core'
import { ChainId } from '@s-one-finance/sdk-core'
import { TransactionResponse } from '@ethersproject/providers'

import { useTransactionAdder } from 'state/transactions/hooks'
import { useLpContract } from 'hooks/useContract'
import { MAX_UINT_256, SONE_MASTER_FARMER } from '../../constants'
import { useTranslation } from 'react-i18next'

export default function useApproveHandler(pairAddress?: string) {
  const addTransaction = useTransactionAdder()
  const { chainId } = useWeb3React()
  const lpContract: Contract | null = useLpContract(pairAddress)
  const masterFarmerAddress = SONE_MASTER_FARMER[chainId as ChainId]
  const { t } = useTranslation()

  return useCallback(
    (symbol?: string) => {
      const tx = lpContract
        ?.approve(masterFarmerAddress, MAX_UINT_256)
        .then((txResponse: TransactionResponse) => {
          addTransaction(txResponse, {
            summary: t('approve_eth_sone_lp_token', {
              symbol: symbol ?? '--'
            })
          })
          return txResponse
        })
        .catch((err: any) => {
          console.error(err)
          return undefined
        })
      return tx
    },
    [lpContract, masterFarmerAddress, addTransaction, t]
  )
}
