import Row from '../../../components/Row'
import CurrencyLogo from '../../../components/CurrencyLogo'
import React, { forwardRef, useRef } from 'react'
import { Card, Heading } from '../components'
import { Currency } from '@s-one-finance/sdk-core'
import { useAggregateSoneBalance, useCurrencyBalance } from '../../../state/wallet/hooks'
import { MouseoverTooltip } from '../../../components/Tooltip'
import { useActiveWeb3React } from '../../../hooks'
import usePrevious from '../../../hooks/usePrevious'
import { CountUp } from 'use-count-up'
import SoneBigImage from './SoneBigImage'
import styled from 'styled-components'

const CardBalance = styled(Card)`
  padding: 51px 99px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 51px 39px;    
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 20px 32px;    
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

const MyBalanceWrapper = styled.div`
  display: grid;
  grid-auto-rows: auto;
  grid-row-gap: 2rem;
  justify-items: center;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    grid-row-gap: 10px;
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
