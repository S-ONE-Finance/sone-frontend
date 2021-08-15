import { swapClients } from '../clients'
import { PAIRS_BULK } from '../queries'

/**
 * Get data sử dụng cho select pair
 * @param pairIds
 */
export default async function getPairData(chainId: number | undefined, pairIds: string[]) {
  if (chainId === undefined) return []

  try {
    // Lấy data current.
    const result = await swapClients[chainId].query({
      query: PAIRS_BULK,
      variables: {
        allPairs: pairIds
      },
      fetchPolicy: 'network-only'
    })

    const pairs = result?.data?.pairs

    return Array.isArray(pairs) ? pairs.filter(pair => pair !== null) : []
  } catch (e) {
    console.error(e)
    return []
  }
}
