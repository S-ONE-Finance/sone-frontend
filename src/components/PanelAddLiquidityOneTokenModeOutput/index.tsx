import { Currency, TokenAmount } from '@s-one-finance/sdk-core'
import { AutoColumn } from 'components/Column'
import CurrencyLogo from 'components/CurrencyLogo'
import { RowBetween, RowFixed } from 'components/Row'
import { IconWrapper } from 'components/swap/styleds'
import useTheme from 'hooks/useTheme'
import { useIsUpToExtraSmall } from 'hooks/useWindowSize'
import React from 'react'
import { Plus } from 'react-feather'
import styled from 'styled-components'
import { TextPanelLabel } from 'theme'
import { unwrappedToken } from 'utils/wrappedCurrency'

const PanelWrapper = styled(AutoColumn)`
  width: 100%;
  border-radius: 32px;
  background-color: ${({ theme }) => theme.bgPanels};
  border: ${({ theme }) => `1px solid ${theme.border2Sone}`};
  padding: 21px 30px 40px;
  grid-row-gap: 17px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    border-radius: 20px;
    padding: 21px 15px 40px;
    grid-row-gap: 15px;
  `};
`

const CurrencyName = styled.span<{ active?: boolean }>`
  margin-left: ${({ active }) => (active ? '0.5rem' : '0')};
  font-size: 16px;
  font-weight: 500;

  ${({ theme, active }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;
    margin-left: ${active ? '0.25rem' : '0'};
  `};
`

const OutputAmount = styled.div`
  font-family: 'Inter', sans-serif;
  color: ${({ theme }) => theme.text6Sone};
  position: relative;
  font-weight: 700;
  font-size: 34px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 0;
  flex: 1 1 auto;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 20px;
  `};
`

function OutputCurrency({ currency, amount }: { currency?: Currency; amount?: string }) {
  return (
    <RowBetween>
      <OutputAmount>{amount}</OutputAmount>
      <RowFixed>
        <CurrencyLogo currency={currency} size="36px" sizeMobile="24px" />
        <CurrencyName active={Boolean(currency && currency.symbol)}>
          {(currency && currency.symbol && currency.symbol.length > 20
            ? currency.symbol.slice(0, 4) +
              '...' +
              currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
            : currency?.symbol) || ''}
        </CurrencyName>
      </RowFixed>
    </RowBetween>
  )
}

type PanelAddLiquidityOneTokenModeOutputProps = {
  token0ParsedAmount?: TokenAmount
  token1ParsedAmount?: TokenAmount
}

export default function PanelAddLiquidityOneTokenModeOutput({
  token0ParsedAmount,
  token1ParsedAmount
}: PanelAddLiquidityOneTokenModeOutputProps) {
  const theme = useTheme()
  const isUpToExtraSmall = useIsUpToExtraSmall()

  const currency0 = token0ParsedAmount?.token && unwrappedToken(token0ParsedAmount.token)
  const currency1 = token1ParsedAmount?.token && unwrappedToken(token1ParsedAmount.token)

  const amount0 = token0ParsedAmount?.toSignificant(6) ?? ''
  const amount1 = token1ParsedAmount?.toSignificant(6) ?? ''

  return (
    <PanelWrapper>
      <TextPanelLabel>To</TextPanelLabel>
      <OutputCurrency currency={currency0} amount={amount0} />
      <IconWrapper clickable={false}>
        <Plus size={isUpToExtraSmall ? '14' : '22'} color={theme.text1Sone} />
      </IconWrapper>
      <OutputCurrency currency={currency1} amount={amount1} />
    </PanelWrapper>
  )
}
