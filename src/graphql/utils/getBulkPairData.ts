import { swapClients } from '../clients'
import { PAIR_DATA, PAIRS_BULK, PAIRS_HISTORICAL_BULK } from '../swapQueries'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import parseBulkPairData from './parseBulkPairData'
import getBlocksFromTimestamps from './getBlocksFromTimestamps'

dayjs.extend(utc)

function getTimestampsForChanges() {
  const utcCurrentTime = dayjs()
  const t1Day = utcCurrentTime
    .subtract(1, 'day')
    .startOf('minute')
    .unix()
  const t2Day = utcCurrentTime
    .subtract(2, 'day')
    .startOf('minute')
    .unix()
  const tWeek = utcCurrentTime
    .subtract(1, 'week')
    .startOf('minute')
    .unix()
  const t2Week = utcCurrentTime
    .subtract(2, 'week')
    .startOf('minute')
    .unix()
  return [t1Day, t2Day, tWeek, t2Week]
}

/**
 * Get một đống data trong "hiện tại", "1 day ago", "2 days ago",
 * "1 week ago", "2 week ago" để parse ra data mà UI cần.
 * @param chainId
 * @param pairIds
 */
export default async function getBulkPairData(chainId: number | undefined, pairIds: string[]) {
  try {
    if (chainId === undefined) return []

    const [t1Day, t2Day, t1Week, t2Week] = getTimestampsForChanges()
    let [{ number: b1Day }, { number: b2Day }, { number: b1Week }, { number: b2Week }] =
      (await getBlocksFromTimestamps(chainId, [t1Day, t2Day, t1Week, t2Week])) || {}

    // Khắc phục khi subgraph ko sync được block mới.
    const oldestFoundBlock = b2Week || b1Week || b2Day || b1Day
    if (oldestFoundBlock === undefined) return []
    if (b2Week === undefined) {
      b2Week = b1Week = b2Day = b1Day = oldestFoundBlock
    } else if (b1Week === undefined) {
      b1Week = b2Day = b1Day = oldestFoundBlock
    } else if (b2Day === undefined) {
      b2Day = b1Day = oldestFoundBlock
    } else if (b1Day === undefined) {
      b1Day = oldestFoundBlock
    }

    // Lấy data current.
    const current = await swapClients[chainId].query({
      query: PAIRS_BULK,
      variables: {
        allPairs: pairIds
      },
      fetchPolicy: 'network-only'
    })

    // Lấy data quá khứ.
    const [oneDayResult, twoDayResult, oneWeekResult, twoWeekResult] = await Promise.all(
      [b1Day, b2Day, b1Week, b2Week].map(async block => {
        return swapClients[chainId].query({
          query: PAIRS_HISTORICAL_BULK(block, pairIds),
          fetchPolicy: 'network-only'
        })
      })
    )

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
            if (chainId !== undefined && !history) {
              const newData = await swapClients[chainId].query({
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

          // Nếu không có data quá khứ thì trả về null.
          data = parseBulkPairData(data, oneDayHistory, twoDayHistory, oneWeekHistory, twoWeekHistory)
          return data
        })
    )

    return pairs
  } catch (e) {
    console.error(e)
    return []
  }
}
