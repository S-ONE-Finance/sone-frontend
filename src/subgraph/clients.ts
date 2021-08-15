import { ApolloClient } from 'apollo-client'
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { ChainId } from '@s-one-finance/sdk-core'

export const swapClients: { [chainId: number]: ApolloClient<NormalizedCacheObject> } = {
  [ChainId.MAINNET]: new ApolloClient({
    link: new HttpLink({
      uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2'
    }),
    cache: new InMemoryCache()
  }),
  [ChainId.ROPSTEN]: new ApolloClient({
    link: new HttpLink({
      uri: 'https://api.thegraph.com/subgraphs/name/danielpham765/soneswap'
    }),
    cache: new InMemoryCache()
  })
}

export const stakingClients: { [chainId: number]: ApolloClient<NormalizedCacheObject> } = {
  [ChainId.MAINNET]: new ApolloClient({
    link: new HttpLink({
      uri: 'https://api.thegraph.com/subgraphs/name/thanhnv25/farmer101'
    }),
    cache: new InMemoryCache()
  }),
  [ChainId.ROPSTEN]: new ApolloClient({
    link: new HttpLink({
      uri: 'https://api.thegraph.com/subgraphs/name/thanhnv25/farmer101'
    }),
    cache: new InMemoryCache()
  })
}

export const blockClients: { [chainId: number]: ApolloClient<NormalizedCacheObject> } = {
  [ChainId.MAINNET]: new ApolloClient({
    link: new HttpLink({
      uri: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks'
    }),
    cache: new InMemoryCache()
  }),
  [ChainId.ROPSTEN]: new ApolloClient({
    link: new HttpLink({
      uri: 'https://api.thegraph.com/subgraphs/name/blocklytics/ropsten-blocks'
    }),
    cache: new InMemoryCache()
  })
}
