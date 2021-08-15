import { Contract } from '@ethersproject/contracts'
import { BigNumber } from 'ethers'

import { useLpContract } from 'hooks/useContract'
import { useBlockNumber } from 'state/application/hooks'
import { useActiveWeb3React } from '../index'
import { useQuery } from 'react-query'

export default function useLpTokenBalance(pairAddress: string | undefined): BigNumber | undefined {
  const { account } = useActiveWeb3React()
  const block = useBlockNumber()
  const lpContract: Contract | null = useLpContract(pairAddress || '')

  const { data: balance } = useQuery(
    ['useLpTokenBalance', account, pairAddress, block],
    async () => {
      try {
        const balanceToken: BigNumber = await lpContract?.balanceOf(account)
        return balanceToken
      } catch (err) {
        console.log(`err`, err)
        return BigNumber.from(0)
      }
    },
    {
      enabled: Boolean(account && pairAddress)
    }
  )

  return balance ?? BigNumber.from(0)
}
