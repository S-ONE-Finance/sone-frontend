// TODO: Chuyển mọi hooks sang sử dụng sdk của @s-one-finance.
import { useCallback, useEffect, useMemo, useState } from 'react'

import { client } from './apollo/client'
import { PAIRS_CURRENT } from './apollo/queries'

import getBulkPairData from './utils/getBulkPairData'
import { useActiveWeb3React } from '../hooks'
import getCaseSensitiveAddress from './utils/getCaseSensitiveAddress'
import { useIsUpToExtraSmall } from '../hooks/useWindowSize'
import { Pair, Token } from '@s-one-finance/sdk-core'
import { usePair, usePairs } from 'data/Reserves'
import { useToken } from 'hooks/Tokens'

async function getPairIds() {
  const {
    data: { pairs }
  } = await client.query({
    query: PAIRS_CURRENT,
    fetchPolicy: 'cache-first'
  })

  return pairs.map((pair: { id: string }) => pair.id)
}

/**
 * Use Subgraph to query data for pairs.
 */
export function useSubgraphData() {
  const [subgraphData, setSubgraphData] = useState<any>({})
  const { library } = useActiveWeb3React()

  const getData = useCallback(async () => {
    const pairIds = await getPairIds()

    // Get data for every pair in list.
    const data = await getBulkPairData(pairIds)
    if (data?.length > 0) {
      setSubgraphData(data)
      console.log('Array trả về có ' + data.length + ' items.')
    } else {
      console.error('Array trả về lỗi', data)
    }
  }, [])

  // Wait 5s for TheGraph mapping data.
  const getDataAfter5Seconds = useCallback(() => {
    setTimeout(() => {
      getData()
    }, 5000)
  }, [getData])

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

  return subgraphData
}

// TODO: Implement this.
export function useTopPairsFromSubgraph(): { [address: string]: Pair } {
  const [rawPairs, setRawPairs] = useState<any>({})
  const [tokenPairs, setTokenPairs] = useState<[Token, Token][]>([])

  // FIXME: chưa xử lý trường hợp vào page lần đầu và fetch pair info bị lỗi. Như vậy pairs sẽ empty mãi.
  useEffect(() => {
    async function getData() {
      const pairIds = await getPairIds()
      // Get data for every pair in list.
      const data = await getBulkPairData(pairIds)

      if (data?.length > 0) {
        setRawPairs(data)
        
        console.log('useTopPairsFromSubgraph, Array trả về có ' + data.length + ' items.')
      } else {
        console.error('useTopPairsFromSubgraph, Array trả về lỗi', data)
      }
    }

    getData()
  }, [])

  return {}
}

/**
 * Lấy ra giá token0 so với token1 ở thời điểm hiện tại = (số lượng token1) / (số lượng token0),
 * và so sánh giá trị này với chính nó ở thời điểm 24h trước.
 * Ta có 2 kết quả: "token1Price và token1PriceChange"
 *
 * PS: Chỗ này tại sao ko phải là "token0Price và token0PriceChange"?? do data trong subgraph là như thế, maybe
 * bug do token1 bị swap với token0, source: uniswap-info).
 */
export function useOneDayPairPriceChangeData() {
  const data = useSubgraphData()

  return useMemo(
    () =>
      data &&
      Object.values(data).map((item: any) => {
        return {
          id: item.id,
          token0Symbol: item.token0.symbol,
          token1Symbol: item.token1.symbol,
          token1Price: item.token1Price,
          oneDayToken1PriceChange: item.oneDayToken1PriceChange
        }
      }),
    [data]
  )
}

export function useWeeklyRankingData() {
  const data = useSubgraphData()

  // Màn hình dưới extra small chỉ show 4 items.
  const isUpToExtraSmall = useIsUpToExtraSmall()

  const weeklyRanking = useMemo(
    () =>
      data &&
      Object.values(data)
        .filter((item: any) => !!item?.oneWeekVolumeUSD)
        .sort((a: any, b: any) => b.oneWeekVolumeUSD - a.oneWeekVolumeUSD)
        .slice(0, isUpToExtraSmall ? 4 : 5)
        .map((item: any) => ({
          ...item,
          token0: {
            ...item.token0,
            id: getCaseSensitiveAddress(item.token0.id)
          },
          token1: {
            ...item.token1,
            id: getCaseSensitiveAddress(item.token1.id)
          }
        })),
    [data, isUpToExtraSmall]
  )

  return weeklyRanking
}
