import { Trade, TradeType } from '@s-one-finance/sdk-core'
import React from 'react'
import styled from 'styled-components'
import { Field } from '../../state/swap/actions'
import { useUserSlippageTolerance } from '../../state/user/hooks'
import { ExternalLink } from '../../theme'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from '../../utils/prices'
import { AutoColumn, ColumnCenter } from '../Column'
import { QuestionHelper1416 } from '../QuestionHelper'
import Row, { RowBetween, RowFixed } from '../Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import SwapRoute from './SwapRoute'
import { Text } from 'rebass'
import { darken } from 'polished'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import useTheme from '../../hooks/useTheme'

const InfoLink = styled(ExternalLink)`
  width: fit-content;
  font-size: 16px;
  padding: 10px 35px;
  border-radius: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.text5Sone};
  background-color: ${({ theme }) => theme.f3f3f3};

  :hover,
  :active,
  :focus {
    outline: none;
    text-decoration: unset;
  }

  :hover {
    background-color: ${({ theme }) => darken(0.1, theme.f3f3f3)};
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;
    padding: 6px 20px;
    border-radius: 20px;
  `}
`

function TradeSummary({ trade, allowedSlippage }: { trade: Trade; allowedSlippage: number }) {
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
              {isExactIn ? 'Minimum received' : 'Maximum sold'}
            </Text>
            <QuestionHelper1416 text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." />
          </RowFixed>
          <RowFixed>
            <Text fontWeight={700} fontSize={mobile13Desktop16} color={theme.text6Sone}>
              {isExactIn
                ? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)} ${trade.outputAmount.currency.symbol}` ??
                  '-'
                : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)} ${trade.inputAmount.currency.symbol}` ??
                  '-'}
            </Text>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <Text fontWeight={500} fontSize={mobile13Desktop16} color={theme.text4Sone}>
              Price Impact
            </Text>
            <QuestionHelper1416 text="The difference between the market price and estimated price due to trade size." />
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
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const theme = useTheme()

  const [allowedSlippage] = useUserSlippageTolerance()

  const showRoute = Boolean(trade && trade.route.path.length > 2)

  return (
    <AutoColumn gap="0px">
      {trade && (
        <>
          <TradeSummary trade={trade} allowedSlippage={allowedSlippage} />
          {showRoute && (
            <Row padding={'15px 16px 0'}>
              <AutoColumn gap={'15px'} style={{ width: '100%' }}>
                <RowBetween>
                  <RowFixed>
                    <Text fontWeight={500} fontSize={16} color={theme.text4Sone}>
                      Route
                    </Text>
                    <QuestionHelper1416 text="Routing through these tokens resulted in the best price for your trade." />
                  </RowFixed>
                </RowBetween>
                <Row>
                  <SwapRoute trade={trade} />
                </Row>
              </AutoColumn>
            </Row>
          )}
          <ColumnCenter style={{ marginTop: isUpToExtraSmall ? '25px' : '35px' }}>
            <InfoLink
              href={'https://info.uniswap.org/pair/' + trade.route.pairs[0].liquidityToken.address}
              target="_blank"
            >
              View {trade.route.input.symbol} - {trade.route.output.symbol} analytics ↗
            </InfoLink>
          </ColumnCenter>
        </>
      )}
    </AutoColumn>
  )
}
