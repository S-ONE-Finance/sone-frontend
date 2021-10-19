import { Pair } from '@s-one-finance/sdk-core'
import { useActiveWeb3React } from './index'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../state/user/hooks'
import { useMemo } from 'react'
import { useTokenBalancesWithLoadingIndicator } from '../state/wallet/hooks'
import { usePairs } from '../data/Reserves'

export default function useAddedLiquidityPairs(): [boolean, Array<Pair>] {
  const { account } = useActiveWeb3React()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map(tokens => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs]
  )
  const liquidityTokens = useMemo(() => tokenPairsWithLiquidityTokens.map(tpwlt => tpwlt.liquidityToken), [
    tokenPairsWithLiquidityTokens
  ])
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const addedPairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
    .map(([, pair]) => pair)
    .filter((pair): pair is Pair => Boolean(pair))

  const isLoading =
    fetchingV2PairBalances || addedPairs?.length < liquidityTokensWithBalances.length || addedPairs?.some(pair => !pair)

  return [isLoading, addedPairs]
}
