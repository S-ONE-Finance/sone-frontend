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
  const [{ number: b1Day }, { number: b2Day }, { number: b1Week }, { number: b2Week }] =
    (await getBlocksFromTimestamps([t1Day, t2Day, t1Week, t2Week])) || {}

  if (b1Day === undefined || b2Day === undefined || b1Week === undefined || b2Week === undefined) return []

  try {
    // Lấy data current.
    const current = await client.query({
      query: PAIRS_BULK,
      variables: {
        allPairs: pairList
      },
      fetchPolicy: 'network-only'
    })

    // console.log(`current`, current?.data?.pairs)

    // Lấy data quá khứ.
    const [oneDayResult, twoDayResult, oneWeekResult, twoWeekResult] = await Promise.all(
      [b1Day, b2Day, b1Week, b2Week].map(async block => {
        return client.query({
          query: PAIRS_HISTORICAL_BULK(block, pairList),
          fetchPolicy: 'network-only'
        })
      })
    )

    // console.log(`oneDayResult`, oneDayResult?.data?.pairs)

    // Làm đẹp data quá khứ.
    const oneDayData = oneDayResult?.data?.pairs.reduce((obj: any, cur: any) => {
      return { ...obj, [cur.id]: cur }
    }, {})

    const twoDayData = twoDayResult?.data?.pairs.reduce((obj: any, cur: any) => {
      return { ...obj, [cur.id]: cur }
    }, {})

    const oneWeekData = oneWeekResult?.data?.pairs.reduce((obj: any, cur: any) => {
      return { ...obj, [cur.id]: cur }
    }, {})

    const twoWeekData = twoWeekResult?.data?.pairs.reduce((obj: any, cur: any) => {
      return { ...obj, [cur.id]: cur }
    }, {})

    // So sánh data hiện tại và quá khứ và trả về giá trị mong muốn:
    // Với mỗi pair ở hiện tại, tìm data của nó trong quá khứ rồi map sự thay đổi.
    const pairs = await Promise.all(
      current &&
        current.data.pairs.map(async (pair: any) => {
          let data = pair
          async function getHistoryFromData(data: any, blockNumber: number) {
            let history = data?.[pair.id]
            if (!history) {
              const newData = await client.query({
                query: PAIR_DATA(pair.id, blockNumber),
                fetchPolicy: 'cache-first'
              })
              history = newData.data.pairs[0]
            }
            return history
          }
          const oneDayHistory = await getHistoryFromData(oneDayData, b1Day)
          const twoDayHistory = await getHistoryFromData(twoDayData, b2Day)
          const oneWeekHistory = await getHistoryFromData(oneWeekData, b1Week)
          const twoWeekHistory = await getHistoryFromData(twoWeekData, b2Week)

          // console.log(`oneDayHistory`,oneDayHistory)
          // console.log(`twoDayHistory`,twoDayHistory)
          // console.log(`oneWeekHistory`,oneWeekHistory)
          // console.log(`twoWeekHistory`,twoWeekHistory)

          // Nếu không có data quá khứ thì trả về null.
          if (oneDayHistory && twoDayHistory && oneWeekHistory && twoWeekHistory) {
            data = parseData(data, oneDayHistory, twoDayHistory, oneWeekHistory, twoWeekHistory)
            return data
          } else {
            return null
          }
        })
    )

    // Lọc những pair nào bị null.
    return pairs.filter(pair => pair !== null)
  } catch (e) {
    console.error(e)
    return []
  }
}
