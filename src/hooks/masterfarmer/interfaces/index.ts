interface BaseDataSushi {
  __typename: string
  id: string
}

interface Owner extends BaseDataSushi {
  sushiPerBlock: number
  totalAllocPoint: number
}

interface Token extends BaseDataSushi {
  name: string
  symbol: string
  totalSupply: string
  derivedETH: string
}

interface LiquidityPair extends BaseDataSushi {
  reserveUSD: string
  reserveETH: string
  volumeUSD: string
  untrackedVolumeUSD: string
  trackedReserveETH: string
  token0: Token
  token1: Token
  reserve0: string
  reserve1: string
  token0Price: string
  token1Price: string
  totalSupply: string
  txCount: string
  timestamp: string
}
export interface Farm extends BaseDataSushi {
  pair: string
  allocPoint: string
  lastRewardBlock: string
  accSushiPerShare: string
  balance: string
  userCount: string
  owner: Owner
  contract: string
  type: string
  symbol: string
  name: string
  pid: number
  pairAddress: string
  slpBalance: string
  sushiRewardPerDay: number
  liquidityPair: LiquidityPair
  roiPerBlock: number
  roiPerHour: number
  roiPerDay: number
  roiPerMonth: number
  roiPerYear: number
  rewardPerThousand: number
  tvl: number
}
