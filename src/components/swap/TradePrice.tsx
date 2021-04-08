import React, { useContext } from 'react'
import { Price } from '@s-one-finance/sdk-core'
import { Repeat } from 'react-feather'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { StyledBalanceMaxMini } from './styleds'
import Row from '../Row'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'

interface TradePriceProps {
  price?: Price
  showInverted: boolean
  setShowInverted: (showInverted: boolean) => void
}

export default function TradePrice({ price, showInverted, setShowInverted }: TradePriceProps) {
  const isUpToExtraSmall = useIsUpToExtraSmall()

  const theme = useContext(ThemeContext)

  const formattedPrice = showInverted ? price?.toSignificant(6) : price?.invert()?.toSignificant(6)

  const show = Boolean(price?.baseCurrency && price?.quoteCurrency)

  const componentPrice = showInverted ? (
    <Row align={'baseline'} style={{ whiteSpace: 'break-spaces' }}>
      1 <Text fontSize={13}>{price?.baseCurrency?.symbol}</Text> = {formattedPrice ?? '-'}{' '}
      <Text fontSize={13}>{price?.quoteCurrency?.symbol}</Text>
    </Row>
  ) : (
    <Row align={'baseline'} style={{ whiteSpace: 'break-spaces' }}>
      1 <Text fontSize={13}>{price?.quoteCurrency?.symbol}</Text> = {formattedPrice ?? '-'}{' '}
      <Text fontSize={13}>{price?.baseCurrency?.symbol}</Text>
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
            <Repeat size={14} />
          </StyledBalanceMaxMini>
          {componentPrice}
        </>
      ) : (
        '-'
      )}
    </Text>
  )
}
