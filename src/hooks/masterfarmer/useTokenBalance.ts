import { Contract } from '@ethersproject/contracts'
import { BigNumber } from 'ethers'
import { useLPContract } from 'hooks/useContract'
import { useCallback, useEffect, useState } from 'react'
import { useBlockNumber } from 'state/application/hooks'
import { useActiveWeb3React } from '../index'

const useTokenBalance = (pairAddress: string | undefined): BigNumber | undefined => {
  const [balance, setBalance] = useState(BigNumber.from(0))
  const { account } = useActiveWeb3React()
  const block = useBlockNumber()
  const lpContract: Contract | null = useLPContract('0x81f154163602dac421cd71bd36a17b0d8b1706b8')

  const fetchBalance = useCallback(async () => {
    try {
      const balanceToken: BigNumber = await lpContract?.balanceOf(account)
      setBalance(balanceToken)
    } catch (e) {
      console.error(e)
    }
  }, [account, lpContract])

  useEffect(() => {
    if (account) {
      fetchBalance()
    }
  }, [account, fetchBalance, block])

  if (!account) {
    return undefined
  }

  return balance
}

export default useTokenBalance
