import { getUnixTime, startOfHour, startOfMinute, startOfSecond, subHours } from 'date-fns'
import { blocksQuery } from '../../graphql/stakingQueries'
import { blockClients } from '../../graphql/clients'
import { useActiveWeb3React } from '../index'
import { useCallback, useMemo } from 'react'
import { useQuery } from 'react-query'

type BlocksResponse = {
  id: string
  number: string
  timestamp: string
}

export default function useAverageBlockTime(): number {
  const { chainId } = useActiveWeb3React()

  // Course timestamps used to make better use of the cache (startOfHour + startOfMinuite + startOfSecond)
  const now = startOfSecond(startOfMinute(startOfHour(Date.now())))
  const start = getUnixTime(subHours(now, 6))
  const end = getUnixTime(now)

  const queryFn = useCallback(async () => {
    const data = await blockClients[chainId ?? 1].query({
      query: blocksQuery,
      variables: {
        start,
        end
      }
    })
    return data.data.blocks
  }, [chainId, start, end])

  const { data: blocks, isSuccess }: { data: BlocksResponse[] | undefined; isSuccess: boolean } = useQuery(
    'useAverageBlockTime',
    queryFn,
    {
      enabled: Boolean(chainId)
    }
  )

  // If request failed then make average block time is 15 seconds by default
  return useMemo(
    () =>
      isSuccess && Array.isArray(blocks) && blocks.length
        ? blocks.reduce(
            (previousValue: any, currentValue: any, currentIndex: number) => {
              if (previousValue.timestamp) {
                const difference = previousValue.timestamp - currentValue.timestamp
                previousValue.difference = previousValue.difference + difference
              }
              previousValue.timestamp = currentValue.timestamp
              if (currentIndex === blocks.length - 1) {
                return previousValue.difference / blocks.length
              }
              return previousValue
            },
            { timestamp: null, difference: 0 }
          )
        : 15,
    [blocks, isSuccess]
  )
}
