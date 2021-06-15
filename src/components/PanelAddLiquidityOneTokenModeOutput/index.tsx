import React from 'react'
import styled from 'styled-components'

import { StyledTokenName, TextPanelLabel } from 'theme'
import { RowFixed, RowBetween } from 'components/Row'
import { AutoColumn } from 'components/Column'
import { useCurrency } from 'hooks/Tokens'
import { Currency, CurrencyAmount, Pair, TokenAmount } from '@s-one-finance/sdk-core'
import CurrencyLogo from 'components/CurrencyLogo'
import { Plus } from 'react-feather'
import useTheme from 'hooks/useTheme'
import { useIsUpToExtraSmall } from 'hooks/useWindowSize'
import { IconWrapper } from 'components/swap/styleds'
import { PairState } from 'data/Reserves'
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
  token0MintAmount?: TokenAmount
  token1MintAmount?: TokenAmount
}

export default function PanelAddLiquidityOneTokenModeOutput({
  token0MintAmount,
  token1MintAmount
}: PanelAddLiquidityOneTokenModeOutputProps) {
  const theme = useTheme()
  const isUpToExtraSmall = useIsUpToExtraSmall()

  const currency0 = token0MintAmount?.token && unwrappedToken(token0MintAmount.token)
  const currency1 = token1MintAmount?.token && unwrappedToken(token1MintAmount.token)

  const amount0 = token0MintAmount?.toSignificant(6)
  const amount1 = token1MintAmount?.toSignificant(6)

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
