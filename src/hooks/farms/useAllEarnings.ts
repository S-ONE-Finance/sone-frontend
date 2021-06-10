import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { useCallback, useEffect, useState } from 'react'
import { getEarned, getFarms, getMasterChefContract } from '../../sushi/utils'
import useSushi from './useSushi'

const useAllEarnings = () => {
  const [balances, setBalance] = useState([] as Array<BigNumber>)
  const { account, chainId } = useWeb3React()
  const sushi = useSushi()
  const farms = getFarms(sushi)
  const masterChefContract = getMasterChefContract(sushi)
  const block = 0 //useBlock()

  const fetchAllBalances = useCallback(async () => {
    const data: Array<BigNumber> = await Promise.all(
      farms.map(
        ({ pid }: any) =>
          new Promise(async resolve => {
            resolve(await getEarned(masterChefContract, pid, account))
          })
      )
    )
    setBalance(data)
  }, [account, masterChefContract, sushi])

  useEffect(() => {
    if (account && masterChefContract && sushi) {
      fetchAllBalances()
    }
  }, [account, block, masterChefContract, setBalance, sushi])

  return balances
}

export default useAllEarnings
