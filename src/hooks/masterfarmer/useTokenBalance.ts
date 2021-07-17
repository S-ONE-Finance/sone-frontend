import { useCallback, useEffect, useState } from 'react'
import { BigNumber } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { useBlockNumber } from 'state/application/hooks'
import { useLPContract } from 'hooks/useContract'
import { MASTER_FARMER_ADDRESS } from '../../constants/'
import { ChainId } from '@s-one-finance/sdk-core'
import { Contract } from '@ethersproject/contracts'

const useTokenBalance = (pairAddress: string) => {
  const [balance, setBalance] = useState(BigNumber.from(0))
  const { account, chainId } = useWeb3React()
  const block = useBlockNumber()
  const lpContract: Contract | null = useLPContract('0x81f154163602dac421cd71bd36a17b0d8b1706b8')
  const masterFarmerAddress = MASTER_FARMER_ADDRESS[chainId as ChainId]

  const fetchBalance = useCallback(async () => {
    const balanceToken: BigNumber = await lpContract?.balanceOf(account)
    setBalance(balanceToken)
  }, [account, masterFarmerAddress, setBalance])

  useEffect(() => {
    if (account) {
      fetchBalance()
    }
  }, [account, fetchBalance, block])

  return balance
}

export default useTokenBalance
