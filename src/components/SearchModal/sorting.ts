import { Token, TokenAmount } from '@s-one-finance/sdk-core'
import { useMemo } from 'react'
import { useAllTokenBalances } from '../../state/wallet/hooks'

// compare two token amounts with highest one coming first
function balanceComparator(balanceA?: TokenAmount, balanceB?: TokenAmount) {
  if (balanceA && balanceB) {
    return balanceA.greaterThan(balanceB) ? -1 : balanceA.equalTo(balanceB) ? 0 : 1
  } else if (balanceA && balanceA.greaterThan('0')) {
    return -1
  } else if (balanceB && balanceB.greaterThan('0')) {
    return 1
  }
  return 0
}

function getTokenComparator(balances: {
  [tokenAddress: string]: TokenAmount | undefined
}): (tokenA: Token, tokenB: Token) => number {
  return function sortTokens(tokenA: Token, tokenB: Token): number {
    // -1 = a is first
    // 1 = b is first

    // sort by balances
    const balanceA = balances[tokenA.address]
    const balanceB = balances[tokenB.address]

    const balanceComp = balanceComparator(balanceA, balanceB)
    if (balanceComp !== 0) return balanceComp

    if (tokenA.symbol && tokenB.symbol) {
      // sort by symbol
      return tokenA.symbol.toLowerCase() < tokenB.symbol.toLowerCase() ? -1 : 1
    } else {
      return tokenA.symbol ? -1 : tokenB.symbol ? -1 : 0
    }
  }
}

/**
 * Kết quả: fix cứng token balance giảm dần + sort tên token
 * VD: [ POS: 403 > ALA: 200 > AKIA: 2 ] > [ AAA: 0 > BBB: 0 > CCC: 0 > ... ]
 * @param inverted
 */
export function useSortedTokens(tokens: Token[], inverted: boolean): Token[] {
  const balances = useAllTokenBalances()

  return useMemo(() => {
    const tokensWithBalance: Token[] = []
    const tokensWithoutBalance: Token[] = []
    tokens.forEach(token => {
      if (balances[token.address]?.greaterThan('0')) {
        tokensWithBalance.push(token)
      } else {
        tokensWithoutBalance.push(token)
      }
    })
    const comparator = getTokenComparator(balances ?? {})
    const sortedTokensWithBalance = tokensWithBalance.sort(comparator)
    const sortedTokensWithoutBalance = inverted ? [...tokensWithoutBalance.reverse()] : tokensWithoutBalance
    return [...sortedTokensWithBalance, ...sortedTokensWithoutBalance]
  }, [balances, inverted, tokens])
}
