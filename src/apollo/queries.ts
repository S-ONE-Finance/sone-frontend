import gql from 'graphql-tag'

export const poolsQuery = gql`
  query poolsQuery(
    $first: Int! = 1000
    $skip: Int! = 0
    $orderBy: String! = "timestamp"
    $orderDirection: String! = "desc"
  ) {
    pools(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      owner {
        id
        sonePerBlock
        totalAllocPoint
        bonusMultiplier
      }
      pair
      allocPoint
      lastRewardBlock
      accSonePerShare
      balance
      userCount
      soneHarvested
      soneHarvestedUSD
    }
  }
`

export const poolsQueryDetail = gql`
  query poolsQueryDetail(
    $first: Int! = 1000
    $skip: Int! = 0
    $orderBy: String! = "timestamp"
    $orderDirection: String! = "desc"
    $id: String
  ) {
    pools(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection, where: { id: $id }) {
      id
      pair
      allocPoint
      lastRewardBlock
      accSonePerShare
      balance
      userCount
      soneHarvested
      owner {
        id
        sonePerBlock
        totalAllocPoint
        bonusMultiplier
      }
    }
  }
`

export const pairsQueryDetail = gql`
  query pairsQueryDetail($token0: String, $token1: String) {
    pairs(where: { token0: $token0, token1: $token1 }) {
      id
      reserve0
      token0Price
      reserve1
      token1Price
      token0 {
        id
        name
        symbol
      }
      token1 {
        id
        name
        symbol
      }
    }
  }
`

const blockFieldsQuery = gql`
  fragment blockFields on Block {
    id
    number
    timestamp
  }
`

export const blocksQuery = gql`
  query blocksQuery($first: Int! = 1000, $skip: Int! = 0, $start: Int!, $end: Int!) {
    blocks(
      first: $first
      skip: $skip
      orderBy: number
      orderDirection: desc
      where: { timestamp_gt: $start, timestamp_lt: $end, number_gt: 9300000 }
    ) {
      ...blockFields
    }
  }
  ${blockFieldsQuery}
`

export const pairTokenFieldsQuery = gql`
  fragment pairTokenFields on Token {
    id
    name
    symbol
    decimals
    totalSupply
    derivedETH
  }
`

export const pairFieldsQuery = gql`
  fragment pairFields on Pair {
    id
    reserveUSD
    reserveETH
    volumeUSD
    untrackedVolumeUSD
    trackedReserveETH
    token0 {
      ...pairTokenFields
    }
    token1 {
      ...pairTokenFields
    }
    reserve0
    reserve1
    token0Price
    token1Price
    totalSupply
    txCount
  }
  ${pairTokenFieldsQuery}
`

export const pairSubsetQuery = gql`
  query pairSubsetQuery(
    $first: Int! = 1000
    $pairAddresses: [Bytes]!
    $orderBy: String! = "trackedReserveETH"
    $orderDirection: String! = "desc"
  ) {
    pairs(first: $first, orderBy: $orderBy, orderDirection: $orderDirection, where: { id_in: $pairAddresses }) {
      ...pairFields
    }
  }
  ${pairFieldsQuery}
`

export const liquidityPositionSubsetQuery = gql`
  query liquidityPositionSubsetQuery($first: Int! = 1000, $user: Bytes!) {
    liquidityPositions(first: $first, where: { user: $user }) {
      id
      liquidityTokenBalance
      user {
        id
      }
      pair {
        id
      }
    }
  }
`

// patch masterchef queries
const poolUserFragment = gql`
  fragment PoolUser on User {
    id
    address
    pool {
      id
      pair
      balance
      accSonePerShare
      lastRewardBlock
    }
    amount
    rewardDebt
    entryUSD
    exitUSD
    soneHarvested
    soneHarvestedUSD
  }
`

export const poolUserQuery = gql`
  query poolUserQuery($address: String!, $amount_gt: Int! = 0) {
    users(where: { address: $address, amount_gt: $amount_gt }) {
      ...PoolUser
    }
  }
  ${poolUserFragment}
`

export const poolUserDetailQuery = gql`
  query poolUserQuery($id: String!, $amount_gt: Int! = 0) {
    users(where: { id: $id, amount_gt: $amount_gt }) {
      id
      address
      pool {
        id
      }
      amount
      rewardDebt
      entryUSD
      exitUSD
      soneHarvested
      soneHarvestedUSD
    }
  }
`

export const poolUserWithPoolDetailQuery = gql`
  query poolUserQuery($address: String!, $amount_gt: Int! = 0) {
    users(where: { address: $address, amount_gt: $amount_gt }) {
      id
      address
      pool {
        id
        pair
        allocPoint
        lastRewardBlock
        accSonePerShare
        balance
        userCount
        soneHarvested
        owner {
          id
          sonePerBlock
          totalAllocPoint
          bonusMultiplier
        }
      }
      amount
      rewardDebt
      entryUSD
      exitUSD
      soneHarvested
      soneHarvestedUSD
    }
  }
`
