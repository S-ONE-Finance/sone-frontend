// TODO: Chuyển mọi hooks sang sử dụng sdk của @s-one-finance.
import { useCallback, useEffect, useMemo, useState } from 'react'

import { swapClients } from './clients'
import { GET_ALL_TOKENS_THAT_THIS_ACCOUNT_HAD_LIQUIDITY_POSITIONS, PAIRS_CURRENT } from './swapQueries'

import getBulkPairData from './utils/getBulkPairData'
import getPairData from './utils/getPairData'
import { useActiveWeb3React } from '../hooks'
import getCaseSensitiveAddress from './utils/getCaseSensitiveAddress'
import { useIsUpToExtraSmall } from '../hooks/useWindowSize'
import { Pair, Token } from '@s-one-finance/sdk-core'
import { PairState, usePairs } from 'data/Reserves'
import useUnmountedRef from '../hooks/useUnmountedRef'
import { useQuery } from 'react-query'
import { useBlockNumber } from '../state/application/hooks'
import { useLastTruthy } from '../hooks/useLast'

async function getPairIds(chainId?: number) {
  if (chainId === undefined) return []

  const {
    data: { pairs }
  } = await swapClients[chainId].query({
    query: PAIRS_CURRENT,
    fetchPolicy: 'cache-first'
  })

  return pairs.map((pair: { id: string }) => pair.id)
}

/**
 * Use Subgraph to query bulk data for pairs.
 * FIXME: Nếu có từ 2 hooks hoặc components gọi hàm này thì sẽ fetch data 2 lần, điều này là không cần thiết.
 */
export function useBulkPairData() {
  const [subgraphData, setSubgraphData] = useState<any[]>([])
  const { chainId } = useActiveWeb3React()
  const unmountedRef = useUnmountedRef()

  const getData = useCallback(
    async chainId => {
      const pairIds = await getPairIds(chainId)

      // Get data for every pair in list.
      const data = await getBulkPairData(chainId, pairIds)
      if (!unmountedRef.current) {
        if (Array.isArray(data) && data.length > 0) {
          setSubgraphData(data)
        }
      }
    },
    [unmountedRef]
  )

  useEffect(() => {
    getData(chainId).then()
  }, [getData, chainId])

  // Fetched data mà empty (do lỗi, hoặc vv.) thì 15s sau fetch lại.
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    if (subgraphData.length === 0) {
      setTimeout(() => {
        getData(chainId)
      }, 15000)
    }
    return () => {
      clearTimeout(timeout)
    }
  }, [subgraphData, chainId, getData])

  return subgraphData
}

export function useGetPairFromSubgraphAndParse(): [boolean, Pair[]] {
  const { chainId } = useActiveWeb3React()

  const [pairTokens, setPairTokens] = useState<[Token, Token][]>([])

  useEffect(() => {
    ;(async () => {
      if (chainId === undefined) return

      const pairIds = await getPairIds(chainId)
      const rawPairs = await getPairData(chainId, pairIds)
      const sortedRawPairs = rawPairs
        .slice()
        .sort(
          (a: any, b: any) => a?.token0?.symbol && b?.token0?.symbol && a.token0.symbol.localeCompare(b.token0.symbol)
        )
      const newPairTokens = sortedRawPairs
        .map((item: any) => {
          const { token0: t0, token1: t1 } = item
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

  const isLoading: boolean = useMemo(
    () =>
      topPairs.some((entry: [PairState, Pair | null]): entry is [PairState, Pair] => entry[0] === PairState.LOADING),
    [topPairs]
  )

  // Only take pairs that EXISTS and NOT NULL.
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

  return [isLoading, existedTopPairs]
}

/**
 * Lấy ra giá token1 so với token1 ở thời điểm hiện tại = (số lượng token1) / (số lượng token0),
 * và so sánh giá trị này với chính nó ở thời điểm 24h trước.
 * Ta có 2 kết quả: "token1Price và token1PriceChange"
 *
 * PS: Chỗ này tại sao ko phải là "token0Price và token0PriceChange"?? do data trong graphql là như thế, maybe
 * bug do token1 bị swap với token0, source: uniswap-info).
 */
export function useOneDayPairPriceChangeData() {
  const data = useBulkPairData()

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
  const data = useBulkPairData()

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

/**
 * Không cần dedupe vì hàm useTrackedTokenPairs sử dụng đã dedupe rồi.
 */
export function useAllPairsThatThisAccountHadLiquidityPosition(): {
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  pairs?: [Token, Token][]
} {
  const { account, chainId } = useActiveWeb3React()
  const block = useBlockNumber()

  const { data: pairsQueryResult, isSuccess, isError, isLoading } = useQuery<[Token, Token][]>(
    ['useAllPairsThatThisAccountHadLiquidityPosition', chainId, account, block],
    async () => {
      if (!chainId) return []

      const data = await swapClients[chainId].query({
        query: GET_ALL_TOKENS_THAT_THIS_ACCOUNT_HAD_LIQUIDITY_POSITIONS(account?.toLowerCase() as string),
        fetchPolicy: 'network-only'
      })

      return Array.isArray(data?.data?.liquidityPositions)
        ? data?.data?.liquidityPositions.map((item: any) => {
            const t0 = item.pair.token0
            const t1 = item.pair.token1
            return [
              new Token(chainId, t0.id, t0.decimals, t0.symbol, t0.name),
              new Token(chainId, t1.id, t1.decimals, t1.symbol, t1.name)
            ] as [Token, Token]
          })
        : []
    },
    {
      enabled: Boolean(chainId && account)
    }
  )

  const pairs = useLastTruthy(pairsQueryResult) ?? undefined

  return useMemo(
    () => ({
      isLoading,
      isSuccess,
      isError,
      pairs
    }),
    [isError, isLoading, isSuccess, pairs]
  )
}
