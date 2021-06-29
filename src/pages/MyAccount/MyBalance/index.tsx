import Row from '../../../components/Row'
import CurrencyLogo from '../../../components/CurrencyLogo'
import React, { forwardRef, useRef } from 'react'
import { Heading } from '../index.styled'
import { Currency } from '@s-one-finance/sdk-core'
import { useAggregateSoneBalance, useCurrencyBalance } from '../../../state/wallet/hooks'
import { MouseoverTooltip } from '../../../components/Tooltip'
import { useActiveWeb3React } from '../../../hooks'
import usePrevious from '../../../hooks/usePrevious'
import { CountUp } from 'use-count-up'
import {
  BalanceSection,
  CardBalance,
  MyBalanceWrapper,
  RowBaseLine,
  TextBalance,
  TextBalanceAmount,
  TextBalanceSymbol
} from './index.styled'
import SoneBigImage from './SoneBigImage'

function SoneLogo() {
  return <CurrencyLogo address="SONE" size="45px" sizeMobile="29px" style={{ alignSelf: 'center' }} />
}

function EthLogo() {
  return <CurrencyLogo currency={Currency.ETHER} size="45px" sizeMobile="29px" style={{ alignSelf: 'center' }} />
}

const BalanceCountUp = forwardRef<HTMLDivElement, { balance: string | undefined }>(({ balance }, ref) => {
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

export default function MyBalance() {
  const { account } = useActiveWeb3React()

  const soneBalance: string | undefined = useAggregateSoneBalance()?.toFixed(2)
  const ethBalance = useCurrencyBalance(account ?? undefined, Currency.ETHER)?.toFixed(6)

  const ethBalanceRef = useRef<HTMLDivElement>(null)
  const soneBalanceRef = useRef<HTMLDivElement>(null)

  return (
    <MyBalanceWrapper>
      <Heading>My Balance</Heading>
      <CardBalance>
        <Row>
          <BalanceSection>
            <TextBalance>Your Available Balance</TextBalance>
            <RowBaseLine>
              <SoneLogo />
              <BalanceCountUp balance={soneBalance} ref={soneBalanceRef} />
              <TextBalanceSymbol>SONE</TextBalanceSymbol>
            </RowBaseLine>
            <RowBaseLine>
              <EthLogo />
              <BalanceCountUp balance={ethBalance} ref={ethBalanceRef} />
              <TextBalanceSymbol>ETH</TextBalanceSymbol>
            </RowBaseLine>
          </BalanceSection>
          <SoneBigImage ethBalanceRef={ethBalanceRef} soneBalanceRef={soneBalanceRef} />
        </Row>
      </CardBalance>
    </MyBalanceWrapper>
  )
}
