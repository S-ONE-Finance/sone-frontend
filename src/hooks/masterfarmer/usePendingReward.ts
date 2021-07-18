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
    if (pid) {
      try {
        const pending: BigNumber = await masterContract?.pendingReward(pid, account)
        setPendingReward(pending)
      } catch (err) {
        console.error(err)
      }
    }
  }, [account, masterContract, setPendingReward])

  useEffect(() => {
    if (account) {
      fetchPending()
    }
  }, [account, fetchPending, pid])

  return pendingReward
}

export default usePendingReward
