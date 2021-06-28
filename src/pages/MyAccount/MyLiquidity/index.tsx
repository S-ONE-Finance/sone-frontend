import React, { useMemo } from 'react'
import { Heading } from '../index.styled'
import { RowBetween, RowFitContent } from '../../../components/Row'
import MyLiquidityItem from './MyLiquidityItem'
import { ButtonAddLiquidity, CardLiquidity, PlusIcon, ResponsiveColumn, TextAddLiquidity } from './index.styled'
import { useActiveWeb3React } from '../../../hooks'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../../state/user/hooks'
import { useTokenBalancesWithLoadingIndicator } from '../../../state/wallet/hooks'
import { usePairs } from '../../../data/Reserves'
import { Pair } from '@s-one-finance/sdk-core'
import { Link } from 'react-router-dom'

export default function MyLiquidity() {
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

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
    .map(([, pair]) => pair)
    .filter((pair): pair is Pair => Boolean(pair))
  const isLoading =
    fetchingV2PairBalances || pairs?.length < liquidityTokensWithBalances.length || pairs?.some(pair => !pair)

  return (
    <ResponsiveColumn>
      <RowBetween>
        <Heading>My Liquidity</Heading>
        <ButtonAddLiquidity as={Link} to="/add/ETH">
          <RowFitContent gap="8px">
            <PlusIcon />
            <TextAddLiquidity>Add Liquidity</TextAddLiquidity>
          </RowFitContent>
        </ButtonAddLiquidity>
      </RowBetween>
      <CardLiquidity>
        {isLoading
          ? 'Loading...'
          : pairs.length > 0
          ? pairs.map(pair => <MyLiquidityItem key={pair.liquidityToken.address} pair={pair} />)
          : 'No item to show.'}
      </CardLiquidity>
    </ResponsiveColumn>
  )
}
