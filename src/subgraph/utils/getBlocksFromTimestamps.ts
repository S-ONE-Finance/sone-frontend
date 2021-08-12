import { blockClients } from '../apollo/client'
import { GET_BLOCKS } from '../apollo/queries'

import splitQuery from './splitQuery'

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
