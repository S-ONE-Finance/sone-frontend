import { useMemo } from 'react'
import { useQuery } from 'react-query'

import { swapClients } from 'graphql/clients'
import { ethPriceQuery, userLiquidityPositionsQuery } from 'graphql/swapQueries'

import { useActiveWeb3React } from 'hooks'
import { useLastTruthy } from './useLast'
import BigNumber from 'bignumber.js'

export default function useMyLiquidityApy(pairAddress: string): number | undefined {
  const { account, chainId } = useActiveWeb3React()

  const { data: userLiquidityPositionsQueryData } = useQuery(
    ['useMyLiquidityApy_userLiquidityPositionsQueryData', account, chainId],
    async () => {
      if (!account || !chainId) return undefined
      const res = await swapClients[chainId].query({
        query: userLiquidityPositionsQuery(account.toLowerCase())
      })
      return res.data.user.liquidityPositions
    },
    { enabled: Boolean(account && chainId) }
  )

  const userLiquidityPositions = useLastTruthy(userLiquidityPositionsQueryData) ?? []

  const { data: ethPriceQueryData } = useQuery(
    ['useMyLiquidityApy_userLiquidityPositionsQueryData', chainId],
    async () => {
      if (!chainId) return undefined
      const res = await swapClients[chainId].query({
        query: ethPriceQuery
      })
      const raw = res.data.bundle.ethPrice
      return new BigNumber(raw)
    },
    {
      enabled: Boolean(chainId)
    }
  )

  const ethPrice: BigNumber = useLastTruthy(ethPriceQueryData) ?? new BigNumber('0')

  return useMemo(() => {
    try {
      if (!account) return undefined

      let userLpToken = 0
      let totalSupplyLp = 0
      let derivedETHTokenSwap = 0,
        swaps: any,
        mints: any,
        totalSwapAmount = 0,
        totalTokenAmount = 0

      // Check correct pair and exact user.
      for (const lp of userLiquidityPositions) {
        if (lp.pair.id === pairAddress.toLowerCase()) {
          swaps = lp.pair.swaps
          mints = lp.pair.mints
          userLpToken = lp.liquidityTokenBalance
          totalSupplyLp = lp.pair.totalSupply
        }
      }

      if (swaps === undefined || mints === undefined) return undefined

      for (const swap of swaps) {
        if (swap.amount0In && swap.amount1In === '0') {
          derivedETHTokenSwap += Number(swap.pair.token0.derivedETH) * swap.amount0In
        } else if (swap.amount1In && swap.amount0In === '0') {
          derivedETHTokenSwap += Number(swap.pair.token1.derivedETH) * swap.amount1In
        }
      }

      totalSwapAmount = derivedETHTokenSwap * ethPrice.toNumber()
      // 1. 0.2% reward cho LPs
      // 2. 0.05% chuyển đổi thành SONE token (reward SONE cho LPs thay vì reward token0 trong pool, nhằm tăng giá trị cho SONE)
      const swapFee = 0.0025 * totalSwapAmount
      const numerator = (userLpToken * swapFee) / totalSupplyLp
      // A USD + B USD
      for (const mint of mints) {
        totalTokenAmount += +mint.amountUSD
      }
      const denominator = totalTokenAmount
      return numerator / denominator
    } catch (err) {
      console.log(`err`, err)
      return undefined
    }
  }, [account, ethPrice, pairAddress, userLiquidityPositions])
}
