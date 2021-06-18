export enum TransactionType {
  SWAP = 'SWAP',
  ADD_ONE_TOKEN = 'ADD_ONE_TOKEN',
  ADD_TWO_TOKENS = 'ADD_TWO_TOKENS'
}

export interface SummaryTwoToken {
  type: TransactionType
  token0Amount?: string
  token0Symbol?: string
  token1Amount?: string
  token1Symbol?: string
}

export function isSummaryTwoToken(object: any): object is SummaryTwoToken {
  return (object as SummaryTwoToken).type !== undefined
}

export type TransactionSummary = SummaryTwoToken
