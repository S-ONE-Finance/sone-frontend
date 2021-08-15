import { useEffect, useState } from 'react'
import { Contract } from '@ethersproject/contracts'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { ChainId } from '@s-one-finance/sdk-core'

import { useLpContract } from '../useContract'
import { SONE_MASTER_FARMER_ADDRESS } from '../../constants/'
import { useBlockNumber } from '../../state/application/hooks'
import useUnmountedRef from '../useUnmountedRef'

export default function useAllowance(pairAddress?: string): BigNumber {
  const [allowance, setAllowance] = useState(new BigNumber(0))
  const { account, chainId } = useWeb3React()
  const lpContract: Contract | null = useLpContract(pairAddress)
  const masterFarmerAddress = SONE_MASTER_FARMER_ADDRESS[chainId as ChainId]
  const block = useBlockNumber()
  const unmountedRef = useUnmountedRef()

  useEffect(() => {
    ;(async () => {
      try {
        if (allowance.toString() !== '0') return
        const newAllowance = await lpContract?.allowance(account, masterFarmerAddress)
        if (newAllowance !== undefined && !unmountedRef.current) setAllowance(newAllowance)
      } catch (e) {
        console.error(e)
      }
    })()
  }, [account, lpContract, masterFarmerAddress, block, allowance, unmountedRef])

  return allowance
}
