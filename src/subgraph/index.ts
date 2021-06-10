// TODO: Chuyển mọi hooks sang sử dụng sdk của @s-one-finance.
import { useCallback, useEffect, useMemo, useState } from 'react'

import { clients } from './apollo/client'
import { PAIRS_CURRENT } from './apollo/queries'

import getBulkPairData from './utils/getBulkPairData'
import { useActiveWeb3React } from '../hooks'
import getCaseSensitiveAddress from './utils/getCaseSensitiveAddress'
import { useIsUpToExtraSmall } from '../hooks/useWindowSize'
import { Pair, Token } from '@s-one-finance/sdk-core'
import { PairState, usePairs } from 'data/Reserves'

async function getPairIds(chainId?: number) {
  if (chainId === undefined) return []

  const {
    data: { pairs }
  } = await clients[chainId].query({
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
  const { chainId, library } = useActiveWeb3React()

  const getData = useCallback(async chainId => {
    const pairIds = await getPairIds(chainId)

    // Get data for every pair in list.
    const data = await getBulkPairData(chainId, pairIds)
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
      getData(chainId)
    }, 5000)
  }, [chainId, getData])

  // Query data the first time.
  useEffect(() => {
    getData(chainId)
  }, [chainId, getData])

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

export function useTopPairsFromSubgraph(): Pair[] {
  const { chainId } = useActiveWeb3React()

  const [pairTokens, setPairTokens] = useState<[Token, Token][]>([])

  useEffect(() => {
    ;(async () => {
      if (chainId === undefined) return

      const pairIds = await getPairIds(chainId)
      const rawPairs = await getBulkPairData(chainId, pairIds)
      const sortedRawPairs = rawPairs
        .slice()
        .sort(
          (a: any, b: any) => a?.token0?.symbol && b?.token0?.symbol && a.token0.symbol.localeCompare(b.token0.symbol)
        )
      const newPairTokens = sortedRawPairs
        .map((item: any) => {
          const { token0: t0, token1: t1 } = item
          // decimals: "18"
          // derivedETH: "0"
          // id: "0xad6d458402f60fd3bd25163575031acdce07538d"
          // name: "DAI"
          // symbol: "DAI"
          // totalLiquidity: "333.949213729739959878"
          if (t0 && t1) {
            const token0 = new Token(chainId, t0.id, t0.decimals, t0?.symbol ?? undefined, t0?.name ?? undefined)
            const token1 = new Token(chainId, t1.id, t1.decimals, t1?.symbol ?? undefined, t1?.name ?? undefined)
            return [token0, token1]
          }
          return undefined
        })
        .filter((item): item is [Token, Token] => item !== undefined)
      setPairTokens(newPairTokens)
    })()
  }, [chainId])

  const topPairs = usePairs(pairTokens)

  // Only take pairs that EXISTS and NOT NULL.
  // BUG: ở đây CÓ THỂ (chưa test) bị vấn đề performance nếu topPairs lớn.
  const existedTopPairs: Pair[] = useMemo(
    () =>
      topPairs
        .filter(
          (entry: [PairState, Pair | null]): entry is [PairState, Pair] =>
            entry[0] === PairState.EXISTS && entry[1] !== null
        )
        .map(entry => entry[1]),
    [topPairs]
  )

  return existedTopPairs
}

/**
 * Lấy ra giá token1 so với token1 ở thời điểm hiện tại = (số lượng token1) / (số lượng token0),
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
