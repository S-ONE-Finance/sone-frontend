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
  theOtherCurrency?: Currency
  maxAmount?: CurrencyAmount
  userInputParsedAmount?: CurrencyAmount
  selectedTokenParsedAmount?: TokenAmount
  theOtherTokenParsedAmount?: TokenAmount
  noLiquidity: boolean
  price?: Price
  poolTokenPercentage?: Percent
  error?: string
} {
  const { account, chainId } = useActiveWeb3React()

  const { typedValue } = useMintSimpleState()

  const currencyBalance = useCurrencyBalance(account ?? undefined, selectedCurrency ?? undefined)

  const maxAmount = maxAmountSpend(currencyBalance)

  // userInputParsedAmount = lượng currency mà người dùng nhập vào.
  // selectedTokenParsedAmount = lượng selected currency sau khi chia 2.
  // theOtherTokenParsedAmount = lượng currency sau khi lấy selectedTokenParsedAmount ra để swap.
  const userInputParsedAmount = tryParseAmount(typedValue, selectedCurrency ?? undefined)
  const wrappedUserInputParsedAmount = wrappedCurrencyAmount(userInputParsedAmount, chainId)
  const [selectedTokenParsedAmount, theOtherTokenParsedAmount] =
    (pair && wrappedUserInputParsedAmount && pair.getAmountsAddOneToken(wrappedUserInputParsedAmount)) ?? []

  const totalSupply = useTotalSupply(pair?.liquidityToken)

  const noLiquidity = pairState === PairState.NOT_EXISTS || Boolean(totalSupply && JSBI.equal(totalSupply.raw, ZERO))

  const selectedToken = wrappedCurrency(selectedCurrency, chainId)
  const price = useMemo(() => {
    if (noLiquidity) {
      if (selectedTokenParsedAmount && theOtherTokenParsedAmount) {
        return new Price(
          selectedTokenParsedAmount.currency,
          theOtherTokenParsedAmount.currency,
          selectedTokenParsedAmount.raw,
          theOtherTokenParsedAmount.raw
        )
      }
      return undefined
    } else {
      // FIXME: Chỗ này có thể bị ngược token0 token1, kiểm tra sau.
      return pair && pair.token0 && pair.token1 && selectedToken
        ? pair.priceOf(pair.token0.equals(selectedToken) ? pair.token0 : pair.token1)
        : undefined
    }
  }, [noLiquidity, pair, selectedToken, selectedTokenParsedAmount, theOtherTokenParsedAmount])

  const liquidityMinted = useMemo(() => {
    if (pair !== null && totalSupply && selectedTokenParsedAmount && theOtherTokenParsedAmount) {
      return pair.getLiquidityMinted(totalSupply, selectedTokenParsedAmount, theOtherTokenParsedAmount)
    } else {
      return undefined
    }
  }, [pair, selectedTokenParsedAmount, theOtherTokenParsedAmount, totalSupply])

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
  } else if (userInputParsedAmount && currencyBalance?.lessThan(userInputParsedAmount)) {
    error = 'Insufficient' + selectedCurrency?.symbol + ' balance'
  }

  return {
    maxAmount,
    userInputParsedAmount,
    selectedTokenParsedAmount,
    theOtherTokenParsedAmount,
    noLiquidity,
    price,
    poolTokenPercentage,
    error
  }
}
