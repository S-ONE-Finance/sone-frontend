import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'

export const blocklytics = new ApolloClient({
  link: createHttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks'
  }),
  cache: new InMemoryCache()
})

export const masterchef = new ApolloClient({
  link: createHttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/thanhnv25/farmer101'
  }),
  cache: new InMemoryCache()
})

export const exchange = new ApolloClient({
  link: createHttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/danielpham765/soneswap'
  }),
  cache: new InMemoryCache()
})

export const blockClient = new ApolloClient({
  link: createHttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks'
  }),
  cache: new InMemoryCache()
})
