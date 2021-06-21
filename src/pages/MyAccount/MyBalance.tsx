import { AutoColumn } from '../../components/Column'
import Row from '../../components/Row'
import CurrencyLogo from '../../components/CurrencyLogo'
import React from 'react'
import styled from 'styled-components'
import { ReactComponent as SoneBigImageSvg } from '../../assets/images/my-account-balance.svg'
import { Card } from './components'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import { Currency } from '@s-one-finance/sdk-core'
import { useAggregateUniBalance, useCurrencyBalance } from '../../state/wallet/hooks'
import { getFormatNumber } from '../../subgraph/utils/formatter'
import { MouseoverTooltip } from '../../components/Tooltip'
import { useActiveWeb3React } from '../../hooks'

const Heading = styled.h2`
  justify-self: flex-start;
  font-size: 40px;
  font-weight: 700;
  color: ${({ theme }) => theme.text6Sone};
  margin: 0;
  padding: 0;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 16px;    
  `}
`

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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

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

const SoneBigImage = styled(SoneBigImageSvg)`
  width: 136.62px;
  height: auto;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 71px;
  `}
`

export default function MyBalance() {
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const { account } = useActiveWeb3React()

  const soneBalance: string | undefined = useAggregateUniBalance()?.toFixed(2)
  const formattedSoneBalance =
    (isUpToExtraSmall ? getFormatNumber(soneBalance ? +soneBalance : 0, 2) : soneBalance) ?? '--'

  const ethBalance = useCurrencyBalance(account ?? undefined, Currency.ETHER)?.toFixed(6)

  return (
    <AutoColumn gap={isUpToExtraSmall ? '10px' : '2rem'} justify="center">
      <Heading style={{ marginTop: isUpToExtraSmall ? '0' : '30px' }}>My Balance</Heading>
      <CardBalance>
        <Row>
          <AutoColumn gap={isUpToExtraSmall ? '10px' : '20px'} style={{ flexGrow: 1 }}>
            <TextBalance>Your Available Balance</TextBalance>
            <Row align="baseline">
              <CurrencyLogo address="SONE" size="45px" sizeMobile="29px" style={{ alignSelf: 'center' }} />
              <MouseoverTooltip text={soneBalance ?? '--'}>
                <TextBalanceAmount>{formattedSoneBalance}</TextBalanceAmount>
              </MouseoverTooltip>

              <TextBalanceSymbol>SONE</TextBalanceSymbol>
            </Row>
            <Row align="baseline">
              <CurrencyLogo currency={Currency.ETHER} size="45px" sizeMobile="29px" style={{ alignSelf: 'center' }} />
              <MouseoverTooltip text={ethBalance ?? '--'}>
                <TextBalanceAmount>{ethBalance}</TextBalanceAmount>
              </MouseoverTooltip>
              <TextBalanceSymbol>ETH</TextBalanceSymbol>
            </Row>
          </AutoColumn>
          <SoneBigImage />
        </Row>
      </CardBalance>
    </AutoColumn>
  )
}
