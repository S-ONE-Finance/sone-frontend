import { ChainId } from '@s-one-finance/sdk-core'

export default {
  rpc: 'https://wallet.tomochain.com/api/luaswap/rpc',
  rpcTomochain: 'https://rpc.tomochain.com',
  chainId: 1,
  apiETH: 'https://wallet.tomochain.com/api/luaswap',
  apiTOMO: 'https://wallet.tomochain.com/api/luaswap/tomochain'
}

export const START_REWARD_AT_BLOCK: { [chainId in ChainId]: number } = {
  1: 10950600,
  3: 10950600,
  4: 10950600,
  5: 10950600,
  42: 10950600
}

export const NUMBER_BLOCKS_PER_YEAR: { [chainId in ChainId]: number } = {
  1: 2425000,
  3: 2425000,
  4: 2425000,
  5: 2425000,
  42: 2425000
}

export const RPC_URL: { [chainId in ChainId]: string } = {
  1: 'https://wallet.tomochain.com/api/luaswap/rpc',
  3: '',
  4: '',
  5: '',
  42: ''
}

export const API_URL: { [chainId in ChainId]: string } = {
  1: 'https://wallet.tomochain.com/api/luaswap',
  3: 'http://localhost:8888/api/soneswap',
  4: '',
  5: '',
  42: ''
}

export const LUA_CONTRACT: { [chainId in ChainId]: string } = {
  1: '0xf5c771e0b749444eaec5c1f7ef5c0b93200bb0e4',
  3: '',
  4: '',
  5: '',
  42: ''
}
