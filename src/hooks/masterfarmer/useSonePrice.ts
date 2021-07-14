import { exchange } from 'apollo/client'
import { pairsQueryDetail } from 'apollo/queries'
import { useActiveWeb3React } from 'hooks'
import { useEffect, useState } from 'react'

const useSonePrice = () => {
  const { account, chainId } = useActiveWeb3React()
  const [price, setPrice] = useState(0)
  let SONE_ADDRESS = '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2' // token sone
  let WETH_ADDRESS = '0xdac17f958d2ee523a2206206994597c13d831ec7' // token WETH
  let [token0, token1] = ['', '']
  if (SONE_ADDRESS > WETH_ADDRESS) {
    ;[token0, token1] = [WETH_ADDRESS, SONE_ADDRESS]
  } else {
    ;[token0, token1] = [SONE_ADDRESS, WETH_ADDRESS]
  }
  useEffect(() => {
    ;(async () => {
      const result: any = await exchange.query({
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
  }, [account, chainId, setPrice])
  return price
}

export default useSonePrice
