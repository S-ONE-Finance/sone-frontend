import { useQuery } from 'react-query'

import { pairsQueryDetail } from 'graphql/stakingQueries'
import { swapClients } from '../../graphql/clients'
import { useActiveWeb3React } from '../index'
import { SONE_PRICE_MINIMUM } from '../../constants'
import { useMemo } from 'react'

/**
 * 1 SONE === `useSonePrice()` USDT.
 */
export default function useSonePrice(): number {
  const { chainId } = useActiveWeb3React()
  // TODO: Thay địa chỉ sone và usdt thật ứng với chainId.
  const SONE_ADDRESS = '0x45495bE0FE306679BA8001cD4b10A781a7BBB559'
  const USDT_ADDRESS = '0x393397Baae01Dc19678220E4D3Fd34FDA4FeBd1D'
  const [token0, token1] = SONE_ADDRESS > USDT_ADDRESS ? [USDT_ADDRESS, SONE_ADDRESS] : [SONE_ADDRESS, USDT_ADDRESS]

  const { data: sonePrice } = useQuery<number>(
    ['useSonePrice', chainId, token0, token1],
    async () => {
      const data = await swapClients[chainId ?? 1].query({
        query: pairsQueryDetail,
        variables: {
          token0: token0.toLowerCase(),
          token1: token1.toLowerCase()
        }
      })

      const pool = data?.data.pairs[0]
      if (pool) {
        if (pool.token0.id === SONE_ADDRESS) {
          return pool.token1Price
        } else {
          return pool.token0Price
        }
      } else {
        return SONE_PRICE_MINIMUM
      }
    },
    { enabled: Boolean(chainId && token0 && token1) }
  )

  return useMemo(() => (sonePrice ? Number(sonePrice) : SONE_PRICE_MINIMUM), [sonePrice])
}
