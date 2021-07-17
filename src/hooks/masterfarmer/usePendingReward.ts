import { Contract } from '@ethersproject/contracts'
import { useWeb3React } from '@web3-react/core'
import { BigNumber } from 'ethers'
import { useMasterFarmerContract } from 'hooks/useContract'
import { useCallback, useEffect, useState } from 'react'

const usePendingReward = (pid: number) => {
  const [pendingReward, setPendingReward] = useState(BigNumber.from(0))
  const { account } = useWeb3React()
  const masterContract: Contract | null = useMasterFarmerContract()

  const fetchPending = useCallback(async () => {
    const pending: BigNumber = await masterContract?.pendingReward(pid, account)
    setPendingReward(pending)
  }, [account, masterContract, setPendingReward])

  useEffect(() => {
    if (account) {
      fetchPending()
    }
  }, [account, fetchPending])

  return pendingReward
}

export default usePendingReward
