import { ChainId, ConfigMasterFarmer, JSBI, Percent, Token, WETH } from '@s-one-finance/sdk-core'
import { AbstractConnector } from '@web3-react/abstract-connector'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { injected, walletconnect } from '../connectors'

export const MAX_UINT_256 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const DEFAULT_CHAIN_ID = Number(process.env.REACT_APP_DEFAULT_CHAIN_ID)

export const ROUTER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x165D4b71FfBe26Acd83bdCedA51Cb0fc5710DFF6',
  [ChainId.RINKEBY]: '0x5E9705FF88F548cba6BBF91F8C9Ae2611f5E83BB',
  [ChainId.ROPSTEN]: '0x5065C6C5BCE00739Fb90bC5ab33e397c14f63335',
  [ChainId.GÖRLI]: '',
  [ChainId.KOVAN]: ''
}

export const ETHERSCAN_URLS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: 'https://etherscan.io',
  [ChainId.RINKEBY]: 'https://rinkeby.etherscan.io',
  [ChainId.ROPSTEN]: 'https://ropsten.etherscan.io',
  [ChainId.GÖRLI]: '',
  [ChainId.KOVAN]: ''
}

export enum REFERRAL_STATUS {
  ENABLE = 'Enable',
  DISABLE = 'Disable'
}

export { PRELOADED_PROPOSALS } from './proposals'

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

export const AMPL = new Token(ChainId.MAINNET, '0xD46bA6D942050d489DBd938a2C909A5d5039A161', 9, 'AMPL', 'Ampleforth')
export const DAI = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin')
export const USDC = new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD//C')
export const USDT = new Token(ChainId.MAINNET, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether USD')
export const WBTC = new Token(ChainId.MAINNET, '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 8, 'WBTC', 'Wrapped BTC')

// Block time here is slightly higher (~1s) than average in order to avoid ongoing proposals past the displayed time
export const AVERAGE_BLOCK_TIME_IN_SECS = 13
export const PROPOSAL_LENGTH_IN_BLOCKS = 40_320
export const PROPOSAL_LENGTH_IN_SECS = AVERAGE_BLOCK_TIME_IN_SECS * PROPOSAL_LENGTH_IN_BLOCKS

export const GOVERNANCE_ADDRESS = '0x5e4be8Bc9637f0EAA1A755019e06A68ce081D58F'

export const TIMELOCK_ADDRESS = '0x1a9C8182C09F50C8318d769245beA52c32BE35BC'

const UNI_ADDRESS = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'

export const UNI: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, UNI_ADDRESS, 18, 'UNI', 'Uniswap'),
  [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, UNI_ADDRESS, 18, 'UNI', 'Uniswap'),
  [ChainId.ROPSTEN]: new Token(ChainId.ROPSTEN, UNI_ADDRESS, 18, 'UNI', 'Uniswap'),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, UNI_ADDRESS, 18, 'UNI', 'Uniswap'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, UNI_ADDRESS, 18, 'UNI', 'Uniswap')
}

export const SONE_PRICE_MINIMUM = 0.00001 // 1 SONE >= 0.00001 USDT

// TODO: Need fill address of sone in all 5 networks.
export const SONE: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0xf5c771e0b749444eAec5C1F7EF5c0B93200BB0E4', 18, 'SONE', 'SONE Token'),
  [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, '0x5FEA1f4aEf9c78BC56cEd5083fb59d351396748f', 18, 'SONE', 'SONE Token'),
  [ChainId.ROPSTEN]: new Token(ChainId.ROPSTEN, '0x57bb30bdb0D449bf687ed648ACF2467F045c8E74', 18, 'SONE', 'SONE Token'),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, UNI_ADDRESS, 18, 'SONE', 'SONE Token'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, UNI_ADDRESS, 18, 'SONE', 'SONE Token')
}

export const SONE_MASTER_FARMER: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0xb5aEFea17eC832d2DcAF0a9c160dB96f86FC5Db9',
  [ChainId.RINKEBY]: '0x05bf874f71AAbf40966489e45DE3E5FcDC823927',
  [ChainId.ROPSTEN]: '0xfB3bEEE96FA08c2CAb70E6DbE34084A99B47b9aD',
  [ChainId.GÖRLI]: '',
  [ChainId.KOVAN]: ''
}

