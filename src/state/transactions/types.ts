export enum TransactionType {
  SWAP = 'SWAP',
  ADD_ONE_TOKEN = 'ADD_ONE_TOKEN',
  ADD_TWO_TOKENS = 'ADD_TWO_TOKENS',
  WITHDRAW = 'WITHDRAW',
  STAKE = 'STAKE',
  UNSTAKE = 'UNSTAKE'
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

export type TransactionSummary = SummarySwap | SummaryAddOneToken | SummaryAddTwoTokens
