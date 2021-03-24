import { ApolloClient } from 'apollo-client'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'

/**
 *
 * @param query Đúng ra type phải là "DocumentNode", nhưng để sử dụng type đấy phải import graphql lib, mất công
 * @param localClient
 * @param vars
 * @param list
 * @param skipCount
 */
export default async function splitQuery(
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
    let sliced = list.slice(skip, end)
    let result = await localClient.query({
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
