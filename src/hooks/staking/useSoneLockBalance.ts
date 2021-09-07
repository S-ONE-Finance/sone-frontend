import { useEffect, useState } from 'react'
import { Contract } from '@ethersproject/contracts'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'

import { useSoneContract } from '../useContract'
import { useBlockNumber } from '../../state/application/hooks'
import useUnmountedRef from '../useUnmountedRef'

export default function useSoneLockBalance() {
  const [soneCanUnlock, setSoneCanUnlock] = useState(new BigNumber(0))
  const [totalSoneLocked, setTotalSoneLocked] = useState(new BigNumber(0))
  const { account } = useWeb3React()
  const soneContract: Contract | null = useSoneContract()
  const block = useBlockNumber()
  const unmountedRef = useUnmountedRef()

  useEffect(() => {
    ;(async () => {
      try {
        const newSoneCanUnlock = await soneContract?.canUnlockAmount(account)
        const newTotalSoneLocked = await soneContract?.lockOf(account)
        if (newSoneCanUnlock !== undefined && newTotalSoneLocked !== undefined && !unmountedRef.current) {
          setSoneCanUnlock(newSoneCanUnlock)
          setTotalSoneLocked(newTotalSoneLocked)
        }
      } catch (e) {
        console.error(e)
      }
    })()
  }, [account, block, unmountedRef, soneContract])

  return { soneCanUnlock, totalSoneLocked }
}
