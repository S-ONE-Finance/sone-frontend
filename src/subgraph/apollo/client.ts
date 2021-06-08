import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

export const client = new ApolloClient({
  link: new HttpLink({
    // uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2'
    uri: 'https://api.thegraph.com/subgraphs/name/tungpham2020/bhswap'
  }),
  cache: new InMemoryCache()
})

export const blockClient = new ApolloClient({
  link: new HttpLink({
    // uri: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks'
    uri: 'https://api.thegraph.com/subgraphs/name/blocklytics/ropsten-blocks'
  }),
  cache: new InMemoryCache()
})
