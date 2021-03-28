// TODO: Chuyển mọi hooks sang sử dụng sdk của @s-one-finance.

import { useState, useEffect, useCallback } from 'react'

import { client } from './apollo/client'
import { PAIRS_CURRENT } from './apollo/queries'

import getBulkPairData from './utils/getBulkPairData'
import { useActiveWeb3React } from '../hooks'

/**
 * Use Subgraph to query data for pairs.
 */
function useSubgraphData() {
  const [subgraphData, setSubgraphData] = useState<any>({})
  const { library } = useActiveWeb3React()

  // region Callback functions.
  const getData = useCallback(async () => {
    let {
      data: { pairs }
    } = await client.query({
      query: PAIRS_CURRENT,
      fetchPolicy: 'cache-first'
    })

    // Format as array of addresses.
    const pairIds = pairs.map((pair: { id: string }) => pair.id)

    // Get data for every pair in list.
    const topPairs = await getBulkPairData(pairIds)
    topPairs && setSubgraphData(topPairs)

    // Log out to track query results.
    if (topPairs?.length > 0) {
      console.log('Array trả về có ' + topPairs.length + ' items.')
    } else {
      console.error('topPairs', topPairs)
    }
  }, [])

  // Wait 5s for TheGraph mapping data.
  const getDataAfter5Seconds = useCallback(() => {
    setTimeout(() => {
      getData()
    }, 5000)
  }, [getData])
  // endregion

  // region Effects.
  // Query data the first time.
  useEffect(() => {
    getData()
  }, [getData])

  // When new block created, run the getDataAfter5Seconds callback function.
  useEffect(() => {
    if (!library) return

    library.on('block', getDataAfter5Seconds)
    return () => {
      library.removeListener('block', getDataAfter5Seconds)
    }
  }, [library, getDataAfter5Seconds])
  // endregion

  return subgraphData
}

/**
 * Lấy ra giá token0 so với token1 ở thời điểm hiện tại = (số lượng token1) / (số lượng token0),
 * và so sánh giá trị này với chính nó ở thời điểm 24h trước.
 * Ta có 2 kết quả: "token1Price và token1PriceChange"
 *
 * PS: Chỗ này tại sao ko phải là "token0Price và token0PriceChange"?? do data trong subgraph là như thế, maybe
 * bug do token1 bị swap với token0, source: uniswap-info).
 */
export function useOneDayPairPriceChange() {
  const data = useSubgraphData()

  return (
    data &&
    Object.values(data).map((item: any) => {
      return {
        id: item.id,
        token0Symbol: item.token0.symbol,
        token1Symbol: item.token1.symbol,
        token1Price: item.token1Price,
        oneDayToken1PriceChange: item.oneDayToken1PriceChange
      }
    })
  )
}

export function useWeeklyRanking() {
  const data = useSubgraphData()

  // TODO: Có thể tối ưu câu query graphql để speed nhanh hơn.
  return (
    data &&
    Object.values(data)
      .filter((item: any) => !isNaN(item.oneWeekVolumeChangeUSD))
      // BUG: Chỗ này chưa chuẩn đâu nhưng khi nào làm đến weekly thì sửa.
      .slice(0, 4)
      .map((item: any) => ({
        id: item.id,
        oneWeekVolumeChangeUSD: item.oneWeekVolumeChangeUSD
      }))
  )
}
