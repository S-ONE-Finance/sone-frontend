import { Currency, CurrencyAmount, Pair, TokenAmount } from '@s-one-finance/sdk-core'
import { PairState } from 'data/Reserves'
import { useTotalSupply } from 'data/TotalSupply'
import { useActiveWeb3React } from 'hooks'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { tryParseAmount } from 'state/swap/hooks'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { wrappedCurrencyAmount } from 'utils/wrappedCurrency'
import { AppDispatch, AppState } from '../index'
import { typeInput } from './actions'

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

// currencyBalance?: CurrencyAmount
// maxAmount?: CurrencyAmount
// price?: Price
// liquidityMinted?: TokenAmount
// poolTokenPercentage?: Percent
// error?: string

export function useDerivedMintSimpleInfo(
  pairState: PairState,
  pair: Pair | null,
  selectedCurrency?: Currency | null
): {
  maxAmount?: CurrencyAmount
  parsedAmount?: CurrencyAmount
  token0ParsedAmount?: TokenAmount
  token1ParsedAmount?: TokenAmount
  error?: string
} {
  const { account, chainId } = useActiveWeb3React()

  const { typedValue } = useMintSimpleState()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const totalSupply = useTotalSupply(pair?.liquidityToken)

  const currencyBalance = useCurrencyBalance(account ?? undefined, selectedCurrency ?? undefined)

  const maxAmount = maxAmountSpend(currencyBalance)

  // Ở đây gọi lấy ra lượng CurrencyA - CurrencyB sau khi chia đôi ra để swap.
  const parsedAmount = tryParseAmount(typedValue, selectedCurrency ?? undefined)

  const wrappedParsedAmount = wrappedCurrencyAmount(parsedAmount, chainId)
  const tokenMintAmounts = (pair && wrappedParsedAmount && pair.getAmountsAddOneToken(wrappedParsedAmount)) ?? undefined

  // Error section.
  let error: string | undefined

  if (!account) {
    error = 'Connect Wallet'
  }

  if (pairState === PairState.INVALID) {
    error = error ?? 'Invalid Pair'
  }

  if (parsedAmount && currencyBalance?.lessThan(parsedAmount)) {
    error = 'Insufficient' + selectedCurrency?.symbol + ' balance'
  }

  return {
    maxAmount,
    parsedAmount,
    token0ParsedAmount: tokenMintAmounts && tokenMintAmounts[0],
    token1ParsedAmount: tokenMintAmounts && tokenMintAmounts[1],
    error
  }
}
