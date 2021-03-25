import { client } from '../apollo/client'
import { PAIR_DATA, PAIRS_BULK, PAIRS_HISTORICAL_BULK } from '../apollo/queries'

import parseData from './parseData'
import getBlocksFromTimestamps from './getBlocksFromTimestamps'
import getTimestampsForChanges from './getTimestampsForChanges'

/**
 * Get một đống data trong "hiện tại", "1 day ago", "2 days ago",
 * "1 week ago", "2 week ago" để parse ra data mà UI cần.
 * @param pairList
 */
export default async function getBulkPairData(pairList: string[]) {
  const [t1Day, t2Day, t1Week, t2Week] = getTimestampsForChanges()
  let [{ number: b1Day }, { number: b2Day }, { number: b1Week }, { number: b2Week }] = await getBlocksFromTimestamps([
    t1Day,
    t2Day,
    t1Week,
    t2Week
  ])

  try {
    let current = await client.query({
      query: PAIRS_BULK,
      variables: {
        allPairs: pairList
      },
      fetchPolicy: 'network-only'
    })

    let [oneDayResult, twoDayResult, oneWeekResult, twoWeekResult] = await Promise.all(
      [b1Day, b2Day, b1Week, b2Week].map(async block => {
        return client.query({
          query: PAIRS_HISTORICAL_BULK(block, pairList),
          fetchPolicy: 'network-only'
        })
      })
    )

    let oneDayData = oneDayResult?.data?.pairs.reduce((obj: any, cur: any) => {
      return { ...obj, [cur.id]: cur }
    }, {})

    let twoDayData = twoDayResult?.data?.pairs.reduce((obj: any, cur: any) => {
      return { ...obj, [cur.id]: cur }
    }, {})

    let oneWeekData = oneWeekResult?.data?.pairs.reduce((obj: any, cur: any) => {
      return { ...obj, [cur.id]: cur }
    }, {})

    let twoWeekData = twoWeekResult?.data?.pairs.reduce((obj: any, cur: any) => {
      return { ...obj, [cur.id]: cur }
    }, {})

    return await Promise.all(
      current &&
        current.data.pairs.map(async (pair: any) => {
          let data = pair
          async function getHistoryFromData(data: any, blockNumber: number) {
            let history = data?.[pair.id]
            if (!history) {
              let newData = await client.query({
                query: PAIR_DATA(pair.id, blockNumber),
                fetchPolicy: 'cache-first'
              })
              history = newData.data.pairs[0]
            }
            return history
          }
          let oneDayHistory = await getHistoryFromData(oneDayData, b1Day)
          let twoDayHistory = await getHistoryFromData(twoDayData, b2Day)
          let oneWeekHistory = await getHistoryFromData(oneWeekData, b1Week)
          let twoWeekHistory = await getHistoryFromData(twoWeekData, b2Week)
          // BUG: Có bug bị token1Price undefined ở đây nhưng chưa tái hiện lại được nên chưa fix.
          data = parseData(data, oneDayHistory, twoDayHistory, oneWeekHistory, twoWeekHistory, b1Day)
          return data
        })
    )
  } catch (e) {
    console.error('GraphQL error: Failed to get entities from store.')
    return []
  }
}
