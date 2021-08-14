import { useEffect, useRef, useState } from 'react'
import { Contract } from '@ethersproject/contracts'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { ChainId } from '@s-one-finance/sdk-core'

import { useLPContract } from '../useContract'
import { MASTER_FARMER_ADDRESS } from '../../constants/'
import { useBlockNumber } from '../../state/application/hooks'

export default function useAllowance(pairAddress?: string): BigNumber {
  const [allowance, setAllowance] = useState(new BigNumber(0))
  const { account, chainId } = useWeb3React()
  const lpContract: Contract | null = useLPContract(pairAddress)
  const masterFarmerAddress = MASTER_FARMER_ADDRESS[chainId as ChainId]
  const block = useBlockNumber()

  const isUnmounted = useRef(false)

  useEffect(() => {
    return () => {
      isUnmounted.current = true
    }
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        if (allowance.toString() !== '0') return
        const newAllowance = await lpContract?.allowance(account, masterFarmerAddress)
        if (newAllowance !== undefined && !isUnmounted.current) setAllowance(newAllowance)
      } catch (e) {
        console.error(e)
      }
    })()
  }, [account, lpContract, masterFarmerAddress, block, allowance])

  return allowance
}
