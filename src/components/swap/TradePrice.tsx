import React from 'react'
import { Price } from '@s-one-finance/sdk-core'
import { Repeat } from 'react-feather'
import { Text } from 'rebass'
import { StyledBalanceMaxMini } from './styleds'
import Row from '../Row'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import useTheme from '../../hooks/useTheme'

interface TradePriceProps {
  price?: Price
  showInverted: boolean
  setShowInverted: (showInverted: boolean) => void
}

export const RepeatIcon = () => {
  const theme = useTheme()

  return <Repeat size={14} style={{ stroke: theme.text5Sone, strokeWidth: 3 }} />
}

export default function TradePrice({ price, showInverted, setShowInverted }: TradePriceProps) {
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const theme = useTheme()

  const formattedPrice = showInverted ? price?.toSignificant(6) : price?.invert()?.toSignificant(6)
  const baseCurrencySymbol = price?.baseCurrency?.symbol === 'WETH' ? 'ETH' : price?.baseCurrency?.symbol
  const quoteCurrencySymbol = price?.quoteCurrency?.symbol === 'WETH' ? 'ETH' : price?.quoteCurrency?.symbol

  const show = Boolean(price?.baseCurrency && price?.quoteCurrency)

  const componentPrice = showInverted ? (
    <Row align={'baseline'} style={{ whiteSpace: 'break-spaces' }}>
      1 <Text fontSize={13}>{baseCurrencySymbol}</Text> = {formattedPrice ?? '-'}{' '}
      <Text fontSize={13}>{quoteCurrencySymbol}</Text>
    </Row>
  ) : (
    <Row align={'baseline'} style={{ whiteSpace: 'break-spaces' }}>
      1 <Text fontSize={13}>{quoteCurrencySymbol}</Text> = {formattedPrice ?? '-'}{' '}
      <Text fontSize={13}>{baseCurrencySymbol}</Text>
    </Row>
  )

  return (
    <Text
      fontWeight={700}
      fontSize={isUpToExtraSmall ? 13 : 16}
      color={theme.text6Sone}
      style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}
    >
      {show ? (
        <>
          <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
            <RepeatIcon />
          </StyledBalanceMaxMini>
          {componentPrice}
        </>
      ) : (
        '-'
      )}
    </Text>
  )
}
