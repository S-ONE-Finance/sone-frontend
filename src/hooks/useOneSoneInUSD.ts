import { useActiveWeb3React } from './index'
import { useQuery } from 'react-query'
import { swapClients } from '../graphql/clients'
import { SONE, SONE_PRICE_MINIMUM } from '../constants'
import { useMemo } from 'react'
import { sonePriceQuery } from '../graphql/swapQueries'
import { getNumberCommas } from '../utils/formatNumber'

/**
 * 1 SONE === `useSoneInUSD()` USDT.
 */
export default function useOneSoneInUSD(): number {
  const { chainId } = useActiveWeb3React()

  const { data: sonePrice } = useQuery<number>(
    ['useOneSoneInUSD', chainId],
    async () => {
      if (!chainId) return 0

      const data = await swapClients[chainId].query({
        query: sonePriceQuery(SONE[chainId].address.toLowerCase())
      })

      const ethPrice = +data?.data?.bundle?.ethPrice || 0
      const derivedETH = +data?.data?.token?.derivedETH || 0

      if (isNaN(ethPrice) || isNaN(derivedETH)) {
        throw new Error('Error when fetch data in useOneSoneInUSD')
      }

      return ethPrice * derivedETH
    },
    { enabled: Boolean(chainId) }
  )

  return useMemo(() => sonePrice || SONE_PRICE_MINIMUM, [sonePrice])
}

export function useSoneInUSD(numberOfSone?: number): number | undefined {
  const oneSoneInUSD = useOneSoneInUSD()

  return useMemo(() => (numberOfSone === undefined || isNaN(numberOfSone) ? undefined : numberOfSone * oneSoneInUSD), [
    numberOfSone,
    oneSoneInUSD
  ])
}

export function useFormattedSoneInUSD(numberOfSone?: number): string {
  const soneInUSD = useSoneInUSD(numberOfSone)

  return useMemo(() => (soneInUSD === undefined ? '--' : getNumberCommas(soneInUSD.toFixed(6))), [soneInUSD])
}
