import React from 'react'
import { Trade, TradeType } from '@s-one-finance/sdk-core'
import { useTranslation } from 'react-i18next'
import { Field } from '../../state/swap/actions'
import { useUserSlippageTolerance } from '../../state/user/hooks'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from '../../utils/prices'
import { AutoColumn, ColumnCenter } from '../Column'
import { QuestionHelper1416 } from '../QuestionHelper'
import Row, { RowBetween, RowFixed } from '../Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import SwapRoute from './SwapRoute'
import { Text } from 'rebass'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import useTheme from '../../hooks/useTheme'
import ViewPairAnalytics from '../ViewPairAnalytics'
import { wrappedCurrency } from '../../utils/wrappedCurrency'
import { useActiveWeb3React } from '../../hooks'

function TradeSummary({ trade, allowedSlippage }: { trade: Trade; allowedSlippage: number }) {
  const { t } = useTranslation()
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const mobile13Desktop16 = isUpToExtraSmall ? 13 : 16
  const theme = useTheme()

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade)
  const isExactIn = trade.tradeType === TradeType.EXACT_INPUT
  const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(trade, allowedSlippage)

  return (
    <>
      <AutoColumn style={{ padding: isUpToExtraSmall ? '0 8px' : '0 16px' }} gap={isUpToExtraSmall ? '10px' : '15px'}>
        <RowBetween>
          <RowFixed>
            <Text fontWeight={500} fontSize={mobile13Desktop16} color={theme.text4Sone}>
              {isExactIn ? t('minimum_received') : t('maximum_sold')}
            </Text>
            <QuestionHelper1416
              text={t(isExactIn ? 'question_helper_minimum_received' : 'question_helper_maximum_sold')}
            />
          </RowFixed>
          <RowFixed>
            <Text fontWeight={700} fontSize={mobile13Desktop16} color={theme.text6Sone}>
              {isExactIn
                ? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4) + ' '
                : slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4) + ' '}
              <Text fontSize={13} display="inline">
                {isExactIn ? trade.outputAmount.currency.symbol : trade.inputAmount.currency.symbol}
              </Text>
            </Text>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <Text fontWeight={500} fontSize={mobile13Desktop16} color={theme.text4Sone}>
              {t('price_impact')}
            </Text>
            <QuestionHelper1416 text={t('question_helper_price_impact')} />
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>
      </AutoColumn>
    </>
  )
}

export interface AdvancedSwapDetailsProps {
  trade?: Trade
}

export function AdvancedSwapDetailsContent({ trade }: AdvancedSwapDetailsProps) {
  const { t } = useTranslation()
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const theme = useTheme()

  const [allowedSlippage] = useUserSlippageTolerance()
  const { chainId } = useActiveWeb3React()
  const tokenInput = trade && chainId && wrappedCurrency(trade.route.input, chainId)
  const tokenOutput = trade && chainId && wrappedCurrency(trade.route.output, chainId)

  const showRoute = Boolean(trade && trade.route.path.length > 2)

  return (
    <AutoColumn gap="0px">
      {trade && (
        <>
          <TradeSummary trade={trade} allowedSlippage={allowedSlippage} />
          {showRoute && (
            <Row padding={isUpToExtraSmall ? '10px 8px 0' : '15px 16px 0'}>
              <AutoColumn gap={'15px'} style={{ width: '100%' }}>
                <RowBetween>
                  <RowFixed>
                    <Text fontWeight={500} fontSize={isUpToExtraSmall ? 13 : 16} color={theme.text4Sone}>
                      {t('route')}
                    </Text>
                    <QuestionHelper1416 text={t('question_helper_route')} />
                  </RowFixed>
                </RowBetween>
                <Row>
                  <SwapRoute trade={trade} />
                </Row>
              </AutoColumn>
            </Row>
          )}
          <ColumnCenter style={{ marginTop: isUpToExtraSmall ? '25px' : '2.1875rem' }}>
            <ViewPairAnalytics
              pairAddress={trade.route.pairs[0].liquidityToken.address}
              tokenA={tokenInput}
              tokenB={tokenOutput}
            />
          </ColumnCenter>
        </>
      )}
    </AutoColumn>
  )
}
