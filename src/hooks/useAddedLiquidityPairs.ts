import { Pair, Token } from '@s-one-finance/sdk-core'
import { useActiveWeb3React } from './index'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../state/user/hooks'
import { useMemo } from 'react'
import { useCurrencyBalance, useTokenBalancesWithLoadingIndicator } from '../state/wallet/hooks'
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
  const temp = useCurrencyBalance(account ?? undefined, new Token(3, '0x96C6Ee57b7fc2677e96E86f5579Ff0542444e3f5', 18))
  console.log(`temp`, temp?.raw.toString())
  console.log(`tokenPairsWithLiquidityTokens`, tokenPairsWithLiquidityTokens)
  // console.log(
  //   `v2PairsBalances`,
  //   Object.values(v2PairsBalances).map(am => am?.raw.toString())
  // )
  // fetch the reserves for all V2 pools in which the user has a balance
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