export const CONFIG_MASTER_FARMER: { [chainId in ChainId]: ConfigMasterFarmer | null } = {
  // TODO: chỉnh chỗ này khi lên mainnet.
  [ChainId.MAINNET]: {
    startBlock: 13723975,
    rewardMultiplier: [32, 32, 32, 32, 16, 8, 4, 2, 1],
    blocksPerWeek: 45134
  },
  [ChainId.RINKEBY]: {
    startBlock: 9342011,
    rewardMultiplier: [32, 32, 32, 32, 16, 8, 4, 2, 1],
    blocksPerWeek: 45134
  },
  [ChainId.ROPSTEN]: {
    startBlock: 10897613,
    rewardMultiplier: [32, 32, 32, 32, 16, 8, 4, 2, 1],
    blocksPerWeek: 45134
  },
  [ChainId.GÖRLI]: null,
  [ChainId.KOVAN]: null
}

export const COMMON_CONTRACT_NAMES: { [address: string]: string } = {
  [UNI_ADDRESS]: 'UNI',
  [GOVERNANCE_ADDRESS]: 'Governance',
  [TIMELOCK_ADDRESS]: 'Timelock'
}

// TODO: specify merkle distributor for mainnet
export const MERKLE_DISTRIBUTOR_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: '0x090D4613473dEE047c3f2706764f49E0821D256e'
}

const WETH_ONLY: ChainTokenList = {
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET]],
  [ChainId.ROPSTEN]: [WETH[ChainId.ROPSTEN]],
  [ChainId.RINKEBY]: [WETH[ChainId.RINKEBY]],
  [ChainId.GÖRLI]: [WETH[ChainId.GÖRLI]],
  [ChainId.KOVAN]: [WETH[ChainId.KOVAN]]
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, USDC, USDT, WBTC]
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.MAINNET]: {
    [AMPL.address]: [DAI, WETH[ChainId.MAINNET]]
  }
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, USDC, USDT, WBTC]
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, USDC, USDT, WBTC]
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.MAINNET]: [
    [
      new Token(ChainId.MAINNET, '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', 8, 'cDAI', 'Compound Dai'),
      new Token(ChainId.MAINNET, '0x39AA39c021dfbaE8faC545936693aC917d5E7563', 8, 'cUSDC', 'Compound USD Coin')
    ],
    [USDC, USDT],
    [DAI, USDT]
  ]
}

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  descriptionKey: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    descriptionKey: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },
  // SONE_WALLET: {
  //   name: 'S-One Wallet',
  //   iconName: 'logo_token_sone.svg',
  //   descriptionKey: 'Open in S-One Wallet app.',
  //   href: 'https://www.lipsum.com/',
  //   color: '#F05359',
  //   mobile: true
  // },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    descriptionKey: 'metamask_description',
    href: null,
    color: '#E8831D'
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'WalletConnect',
    iconName: 'walletConnectIcon.svg',
    descriptionKey: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true
  }
  // TRUST_WALLET: {
  //   name: 'Trust Wallet',
  //   iconName: 'trustWallet.png',
  //   descriptionKey: 'Open in Trust Wallet app.',
  //   href: 'https://www.lipsum.com/',
  //   color: '#2F73BD',
  //   mobile: true
  // }
  // S-ONE doesn't need below options.
  /*
    WALLET_LINK: {
    connector: walletlink,
    name: 'Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    descriptionKey: 'Use Coinbase Wallet app on mobile device',
    href: null,
    color: '#315CF5'
  },
  COINBASE_LINK: {
    name: 'Open in Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    descriptionKey: 'Open in Coinbase Wallet app.',
    href: 'https://go.cb-w.com/mtUDhEZPy1',
    color: '#315CF5',
    mobile: true,
    mobileOnly: true
  },
  FORTMATIC: {
    connector: fortmatic,
    name: 'Fortmatic',
    iconName: 'fortmaticIcon.png',
    descriptionKey: 'Login using Fortmatic hosted wallet',
    href: null,
    color: '#6748FF',
    mobile: true
  },
  Portis: {
    connector: portis,
    name: 'Portis',
    iconName: 'portisIcon.png',
    descriptionKey: 'Login using Portis hosted wallet',
    href: null,
    color: '#4A6C9B',
    mobile: true
  }
  */
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

// used for rewards deadlines
export const BIG_INT_SECONDS_IN_WEEK = JSBI.BigInt(60 * 60 * 24 * 7)

export const BIG_INT_ZERO = JSBI.BigInt(0)

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(10000))

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

// SDN OFAC addresses
export const BLOCKED_ADDRESSES: string[] = [
  '0x7F367cC41522cE07553e823bf3be79A889DEbe1B',
  '0xd882cFc20F52f2599D84b8e8D58C7FB62cfE344b',
  '0x901bb9583b24D97e995513C6778dc6888AB6870e',
  '0xA7e5d5A720f06526557c513402f2e6B5fA20b008',
  '0x8576aCC5C05D6Ce88f4e49bf65BdF0C62F91353C'
]
