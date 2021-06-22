import { AutoColumn } from '../../components/Column'
import Row from '../../components/Row'
import CurrencyLogo from '../../components/CurrencyLogo'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { ReactComponent as SoneBigImageSvg } from '../../assets/images/my-account-balance.svg'
import { Card, Heading } from './components'
import { useIsUpToExtraSmall, useWindowSize } from '../../hooks/useWindowSize'
import { Currency } from '@s-one-finance/sdk-core'
import { useAggregateSoneBalance, useCurrencyBalance } from '../../state/wallet/hooks'
import { MouseoverTooltip } from '../../components/Tooltip'
import { useActiveWeb3React } from '../../hooks'
import usePrevious from '../../hooks/usePrevious'
import { CountUp } from 'use-count-up'

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

const SoneBigImage = styled(SoneBigImageSvg)`
  width: 136.62px;
  min-width: 136.62px;
  height: auto;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 71px;
    min-width: 71px;
  `}
`

function SoneLogo() {
  return <CurrencyLogo address="SONE" size="45px" sizeMobile="29px" style={{ alignSelf: 'center' }} />
}

function EthLogo() {
  return <CurrencyLogo currency={Currency.ETHER} size="45px" sizeMobile="29px" style={{ alignSelf: 'center' }} />
}

export default function MyBalance() {
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const { account } = useActiveWeb3React()

  const soneBalance: string | undefined = useAggregateSoneBalance()?.toFixed(2)
  const formattedSoneBalance = soneBalance === undefined ? 0 : +soneBalance
  const prevFormattedSoneBalance = usePrevious(formattedSoneBalance)

  const ethBalance = useCurrencyBalance(account ?? undefined, Currency.ETHER)?.toFixed(6)
  const formattedEthBalance = ethBalance === undefined ? 0 : +ethBalance
  const prevFormattedEthBalance = usePrevious(formattedEthBalance)

  //region Weather show big image or not
  // Khi ETH Balance hoặc SONE Balance đủ lớn (element width >= 40% window width)
  // sẽ ẩn big image để hiển thị được con số đầy đủ.
  const [isShowBigImage, setShowBigImage] = useState(false)
  const ethBalanceRef = useRef<HTMLDivElement>(null)
  const soneBalanceRef = useRef<HTMLDivElement>(null)
  const { width: windowWidth } = useWindowSize()

  useEffect(() => {
    setShowBigImage(
      !!(
        ethBalanceRef?.current &&
        soneBalanceRef?.current &&
        windowWidth &&
        ethBalanceRef.current.offsetWidth < windowWidth * 0.4 &&
        soneBalanceRef.current.offsetWidth < windowWidth * 0.4
      )
    )
  }, [soneBalance, ethBalance, windowWidth])
  //endregion

  // BUG: Đang bị bug nếu isShowBigImage === false thì CountUp không nhảy.
  return (
    <AutoColumn gap={isUpToExtraSmall ? '10px' : '2rem'} justify="center">
      <Heading>My Balance</Heading>
      <CardBalance>
        <Row>
          <AutoColumn gap={isUpToExtraSmall ? '10px' : '20px'} style={{ flexGrow: 1 }}>
            <TextBalance>Your Available Balance</TextBalance>
            <Row align="baseline">
              <SoneLogo />
              <MouseoverTooltip text={soneBalance ?? '--'}>
                <TextBalanceAmount ref={soneBalanceRef}>
                  <CountUp
                    autoResetKey={formattedSoneBalance}
                    isCounting
                    start={prevFormattedSoneBalance}
                    end={formattedSoneBalance}
                    thousandsSeparator={','}
                    duration={1}
                  />
                </TextBalanceAmount>
              </MouseoverTooltip>
              <TextBalanceSymbol>SONE</TextBalanceSymbol>
            </Row>
            <Row align="baseline">
              <EthLogo />
              <MouseoverTooltip text={ethBalance ?? '--'}>
                <TextBalanceAmount ref={ethBalanceRef}>
                  <CountUp
                    autoResetKey={formattedEthBalance}
                    isCounting
                    start={prevFormattedEthBalance}
                    end={formattedEthBalance}
                    thousandsSeparator={','}
                    duration={1}
                  />
                </TextBalanceAmount>
              </MouseoverTooltip>
              <TextBalanceSymbol>ETH</TextBalanceSymbol>
            </Row>
          </AutoColumn>
          {isShowBigImage && <SoneBigImage />}
        </Row>
      </CardBalance>
    </AutoColumn>
  )
}
