import { useMemo } from 'react'
import { isAddress } from '../../utils'
import { Pair, Token } from '@s-one-finance/sdk-core'

export function filterTokens(tokens: Token[], search: string): Token[] {
  if (search.length === 0) return tokens

  const searchingAddress = isAddress(search)

  if (searchingAddress) {
    return tokens.filter(token => token.address === searchingAddress)
  }

  const lowerSearchParts = search
    .toLowerCase()
    .split(/\s+/)
    .filter(s => s.length > 0)

  if (lowerSearchParts.length === 0) {
    return tokens
  }

  const matchesSearch = (s: string): boolean => {
    const sParts = s
      .toLowerCase()
      .split(/\s+/)
      .filter(s => s.length > 0)

    return lowerSearchParts.every(p => p.length === 0 || sParts.some(sp => sp.startsWith(p) || sp.endsWith(p)))
  }

  return tokens.filter(token => {
    const { symbol, name } = token
    return (symbol && matchesSearch(symbol)) || (name && matchesSearch(name))
  })
}

export function useSortedTokensByQuery(tokens: Token[] | undefined, searchQuery: string): Token[] {
  return useMemo(() => {
    if (!tokens) {
      return []
    }

    const symbolMatch = searchQuery
      .toLowerCase()
      .split(/\s+/)
      .filter(s => s.length > 0)

    if (symbolMatch.length > 1) {
      return tokens
    }

    const exactMatches: Token[] = []
    const symbolSubtrings: Token[] = []
    const rest: Token[] = []

    // sort tokens by exact match -> subtring on symbol match -> rest
    tokens.map(token => {
      if (token.symbol?.toLowerCase() === symbolMatch[0]) {
        return exactMatches.push(token)
      } else if (token.symbol?.toLowerCase().startsWith(searchQuery.toLowerCase().trim())) {
        return symbolSubtrings.push(token)
      } else {
        return rest.push(token)
      }
    })

    return [...exactMatches, ...symbolSubtrings, ...rest]
  }, [tokens, searchQuery])
}

export function filterPairs(pairs: Pair[], rawQuery: string): Pair[] {
  const queries = rawQuery
    .trim()
    .toLowerCase()
    .split(' ')
  if (queries.length > 2) return []

  const [q0, q1] = queries

  const res = pairs.filter(pair => {
    const { token0, token1 } = pair
    const { symbol: symbol0, name: name0 } = token0
    const { symbol: symbol1, name: name1 } = token1
    const symbolName0 = symbol0?.toLowerCase() ?? '' + ' - ' + name0?.toLowerCase() ?? ''
    const symbolName1 = symbol1?.toLowerCase() ?? '' + ' - ' + name1?.toLowerCase() ?? ''
    const symbolNameAll = symbolName0 + ' ' + symbolName1

    return q1 === undefined
      ? symbolNameAll.includes(q0)
      : (symbolName0.includes(q0) && symbolName1.includes(q1)) || (symbolName0.includes(q1) && symbolName1.includes(q0))
  })

  return res
}
