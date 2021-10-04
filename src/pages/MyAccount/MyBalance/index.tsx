import React, { forwardRef, ReactNode, useRef } from 'react'
import { Currency } from '@s-one-finance/sdk-core'
import { CountUp } from 'use-count-up'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import Row from '../../../components/Row'
import CurrencyLogo from '../../../components/CurrencyLogo'
import { Card, Heading, Section } from '../components'
import { useAggregateSoneBalance, useCurrencyBalance } from '../../../state/wallet/hooks'
import { MouseoverTooltip } from '../../../components/Tooltip'
import { useActiveWeb3React } from '../../../hooks'
import usePrevious from '../../../hooks/usePrevious'
import SoneBigImage from './SoneBigImage'
import { lighten } from 'polished'
import useSoneLockBalance from '../../../hooks/staking/useSoneLockBalance'
import { formatSONE } from 'utils/formatNumber'
import useUnlockHandler from 'hooks/staking/useUnlockHandler'
import { useIsUpToExtraSmall } from '../../../hooks/useWindowSize'
import Column from '../../../components/Column'

const CardBalance = styled(Card)`
  flex-direction: column;
  padding: 51px 99px;
  border-radius: 40px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 51px 39px;
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 20px 32px;
    border-radius: 25px;
  `}
`

const TextBalance = styled.div`
  font-size: 20px;
  font-weight: 400;
  color: ${({ theme }) => theme.text6Sone};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;
  `}
`

const TextBalanceAmount = styled.div`
  font-size: 40px;
  font-weight: 700;
  color: ${({ theme }) => theme.text5Sone};
  margin-left: 20px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 30px;
    margin-left: 6px;
  `}
`

const TextBalanceSymbol = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.text6Sone};
  margin-left: 8px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 16px;
    margin-left: 3px;
  `}
`

const BalanceSection = styled.div`
  display: grid;
  grid-auto-rows: auto;
  grid-row-gap: 20px;
  flex-grow: 1;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    grid-row-gap: 10px;
  `}
`

const RowBaseLine = styled(Row)`
  align-items: baseline;
`

const TextUnlockTitle = styled.div`
  color: ${({ theme }) => theme.text6Sone};
  font-size: 20px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;
  `}
`

const TextUnlockValue = styled.div`
  color: ${({ theme }) => theme.text4Sone};
  font-size: 20px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;
  `}
`

const TextUnlockButton = styled.div`
  color: ${({ theme }) => theme.text5Sone};
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;

  :hover {
    color: ${({ theme }) => `${lighten(0.05, theme.text5Sone)}`};
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;
  `}
`

function SoneLogo() {
  return <CurrencyLogo address="SONE" size="45px" sizeMobile="29px" style={{ alignSelf: 'center' }} />
}

function EthLogo() {
  return <CurrencyLogo currency={Currency.ETHER} size="45px" sizeMobile="29px" style={{ alignSelf: 'center' }} />
}

const BalanceCountUp = forwardRef<HTMLDivElement, { balance: string | undefined }>(function BalanceCountUp(
  { balance },
  ref
) {
  const formattedBalance = balance === undefined ? 0 : +balance
  const prevFormattedBalance = usePrevious(formattedBalance)
  const prevFormattedBalanceReset = prevFormattedBalance === formattedBalance ? 0 : prevFormattedBalance
  return (
    <MouseoverTooltip text={balance ?? '--'}>
      <TextBalanceAmount ref={ref}>
        <CountUp
          autoResetKey={formattedBalance}
          isCounting
          start={prevFormattedBalanceReset}
          end={formattedBalance}
          thousandsSeparator={','}
          duration={1}
        />
      </TextBalanceAmount>
    </MouseoverTooltip>
  )
})

function RowColFlex({ children }: { children: ReactNode }) {
  const isUpToExtraSmall = useIsUpToExtraSmall()
  return isUpToExtraSmall ? (
    <Column gap="10px" style={{ marginTop: '20px' }}>
      {children}
    </Column>
  ) : (
    <Row gap="10px" marginTop="20px">
      {children}
    </Row>
  )
}

export default function MyBalance() {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()

  const soneBalanceTokenAmount = useAggregateSoneBalance()
  const soneBalance: string | undefined = formatSONE(soneBalanceTokenAmount, false, true)
  const ethBalance = useCurrencyBalance(account ?? undefined, Currency.ETHER)?.toSignificant(6)

  const ethBalanceRef = useRef<HTMLDivElement>(null)
  const soneBalanceRef = useRef<HTMLDivElement>(null)

  const { soneCanUnlock, totalSoneLocked } = useSoneLockBalance()
  const onUnlockSone = useUnlockHandler()

  const formattedSoneCanUnlock = formatSONE(soneCanUnlock.toString(), true, false) ?? '--'
  const formattedTotalSoneLocked = formatSONE(totalSoneLocked.toString(), true, false) ?? '--'
  const canUnlockValue = formattedSoneCanUnlock + '/' + formattedTotalSoneLocked + ' SONE'

  return (
    <Section>
      <Heading>{t('my_balance')}</Heading>
      <CardBalance>
        <Row>
          <BalanceSection>
            <TextBalance>{t('your_available_balance')}</TextBalance>
            <RowBaseLine>
              <SoneLogo />
              <BalanceCountUp balance={soneBalance} ref={soneBalanceRef} />
              <TextBalanceSymbol>{t('SONE')}</TextBalanceSymbol>
            </RowBaseLine>
            <RowBaseLine>
              <EthLogo />
              <BalanceCountUp balance={ethBalance} ref={ethBalanceRef} />
              <TextBalanceSymbol>{t('ETH')}</TextBalanceSymbol>
            </RowBaseLine>
          </BalanceSection>
          <SoneBigImage ethBalanceRef={ethBalanceRef} soneBalanceRef={soneBalanceRef} />
        </Row>
        <RowColFlex>
          <TextUnlockTitle>{t('can_unlock')}:</TextUnlockTitle>
          <TextUnlockValue>{canUnlockValue}</TextUnlockValue>
          <TextUnlockButton onClick={() => onUnlockSone(formattedSoneCanUnlock)}>{t('unlock')}</TextUnlockButton>
        </RowColFlex>
      </CardBalance>
    </Section>
  )
}
