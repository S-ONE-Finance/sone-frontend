import { get2PeriodPercentChange, getPercentChange } from './getChange'

interface BasicData {
  token0?: {
    id: string
    name: string
    symbol: string
  }
  token1?: {
    id: string
    name: string
    symbol: string
  }
}

// Override data return from graph - usually because proxy token has changed
// names since entity was created in subgraph
// keys are lowercase token addresses <--------
const TOKEN_OVERRIDES: {
  [address: string]: { name: string; symbol: string }
} = {
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': {
    name: 'Ether (Wrapped)',
    symbol: 'ETH'
  },
  '0x1416946162b1c2c871a73b07e932d2fb6c932069': {
    name: 'Energi',
    symbol: 'NRGE'
  }
}

// override tokens with incorrect symbol or names
function updateNameData(data: BasicData): BasicData | undefined {
  if (data?.token0?.id && Object.keys(TOKEN_OVERRIDES).includes(data.token0.id)) {
    data.token0.name = TOKEN_OVERRIDES[data.token0.id].name
    data.token0.symbol = TOKEN_OVERRIDES[data.token0.id].symbol
  }

  if (data?.token1?.id && Object.keys(TOKEN_OVERRIDES).includes(data.token1.id)) {
    data.token1.name = TOKEN_OVERRIDES[data.token1.id].name
    data.token1.symbol = TOKEN_OVERRIDES[data.token1.id].symbol
  }

  return data
}

export default function parseData(
  data: any,
  oneDayData: any,
  twoDayData: any,
  oneWeekData: any,
  twoWeekData: any,
  oneDayBlock: []
) {
  // get volume changes 24h
  const [oneDayVolumeUSD, oneDayVolumeChangeUSD] = get2PeriodPercentChange(
    data?.volumeUSD,
    oneDayData?.volumeUSD ? oneDayData.volumeUSD : 0,
    twoDayData?.volumeUSD ? twoDayData.volumeUSD : 0
  )

  // get volume changes 1 week
  const [oneWeekVolumeUSD, oneWeekVolumeChangeUSD] = get2PeriodPercentChange(
    data?.volumeUSD,
    oneWeekData?.volumeUSD ? oneWeekData.volumeUSD : 0,
    twoWeekData?.volumeUSD ? twoWeekData.volumeUSD : 0
  )

  // get token1Price changes in 24h
  // BUG: Chả hiểu sao token0Price ở đây lại thành token1Price (nguồn: uniswap-info)
  const oneDayToken1PriceChange = getPercentChange(data.token1Price, oneDayData.token1Price)

  // set token1Price properties
  data.oneDayToken1PriceChange = oneDayToken1PriceChange

  // set volume properties
  data.oneDayVolumeUSD = oneDayVolumeUSD
  data.oneDayVolumeChangeUSD = oneDayVolumeChangeUSD

  data.oneWeekVolumeUSD = oneWeekVolumeUSD
  data.oneWeekVolumeChangeUSD = oneWeekVolumeChangeUSD

  // format if pair hasn't existed for a day or a week
  if (!oneDayData && data && data.createdAtBlockNumber > oneDayBlock) {
    data.oneDayVolumeUSD = parseFloat(data.volumeUSD)
  }
  if (!oneDayData && data) {
    data.oneDayVolumeUSD = parseFloat(data.volumeUSD)
  }
  if (!oneWeekData && data) {
    data.oneWeekVolumeUSD = parseFloat(data.volumeUSD)
  }

  // format incorrect names
  updateNameData(data)

  return data
}
