import { useCallback, useEffect, useState } from 'react'
import { Contract } from '@ethersproject/contracts'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { useLPContract } from '../useContract'
import { MASTER_FARMER_ADDRESS } from '../../constants/'
import { ChainId } from '@s-one-finance/sdk-core'

const useAllowance = (pairAddress: string) => {
  const [allowance, setAllowance] = useState(new BigNumber(0))
  const { account, chainId } = useWeb3React()
  const lpContract: Contract | null = useLPContract(pairAddress)
  const masterFarmerAddress = MASTER_FARMER_ADDRESS[chainId as ChainId]

  const fetchAllowance = useCallback(async () => {
    try {
      const allowance: BigNumber = await lpContract?.allowance(account, masterFarmerAddress)
      setAllowance(allowance)
    } catch (e) {
      console.error(e)
    }
  }, [account, lpContract, masterFarmerAddress])

  useEffect(() => {
    if (fetchAllowance) {
      fetchAllowance()
    }
  }, [fetchAllowance, lpContract])

  return allowance
}

export default useAllowance
