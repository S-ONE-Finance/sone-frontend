import { Trade, TradeType } from '@s-one-finance/sdk-core'
import React, { useMemo, useState } from 'react'
import { Text } from 'rebass'
import { useTranslation } from 'react-i18next'
import { Field } from '../../state/swap/actions'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown, warningSeverity } from '../../utils/prices'
import { ButtonError } from '../Button'
import { AutoColumn } from '../Column'
import { RowBetween, RowFixed } from '../Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import { SwapCallbackError } from './styleds'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import TradePrice from './TradePrice'
import useTheme from '../../hooks/useTheme'

export default function SwapModalFooter({
  trade,
  onConfirm,
  allowedSlippage,
  swapErrorMessage,
  disabledConfirm
}: {
  trade: Trade
  allowedSlippage: number
  onConfirm: () => void
  swapErrorMessage: string | undefined
  disabledConfirm: boolean
}) {
  const { t } = useTranslation()
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const mobile13Desktop16 = useMemo(() => (isUpToExtraSmall ? 13 : 16), [isUpToExtraSmall])
  const [showInverted, setShowInverted] = useState<boolean>(false)
  const theme = useTheme()
  const slippageAdjustedAmounts = useMemo(() => computeSlippageAdjustedAmounts(trade, allowedSlippage), [
    allowedSlippage,
    trade
  ])
  const { priceImpactWithoutFee, realizedLPFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const severity = warningSeverity(priceImpactWithoutFee)

  return (
    <>
      <AutoColumn gap={isUpToExtraSmall ? '10px' : '15px'}>
        <RowBetween align="center">
          <Text fontWeight={500} fontSize={mobile13Desktop16} color={theme.text4Sone}>
            {t('price')}
          </Text>
          <TradePrice price={trade?.executionPrice} showInverted={showInverted} setShowInverted={setShowInverted} />
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <Text fontWeight={500} fontSize={mobile13Desktop16} color={theme.text4Sone}>
              {trade.tradeType === TradeType.EXACT_INPUT ? t('minimum_received') : t('maximum_sold')}
            </Text>
          </RowFixed>
          <RowFixed>
            <Text fontWeight={700} fontSize={mobile13Desktop16} color={theme.text6Sone}>
              {trade.tradeType === TradeType.EXACT_INPUT
                ? (slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4) ?? '-') + ' '
                : (slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4) ?? '-') + ' '}
              <Text fontSize={13} display="inline">
                {trade.tradeType === TradeType.EXACT_INPUT
                  ? trade.outputAmount.currency.symbol
                  : trade.inputAmount.currency.symbol}
              </Text>
            </Text>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <Text fontWeight={500} fontSize={mobile13Desktop16} color={theme.text4Sone}>
              {t('price_impact')}
            </Text>
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <Text fontWeight={500} fontSize={mobile13Desktop16} color={theme.text4Sone}>
              {t('liquidity_provider_fee')}
            </Text>
          </RowFixed>
          <Text fontWeight={700} fontSize={mobile13Desktop16} color={theme.text6Sone}>
            {realizedLPFee ? realizedLPFee.toSignificant(6) + ' ' : '-'}
            <Text fontSize={13} display="inline">
              {trade.inputAmount.currency.symbol}
            </Text>
          </Text>
        </RowBetween>
      </AutoColumn>

      <ButtonError onClick={onConfirm} disabled={disabledConfirm} error={severity > 2} id="confirm-swap-or-send">
        <Text fontSize={isUpToExtraSmall ? 16 : 20} fontWeight={700}>
          {severity > 2 ? t('swap_anyway') : t('swap_verb')}
        </Text>
      </ButtonError>
      {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
    </>
  )
}
