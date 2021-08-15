import { useEffect, useState } from 'react'

import { pairsQueryDetail } from 'apollo/queries'
import { swapClients } from '../../subgraph/clients'
import { useActiveWeb3React } from '../index'

const useSonePrice = () => {
  const { chainId } = useActiveWeb3React()
  const [price, setPrice] = useState(0)
  // TODO: Thay địa chỉ sone và usdt thật ứng với chainId.
  const SONE_ADDRESS = '0x45495bE0FE306679BA8001cD4b10A781a7BBB559'
  const USDT_ADDRESS = '0x393397Baae01Dc19678220E4D3Fd34FDA4FeBd1D'
  let [token0, token1] = ['', '']

  if (SONE_ADDRESS > USDT_ADDRESS) {
    ;[token0, token1] = [USDT_ADDRESS, SONE_ADDRESS]
  } else {
    ;[token0, token1] = [SONE_ADDRESS, USDT_ADDRESS]
  }

  useEffect(() => {
    ;(async () => {
      const result: any = await swapClients[chainId ?? 1].query({
        query: pairsQueryDetail,
        variables: {
          token0: token0.toLowerCase(),
          token1: token1.toLowerCase()
        }
      })
      const pool = result?.data.pairs[0]
      if (pool) {
        if (pool.token0.id === SONE_ADDRESS) {
          setPrice(pool.token1Price)
        } else {
          setPrice(pool.token0Price)
        }
      } else {
        setPrice(0)
      }
    })()
  }, [chainId, token0, token1])

  return price
}

export default useSonePrice
