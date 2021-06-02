import React from 'react'
import { RowBetween, RowFixed } from '../../components/Row'
import { TruncatedText } from '../../components/swap/styleds'
import { Field } from '../../state/mint/actions'
import CurrencyLogo from '../../components/CurrencyLogo'
import { Text } from 'rebass'
import { Plus } from 'react-feather'
import { AutoColumn } from '../../components/Column'
import { TYPE } from '../../theme'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import { useUserSlippageTolerance } from '../../state/user/hooks'
import { Currency, CurrencyAmount } from '@s-one-finance/sdk-core'

export default function AddLiquidityConfirmationModalHeader({
  parsedAmounts,
  currencies
}: {
  currencies: { [field in Field]?: Currency }
  parsedAmounts: { [field in Field]?: CurrencyAmount }
}) {
  const isUpToExtraSmall = useIsUpToExtraSmall()

  const [allowedSlippage] = useUserSlippageTolerance() // custom from users

  return (
    <AutoColumn gap={isUpToExtraSmall ? '10px' : '15px'} style={{ marginTop: '20px' }}>
      <RowBetween align="flex-end">
        <RowFixed gap="0">
          <TruncatedText fontSize={isUpToExtraSmall ? '20px' : '28px'} fontWeight={600}>
            {parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}
          </TruncatedText>
        </RowFixed>
        {/* zIndex để hiển thị đè lên SwapVector. */}
        <RowFixed gap="0" style={{ height: '100%', zIndex: 1 }} align="center">
          <CurrencyLogo currency={currencies[Field.CURRENCY_A]} size="24px" style={{ marginRight: '5px' }} />
          <Text fontSize={isUpToExtraSmall ? 16 : 24} fontWeight={500}>
            {currencies[Field.CURRENCY_A]?.symbol}
          </Text>
        </RowFixed>
      </RowBetween>
      <RowFixed>
        <Plus size="20" style={{ minWidth: '16px' }} />
      </RowFixed>
      <RowBetween align="flex-end">
        <RowFixed gap="0">
          <TruncatedText fontSize={isUpToExtraSmall ? '20px' : '28px'} fontWeight={600}>
            {parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap="0" style={{ height: '100%' }} align="center">
          <CurrencyLogo currency={currencies[Field.CURRENCY_B]} size="24px" style={{ marginRight: '5px' }} />
          <Text fontSize={isUpToExtraSmall ? 16 : 24} fontWeight={500}>
            {currencies[Field.CURRENCY_B]?.symbol}
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
