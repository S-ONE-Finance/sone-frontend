import { Token, TokenAmount } from '@s-one-finance/sdk-core'
import React from 'react'
import { Plus } from 'react-feather'
import { Text } from 'rebass'
import { unwrappedToken } from 'utils/wrappedCurrency'
import { AutoColumn } from '../../../components/Column'
import CurrencyLogo from '../../../components/CurrencyLogo'
import { RowBetween, RowFixed } from '../../../components/Row'
import { TruncatedText } from '../../../components/swap/styleds'
import { useIsUpToExtraSmall } from '../../../hooks/useWindowSize'
import { useUserSlippageTolerance } from '../../../state/user/hooks'
import { TYPE } from '../../../theme'

export default function ModalHeader({
  token0ParsedAmount,
  token1ParsedAmount,
  token0,
  token1
}: {
  token0ParsedAmount?: TokenAmount
  token1ParsedAmount?: TokenAmount
  token0?: Token
  token1?: Token
}) {
  const isUpToExtraSmall = useIsUpToExtraSmall()

  const [allowedSlippage] = useUserSlippageTolerance() // custom from users

  const currency0 = token0 && unwrappedToken(token0)
  const currency1 = token1 && unwrappedToken(token1)

  return (
    <AutoColumn gap={isUpToExtraSmall ? '10px' : '15px'} style={{ marginTop: '20px' }}>
      <RowBetween align="flex-end">
        <RowFixed gap="0">
          <TruncatedText fontSize={isUpToExtraSmall ? '20px' : '28px'} fontWeight={600}>
            {token0ParsedAmount?.toSignificant(6)}
          </TruncatedText>
        </RowFixed>
        {/* zIndex để hiển thị đè lên SwapVector. */}
        <RowFixed gap="0" style={{ height: '100%', zIndex: 1 }} align="center">
          <CurrencyLogo currency={currency0} size="24px" style={{ marginRight: '5px' }} />
          <Text fontSize={isUpToExtraSmall ? 16 : 24} fontWeight={500}>
            {currency0?.symbol}
          </Text>
        </RowFixed>
      </RowBetween>
      <RowFixed>
        <Plus size="20" style={{ minWidth: '16px' }} />
      </RowFixed>
      <RowBetween align="flex-end">
        <RowFixed gap="0">
          <TruncatedText fontSize={isUpToExtraSmall ? '20px' : '28px'} fontWeight={600}>
            {token1ParsedAmount?.toSignificant(6)}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap="0" style={{ height: '100%' }} align="center">
          <CurrencyLogo currency={currency1} size="24px" style={{ marginRight: '5px' }} />
          <Text fontSize={isUpToExtraSmall ? 16 : 24} fontWeight={500}>
            {currency1?.symbol}
          </Text>
        </RowFixed>
      </RowBetween>
      <AutoColumn justify="flex-start" gap="sm">
        <TYPE.italic textAlign="left" style={{ width: '100%' }}>
          {'Output is estimated. If the price changes by more than '}
          <b>{allowedSlippage / 100 + '%'}</b>
          {' your transaction will revert.'}
        </TYPE.italic>
      </AutoColumn>
    </AutoColumn>
  )
}
