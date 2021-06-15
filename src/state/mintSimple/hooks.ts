import { Currency, CurrencyAmount, Pair, Percent, Price, TokenAmount } from '@s-one-finance/sdk-core'
import { PairState } from 'data/Reserves'
import { useTotalSupply } from 'data/TotalSupply'
import { useActiveWeb3React } from 'hooks'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { tryParseAmount } from 'state/swap/hooks'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { wrappedCurrency as wrapCurrency } from 'utils/wrappedCurrency'

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
  currency?: Currency | null
): {
  maxAmount?: CurrencyAmount
  error?: string
} {
  const { account, chainId } = useActiveWeb3React()

  const { typedValue } = useMintSimpleState()

  const totalSupply = useTotalSupply(pair?.liquidityToken)

  const currencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)

  const maxAmount = maxAmountSpend(currencyBalance)

  // Ở đây gọi lấy ra lượng ETH - DAI sau khi swap và mint.
  const parsedAmount = tryParseAmount(typedValue, currency ?? undefined)

  let error: string | undefined

  if (!account) {
    error = 'Connect Wallet'
  }

  if (pairState === PairState.INVALID) {
    error = error ?? 'Invalid Pair'
  }

  if (parsedAmount && currencyBalance?.lessThan(parsedAmount)) {
    error = 'Insufficient' + currency?.symbol + ' balance'
  }

  return {
    maxAmount,
    error
  }
}
