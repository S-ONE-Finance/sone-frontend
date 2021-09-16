import { Trade, TradeType } from '@s-one-finance/sdk-core'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { AlertTriangle, ArrowDown } from 'react-feather'
import { Text } from 'rebass'
import { TYPE } from '../../theme'
import { ButtonPrimary } from '../Button'
import { isAddress, shortenAddress } from '../../utils'
import { AutoColumn } from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import { RowBetween, RowFixed } from '../Row'
import { SwapShowAcceptChanges, TruncatedText } from './styleds'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import useTheme from '../../hooks/useTheme'

export default function SwapModalHeader({
  trade,
  allowedSlippage,
  recipient,
  showAcceptChanges,
  onAcceptChanges
}: {
  trade: Trade
  allowedSlippage: number
  recipient: string | null
  showAcceptChanges: boolean
  onAcceptChanges: () => void
}) {
  const { t } = useTranslation()
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const mobile20Desktop28 = isUpToExtraSmall ? 20 : 28

  const theme = useTheme()

  return (
    <AutoColumn gap={isUpToExtraSmall ? '10px' : '15px'} style={{ marginTop: '20px' }}>
      <RowBetween align="flex-end">
        <RowFixed gap="0">
          <TruncatedText
            fontSize={mobile20Desktop28}
            fontWeight={600}
            color={showAcceptChanges && trade.tradeType === TradeType.EXACT_OUTPUT ? theme.primary1 : ''}
          >
            {trade.inputAmount.toSignificant(6)}
          </TruncatedText>
        </RowFixed>
        {/* zIndex để hiển thị đè lên SwapVector. */}
        <RowFixed gap="0" style={{ height: '100%', zIndex: 1 }} align={'center'}>
          <CurrencyLogo currency={trade.inputAmount.currency} size="24px" style={{ marginRight: '5px' }} />
          <Text fontSize={isUpToExtraSmall ? 16 : 24} fontWeight={500}>
            {trade.inputAmount.currency.symbol}
          </Text>
        </RowFixed>
      </RowBetween>
      <RowFixed>
        <ArrowDown size="20" style={{ minWidth: '16px' }} />
      </RowFixed>
      <RowBetween align="flex-end">
        <RowFixed gap="0">
          <TruncatedText
            fontSize={mobile20Desktop28}
            fontWeight={600}
            color={showAcceptChanges && trade.tradeType === TradeType.EXACT_INPUT ? theme.primary1 : ''}
          >
            {trade.outputAmount.toSignificant(6)}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap="0" style={{ height: '100%' }} align={'center'}>
          <CurrencyLogo currency={trade.outputAmount.currency} size={'24px'} style={{ marginRight: '5px' }} />
          <Text fontSize={isUpToExtraSmall ? 16 : 24} fontWeight={500}>
            {trade.outputAmount.currency.symbol}
          </Text>
        </RowFixed>
      </RowBetween>
      {showAcceptChanges ? (
        <SwapShowAcceptChanges justify="flex-start" gap="0">
          <RowBetween>
            <RowFixed>
              <AlertTriangle size={20} style={{ marginRight: '8px', minWidth: 24 }} />
              <TYPE.main color={theme.primary1}> {t('Price Updated')}</TYPE.main>
            </RowFixed>
            <ButtonPrimary
              style={{ padding: '.5rem', width: 'fit-content', fontSize: '0.825rem', borderRadius: '12px' }}
              onClick={onAcceptChanges}
            >
              {t('Accept')}
            </ButtonPrimary>
          </RowBetween>
        </SwapShowAcceptChanges>
      ) : null}
      {recipient !== null ? (
        <AutoColumn justify="flex-start" gap="sm" style={{ padding: '12px 0 0 0px' }}>
          <TYPE.main>
            {t('Output will be sent to')}{' '}
            <b title={recipient}>{isAddress(recipient) ? shortenAddress(recipient) : recipient}</b>
          </TYPE.main>
        </AutoColumn>
      ) : null}
    </AutoColumn>
  )
}
