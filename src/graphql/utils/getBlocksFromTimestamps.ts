import { ApolloClient } from 'apollo-client'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'

import { blockClients } from '../clients'
import { GET_BLOCKS } from '../swapQueries'

/**
 *
 * @param query Đúng ra type phải là "DocumentNode", nhưng để sử dụng type đấy phải import graphql lib, mất công
 * @param localClient
 * @param vars
 * @param list
 * @param skipCount
 */
async function splitQuery(
  query: any,
  localClient: ApolloClient<NormalizedCacheObject>,
  vars: string[],
  list: number[],
  skipCount = 100
) {
  let fetchedData = {}
  let allFound = false
  let skip = 0

  while (!allFound) {
    let end = list.length
    if (skip + skipCount < list.length) {
      end = skip + skipCount
    }
    const sliced = list.slice(skip, end)
    const result = await localClient.query({
      query: query(...vars, sliced),
      fetchPolicy: 'cache-first'
    })
    fetchedData = {
      ...fetchedData,
      ...result.data
    }
    if (Object.keys(result.data).length < skipCount || skip + skipCount > list.length) {
      allFound = true
    } else {
      skip += skipCount
    }
  }

  return fetchedData
}

/**
 * @notice Fetches block objects for an array of timestamps.
 * @dev blocks are returned in chronological order (ASC) regardless of input.
 * @dev blocks are returned at string representations of Int
 * @dev timestamps are returns as they were provided; not the block time.
 * @param timestamps
 * @param skipCount
 */
export default async function getBlocksFromTimestamps(
  chainId: number | undefined,
  timestamps: number[],
  skipCount = 500
) {
  if (timestamps?.length === 0 || chainId === undefined) {
    return []
  }

  const fetchedData: any = await splitQuery(GET_BLOCKS, blockClients[chainId], [], timestamps, skipCount)

  const blocks = []
  if (fetchedData) {
    for (const t in fetchedData) {
      if (fetchedData[t].length > 0) {
        blocks.push({
          timestamp: t.split('t')[1],
          number: fetchedData[t][0]['number']
        })
      } else {
        blocks.push({
          timestamp: t.split('t')[1],
          number: undefined
        })
      }
    }
  }

  return blocks
}
