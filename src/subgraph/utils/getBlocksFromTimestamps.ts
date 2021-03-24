import { blockClient } from '../apollo/client'
import { GET_BLOCK, GET_BLOCKS } from '../apollo/queries'

import splitQuery from './splitQuery'

/**
 * @notice Fetches first block after a given timestamp
 * @dev Query speed is optimized by limiting to a 600-second period
 * @param timestamp in seconds
 */
export async function getBlockFromTimestamp(timestamp: number) {
  let result = await blockClient.query({
    query: GET_BLOCK,
    variables: {
      timestampFrom: timestamp,
      timestampTo: timestamp + 600
    },
    fetchPolicy: 'cache-first'
  })
  return result?.data?.blocks?.[0]?.number
}

/**
 * @notice Fetches block objects for an array of timestamps.
 * @dev blocks are returned in chronological order (ASC) regardless of input.
 * @dev blocks are returned at string representations of Int
 * @dev timestamps are returns as they were provided; not the block time.
 * @param timestamps
 * @param skipCount
 */
export default async function getBlocksFromTimestamps(timestamps: number[], skipCount = 500) {
  if (timestamps?.length === 0) {
    return []
  }

  let fetchedData: any = await splitQuery(GET_BLOCKS, blockClient, [], timestamps, skipCount)

  let blocks = []
  if (fetchedData) {
    for (let t in fetchedData) {
      if (fetchedData.hasOwnProperty(t) && fetchedData[t].length > 0) {
        blocks.push({
          timestamp: t.split('t')[1],
          number: fetchedData[t][0]['number']
        })
      }
    }
  }
  return blocks
}
