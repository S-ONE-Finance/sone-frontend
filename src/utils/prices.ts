import { BLOCKED_PRICE_IMPACT_NON_EXPERT } from '../constants'
import { Currency, CurrencyAmount, Fraction, JSBI, Percent, TokenAmount, Trade } from '@s-one-finance/sdk-core'
import { ALLOWED_PRICE_IMPACT_HIGH, ALLOWED_PRICE_IMPACT_LOW, ALLOWED_PRICE_IMPACT_MEDIUM } from '../constants'
import { basisPointsToPercent } from './index'
import { Field as FieldSwap } from '../state/swap/actions'
import { Field as FieldMint } from '../state/mint/actions'

const BASE_FEE = new Percent(JSBI.BigInt(30), JSBI.BigInt(10000))
const ONE_HUNDRED_PERCENT = new Percent(JSBI.BigInt(10000), JSBI.BigInt(10000))
const INPUT_FRACTION_AFTER_FEE = ONE_HUNDRED_PERCENT.subtract(BASE_FEE)

// computes price breakdown for the trade
export function computeTradePriceBreakdown(
  trade?: Trade | null
): { priceImpactWithoutFee: Percent | undefined; realizedLPFee: CurrencyAmount | undefined | null } {
  // for each hop in our trade, take away the x*y=k price impact from 0.3% fees
  // e.g. for 3 tokens/2 hops: 1 - ((1 - .03) * (1-.03))
  const realizedLPFee = !trade
    ? undefined
    : ONE_HUNDRED_PERCENT.subtract(
        trade.route.pairs.reduce<Fraction>(
          (currentFee: Fraction): Fraction => currentFee.multiply(INPUT_FRACTION_AFTER_FEE),
          ONE_HUNDRED_PERCENT
        )
      )

  // remove lp fees from price impact
  const priceImpactWithoutFeeFraction = trade && realizedLPFee ? trade.priceImpact.subtract(realizedLPFee) : undefined

  // the x*y=k impact
  const priceImpactWithoutFeePercent = priceImpactWithoutFeeFraction
    ? new Percent(priceImpactWithoutFeeFraction?.numerator, priceImpactWithoutFeeFraction?.denominator)
    : undefined

  // the amount of the input that accrues to LPs
  const realizedLPFeeAmount =
    realizedLPFee &&
    trade &&
    (trade.inputAmount instanceof TokenAmount
      ? new TokenAmount(trade.inputAmount.token, realizedLPFee.multiply(trade.inputAmount.raw).quotient)
      : CurrencyAmount.ether(realizedLPFee.multiply(trade.inputAmount.raw).quotient))

  return { priceImpactWithoutFee: priceImpactWithoutFeePercent, realizedLPFee: realizedLPFeeAmount }
}

// computes the minimum amount out and maximum amount in for a trade given a user specified allowed slippage in bips
export function computeSlippageAdjustedAmounts(
  trade: Trade | undefined,
  allowedSlippage: number
): { [field in FieldSwap]?: CurrencyAmount } {
  const pct = basisPointsToPercent(allowedSlippage)
  return {
    [FieldSwap.INPUT]: trade?.maximumAmountIn(pct),
    [FieldSwap.OUTPUT]: trade?.minimumAmountOut(pct)
  }
}

export function warningSeverity(priceImpact: Percent | undefined): 0 | 1 | 2 | 3 | 4 {
  if (!priceImpact?.lessThan(BLOCKED_PRICE_IMPACT_NON_EXPERT)) return 4
  if (!priceImpact?.lessThan(ALLOWED_PRICE_IMPACT_HIGH)) return 3
  if (!priceImpact?.lessThan(ALLOWED_PRICE_IMPACT_MEDIUM)) return 2
  if (!priceImpact?.lessThan(ALLOWED_PRICE_IMPACT_LOW)) return 1
  return 0
}

export function formatExecutionPriceWithCurrencies(
  currencies: { [field in FieldMint]?: Currency },
  price?: Fraction,
  inverted?: boolean
): string {
  if (!price) {
    return ''
  }

  return inverted
    ? `1 ${currencies[FieldMint.CURRENCY_B]?.symbol} = ${price?.invert().toSignificant(6)} ${
        currencies[FieldMint.CURRENCY_A]?.symbol
      }`
    : `1 ${currencies[FieldMint.CURRENCY_A]?.symbol} = ${price?.toSignificant(6)} ${
        currencies[FieldMint.CURRENCY_B]?.symbol
      }`
}

// Không nghĩ ra tên hay hơn.
// TODO: Need refactor cái đống currencies và tokens bên add liquidity one token mode thành kiểu FIELD.CURRENCY_A và FIELD.CURRENCY_B hết nhé.
export function formatExecutionPriceWithCurrencies2(
  currency0?: Currency,
  currency1?: Currency,
  price?: Fraction,
  inverted?: boolean
): string {
  if (!price) {
    return ''
  }

  return inverted
    ? `1 ${currency1?.symbol} = ${price?.invert().toSignificant(6)} ${currency0?.symbol}`
    : `1 ${currency0?.symbol} = ${price?.toSignificant(6)} ${currency1?.symbol}`
}
