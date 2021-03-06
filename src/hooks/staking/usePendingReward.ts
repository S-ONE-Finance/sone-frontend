import { useMemo } from 'react'
import { BigNumber } from 'ethers'
import { Contract } from '@ethersproject/contracts'
import { useWeb3React } from '@web3-react/core'
import { useQuery } from 'react-query'

import { useSoneMasterFarmerContract } from 'hooks/useContract'
import { useBlockNumber } from 'state/application/hooks'
import { useLastTruthy } from 'hooks/useLast'

export default function usePendingReward(pid?: number): BigNumber {
  const { account } = useWeb3React()
  const block = useBlockNumber()
  const masterContract: Contract | null = useSoneMasterFarmerContract()

  const { data: pendingRewardQueryResult } = useQuery(
    ['usePendingReward', account, pid, block],
    async () => {
      try {
        return await masterContract?.pendingReward(pid, account)
      } catch (err) {
        console.error(err)
      }
    },
    {
      enabled: Boolean(account && pid !== undefined && !isNaN(pid))
    }
  )

  const pendingReward = useLastTruthy(pendingRewardQueryResult) ?? undefined

  return useMemo(() => pendingReward ?? BigNumber.from(0), [pendingReward])
}

export function useManyPendingReward(pids?: number[]): { [id: number]: BigNumber } {
  const { account } = useWeb3React()
  const masterContract: Contract | null = useSoneMasterFarmerContract()

  const { data: pendingRewards } = useQuery(
    ['useManyPendingReward', account, pids],
    async () => {
      try {
        if (!Array.isArray(pids)) return {}
        const res = await Promise.all(pids.map(id => masterContract?.pendingReward(id, account)))
        return res.reduce(
          (accum, pendingReward, index) => ({
            ...accum,
            [pids[index]]: pendingReward
          }),
          {}
        )
      } catch (err) {
        console.error(err)
        return {}
      }
    },
    {
      enabled: Boolean(account && Array.isArray(pids) && pids.length > 0)
    }
  )

  return useMemo(() => pendingRewards || {}, [pendingRewards])
}
