export enum TransactionType {
  WRAP = 'WRAP',
  UNWRAP = 'UNWRAP',
  APPROVE = 'APPROVE',
  SWAP = 'SWAP',
  ADD_ONE_TOKEN = 'ADD_ONE_TOKEN',
  ADD_TWO_TOKENS = 'ADD_TWO_TOKENS',
  WITHDRAW = 'WITHDRAW',
  STAKE = 'STAKE',
  UNSTAKE = 'UNSTAKE',
  CLAIM_REWARD = 'CLAIM_REWARD',
  UNLOCK_SONE = 'UNLOCK_SONE'
}

export interface SummaryWrap {
  type: TransactionType.WRAP
  wrapAmount: string | undefined
}

export interface SummaryUnwrap {
  type: TransactionType.UNWRAP
  unwrapAmount: string | undefined
}

export interface SummaryApprove {
  type: TransactionType.APPROVE
  symbol: string | undefined
}

export interface SummarySwap {
  type: TransactionType.SWAP
  inputAmount: string | undefined
  inputSymbol: string | undefined
  outputAmount: string | undefined
  outputSymbol: string | undefined
}

export interface SummaryAddOneToken {
  type: TransactionType.ADD_ONE_TOKEN
  userInputAmount: string | undefined
  userInputSymbol: string | undefined
}

export interface SummaryAddTwoTokens {
  type: TransactionType.ADD_TWO_TOKENS
  currencyAAmount: string | undefined
  currencyASymbol: string | undefined
  currencyBAmount: string | undefined
  currencyBSymbol: string | undefined
}

export interface SummaryWithdraw {
  type: TransactionType.WITHDRAW
  currencyAAmount: string | undefined
  currencyASymbol: string | undefined
  currencyBAmount: string | undefined
  currencyBSymbol: string | undefined
}

export interface SummaryStake {
  type: TransactionType.STAKE
  amount: string | undefined
  symbol: string | undefined
}

export interface SummaryUnStake {
  type: TransactionType.UNSTAKE
  amount: string | undefined
  symbol: string | undefined
}

export interface SummaryClaimReward {
  type: TransactionType.CLAIM_REWARD
  amount: string | undefined
}

export interface SummaryUnlockSone {
  type: TransactionType.UNLOCK_SONE
  amount: string | undefined
}

export type TransactionSummary =
  | SummaryWrap
  | SummaryUnwrap
  | SummaryApprove
  | SummarySwap
  | SummaryAddOneToken
  | SummaryAddTwoTokens
  | SummaryWithdraw
  | SummaryStake
  | SummaryUnStake
  | SummaryClaimReward
  | SummaryUnlockSone
