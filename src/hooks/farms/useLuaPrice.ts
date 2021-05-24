import { useCallback, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'

import { useActiveWeb3React } from '../../hooks'
import { IsRopsten } from '../../utils'
import useSushi from './useSushi'
import axios from 'axios'
import { API_URL } from '../../config'
const useLuaPrice = () => {
  const { chainId } = useActiveWeb3React()
  const isRopsten = IsRopsten(chainId)
  const ID = isRopsten ? 3 : 1
  const [price, setPrice] = useState(new BigNumber(0))
  const sushi = useSushi()

  const fetchBalance = useCallback(async () => {
    const { data } = await axios.get(`${API_URL[ID]}/price/LUA`)
    const value = data.usdPrice
    setPrice(new BigNumber(value * 10 ** 8))
  }, [sushi, ID])

  useEffect(() => {
    if (sushi) {
      fetchBalance()
    }
  }, [setPrice, sushi, fetchBalance])

  return price
}

export default useLuaPrice
