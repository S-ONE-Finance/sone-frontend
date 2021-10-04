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
  const tokensWithBalance = useMemo(
    () =>
      (Object.values(balances).filter(tokenAmount => tokenAmount !== undefined) as TokenAmount[]).filter(
        tokenAmount => tokens.some(token => token.address === tokenAmount.token.address) && tokenAmount.greaterThan('0')
      ),
    [balances, tokens]
  )
  const comparator = useMemo(() => getTokenComparator(balances ?? {}), [balances])
  const sortedTokensWithBalance = useMemo(
    () => tokensWithBalance.map(tokenAmount => tokenAmount.token).sort(comparator),
    [comparator, tokensWithBalance]
  )
  const tokensWithoutBalance = useMemo(
    () => tokens.filter(token => !sortedTokensWithBalance.some((twb: Token) => twb.address === token.address)),
    [sortedTokensWithBalance, tokens]
  )
  const sortedTokensWithoutBalance = useMemo(
    () => (inverted ? [...tokensWithoutBalance.reverse()] : tokensWithoutBalance),
    [inverted, tokensWithoutBalance]
  )
  return useMemo(() => [...sortedTokensWithBalance, ...sortedTokensWithoutBalance], [
    sortedTokensWithBalance,
    sortedTokensWithoutBalance
  ])
}
