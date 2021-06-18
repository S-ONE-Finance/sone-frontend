import { Currency, CurrencyAmount, JSBI, Pair, Percent, Price, TokenAmount } from '@s-one-finance/sdk-core'
import { PairState } from 'data/Reserves'
import { useTotalSupply } from 'data/TotalSupply'
import { useActiveWeb3React } from 'hooks'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { tryParseAmount } from 'state/swap/hooks'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { wrappedCurrency, wrappedCurrencyAmount } from 'utils/wrappedCurrency'
import { AppDispatch, AppState } from '../index'
import { typeInput } from './actions'

const ZERO = JSBI.BigInt(0)

export function useMintSimpleState(): AppState['mintSimple'] {
  return useSelector<AppState, AppState['mintSimple']>(state => state.mintSimple)
}

export function useMintSimpleActionHandlers(): {
  onFieldInput: (typedValue: string) => void
} {
  const dispatch = useDispatch<AppDispatch>()

  const onFieldInput = useCallback(
    (typedValue: string) => {
      dispatch(typeInput({ typedValue }))
    },
    [dispatch]
  )

  return {
    onFieldInput
  }
}

export function useDerivedMintSimpleInfo(
  pairState: PairState,
  pair: Pair | null,
  selectedCurrency?: Currency
): {
  maxAmount?: CurrencyAmount
  parsedAmount?: CurrencyAmount
  token0ParsedAmount?: TokenAmount
  token1ParsedAmount?: TokenAmount
  noLiquidity: boolean
  price?: Price
  poolTokenPercentage?: Percent
  error?: string
} {
  const { account, chainId } = useActiveWeb3React()

  const { typedValue } = useMintSimpleState()

  const currencyBalance = useCurrencyBalance(account ?? undefined, selectedCurrency ?? undefined)

  const maxAmount = maxAmountSpend(currencyBalance)

  // parsedAmount = lượng currency mà người dùng nhập vào.
  // selectedTokenParsedAmount = lượng selected currency sau khi chia 2.
  // theOtherTokenParsedAmount = lượng currency sau khi lấy selectedTokenParsedAmount ra để swap.
  // token0IsSelected = true nếu currency mà người dùng chọn là pair.token0
  // token0ParsedAmount = số lượng pair.token0
  // token1ParsedAmount = số lượng pair.token1
  // TODO: refactor chỗ này từ token0ParsedAmount, token1ParsedAmount -> selectedTokenParsedAmount, theOtherTokenParsedAmount.
  const parsedAmount = tryParseAmount(typedValue, selectedCurrency ?? undefined)
  const wrappedParsedAmount = wrappedCurrencyAmount(parsedAmount, chainId)
  const [selectedTokenParsedAmount, theOtherTokenParsedAmount] =
    (pair && wrappedParsedAmount && pair.getAmountsAddOneToken(wrappedParsedAmount)) ?? []
  const selectedToken = wrappedCurrency(selectedCurrency, chainId)
  const token0IsSelected = selectedToken && pair?.token0 && pair?.token0.equals(selectedToken)
  let token0ParsedAmount: TokenAmount | undefined = undefined
  let token1ParsedAmount: TokenAmount | undefined = undefined
  if (token0IsSelected !== undefined) {
    token0ParsedAmount = token0IsSelected ? selectedTokenParsedAmount : theOtherTokenParsedAmount
    token1ParsedAmount = token0IsSelected ? theOtherTokenParsedAmount : selectedTokenParsedAmount
  }

  // const [token0ParsedAmount, token1ParsedAmount] =
  //   (pair && wrappedParsedAmount && pair.getAmountsAddOneToken(wrappedParsedAmount)) ?? []

  const totalSupply = useTotalSupply(pair?.liquidityToken)

  const noLiquidity = pairState === PairState.NOT_EXISTS || Boolean(totalSupply && JSBI.equal(totalSupply.raw, ZERO))

  const price = useMemo(() => {
    if (noLiquidity) {
      if (token0ParsedAmount && token1ParsedAmount) {
        return new Price(
          token0ParsedAmount.currency,
          token1ParsedAmount.currency,
          token0ParsedAmount.raw,
          token1ParsedAmount.raw
        )
      }
      return undefined
    } else {
      return pair && pair.token0 ? pair.priceOf(pair.token0) : undefined
    }
  }, [noLiquidity, pair, token0ParsedAmount, token1ParsedAmount])

  const liquidityMinted = useMemo(() => {
    if (pair !== null && totalSupply && token0ParsedAmount && token1ParsedAmount) {
      return pair.getLiquidityMinted(totalSupply, token0ParsedAmount, token1ParsedAmount)
    } else {
      return undefined
    }
  }, [pair, token0ParsedAmount, token1ParsedAmount, totalSupply])

  const poolTokenPercentage = useMemo(() => {
    if (liquidityMinted && totalSupply) {
      return new Percent(liquidityMinted.raw, totalSupply.add(liquidityMinted).raw)
    } else {
      return undefined
    }
  }, [liquidityMinted, totalSupply])

  // Error section.
  let error: string | undefined

  if (!account) {
    error = 'Connect Wallet'
  } else if (pairState === PairState.INVALID) {
    error = 'Invalid Pair'
  } else if (noLiquidity) {
    error = 'Invalid Pair (No Liquidity)'
  } else if (parsedAmount && currencyBalance?.lessThan(parsedAmount)) {
    error = 'Insufficient' + selectedCurrency?.symbol + ' balance'
  }

  return {
    maxAmount,
    parsedAmount,
    token0ParsedAmount,
    token1ParsedAmount,
    noLiquidity,
    price,
    poolTokenPercentage,
    error
  }
}
