import gql from 'graphql-tag'

const PairFields = `
  fragment PairFields on Pair {
    id
    txCount
    token0 {
      id
      symbol
      name
      derivedETH
      decimals
    }
    token1 {
      id
      symbol
      name
      derivedETH
      decimals
    }
    reserve0
    reserve1
    reserveUSD
    totalSupply
    trackedReserveETH
    reserveETH
    volumeUSD
    untrackedVolumeUSD
    token0Price
    token1Price
  }
`

export const GET_BLOCKS = (timestamps: number[]) => {
  let queryString = 'query blocks {'
  queryString += timestamps.map(timestamp => {
    return `t${timestamp}:blocks(first: 1, orderBy: timestamp, orderDirection: desc, where: { timestamp_gt: ${timestamp}, timestamp_lt: ${timestamp +
      600} }) {
      number
    }`
  })
  queryString += '}'
  return gql(queryString)
}

export const PAIRS_CURRENT = gql`
  query pairs {
    pairs(first: 200, orderBy: reserveUSD, orderDirection: desc) {
      id
    }
  }
`

export const PAIR_DATA = (pairAddress: string, block?: number) => {
  const queryString = `
    ${PairFields}
    query pairs {
      pairs(${block ? `block: {number: ${block}}` : ``} where: { id: "${pairAddress}"} ) {
        ...PairFields
      }
    }`
  return gql(queryString)
}

export const PAIRS_BULK = gql`
  ${PairFields}
  query pairs($allPairs: [Bytes]!) {
    pairs(first: 500, where: { id_in: $allPairs }, orderBy: trackedReserveETH, orderDirection: desc) {
      ...PairFields
    }
  }
`

export const PAIRS_HISTORICAL_BULK = (block: number, pairs: string[]) => {
  let pairsString = `[`
  pairs.forEach((pair: string) => {
    pairsString += `"${pair}"`
  })
  pairsString += ']'
  const queryString = `
  query pairs {
    pairs(first: 200, where: {id_in: ${pairsString}}, block: {number: ${block}}, orderBy: trackedReserveETH, orderDirection: desc) {
      id
      reserveUSD
      trackedReserveETH
      volumeUSD
      untrackedVolumeUSD
      token0Price
      token1Price
    }
  }
  `
  return gql(queryString)
}

/**
 * Get all the pairs that this account has added liquidity.
 * @param account
 * @constructor
 */
export const GET_ALL_TOKENS_THAT_THIS_ACCOUNT_HAD_LIQUIDITY_POSITIONS = (account: string) => {
  const query = `{
    liquidityPositions(where: { user: "${account}" }) {
      pair {
        id
        token0 {
          id
          decimals
          symbol
          name
        }
        token1 {
          id
          decimals
          symbol
          name
        }
      }
    }
  }`
  return gql(query)
}

export const sonePriceQuery = (soneAddress: string) => gql`
  {
    token(id: "${soneAddress}") {
      id
      name
      derivedETH
    }
    bundle(id: "1") {
      ethPrice
    }
  }
`
