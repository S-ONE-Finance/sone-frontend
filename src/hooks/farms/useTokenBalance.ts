import { useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { getBalance } from '../../sushi/format/erc20'
import { useBlockNumber } from 'state/application/hooks'

const useTokenBalance = (tokenAddress: string, account?: string) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account: defaultAccount, library: ethereum } = useWeb3React()
  const block = useBlockNumber()

  const fetchBalance = async (_ethereum: any, _address: string, _account: string) => {
    const balance = await getBalance(_ethereum.provider as any, _address, _account)
    setBalance(new BigNumber(balance))
  }

  useEffect(() => {
    if (ethereum) {
      if (account) {
        fetchBalance(ethereum, tokenAddress, account)
      } else if (defaultAccount) {
        fetchBalance(ethereum, tokenAddress, defaultAccount)
      }
    }
  }, [account, defaultAccount, ethereum, tokenAddress, block])

  return balance
}

export default useTokenBalance
