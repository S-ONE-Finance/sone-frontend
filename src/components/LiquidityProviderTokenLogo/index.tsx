/* eslint @typescript-eslint/no-unused-vars: 0 */ // --> OFF

import React from 'react'
import LpTokenSrc from '../../assets/svg/lp_token.svg'
import { ReactComponent as LpToken } from '../../assets/svg/lp_token.svg'
import LpTokenRedSrc from '../../assets/svg/lp_token_red.svg'
import { ReactComponent as LpTokenRed } from '../../assets/svg/lp_token_red.svg'
import CurrencyLogo from '../CurrencyLogo'
import styled from 'styled-components'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'

const LiquidityProviderTokenLogoWrapper = styled.div<{ size: number; sizeMobile: number }>`
  position: relative;
  width: ${({ size }) => size + 'px'};
  height: ${({ size }) => size * 1.09 + 'px'};

  ${({ theme, sizeMobile }) => theme.mediaWidth.upToExtraSmall`
    width: ${sizeMobile + 'px'};
    height: ${sizeMobile * 1.09 + 'px'};
  `}
`

const CurrencyLeft = styled.div<{ size: number; sizeMobile: number }>`
  position: absolute;
  top: 0;
  left: ${({ size }) => size * 0.2 + 'px'};
  width: ${({ size }) => size + 'px'};
  height: ${({ size }) => size + 'px'};
  z-index: 1;

  ${({ theme, sizeMobile }) => theme.mediaWidth.upToExtraSmall`
    left: ${sizeMobile * 0.2 + 'px'};
    width: ${sizeMobile + 'px'};
    height: ${sizeMobile + 'px'};
  `}
`

const CurrencyRight = styled.div<{ size: number; sizeMobile: number }>`
  position: absolute;
  top: 0;
  right: ${({ size }) => size * 0.2 + 'px'};
  width: ${({ size }) => size + 'px'};
  height: ${({ size }) => size + 'px'};
  z-index: 1;

  ${({ theme, sizeMobile }) => theme.mediaWidth.upToExtraSmall`
    right: ${sizeMobile * 0.2 + 'px'};
    width: ${sizeMobile + 'px'};
    height: ${sizeMobile + 'px'};
  `}
`

type LiquidityProviderTokenLogoProps = {
  address0?: string
  address1?: string
  size?: number
  sizeMobile?: number
  main?: boolean
  style?: React.CSSProperties
}

export default function LiquidityProviderTokenLogo({
  address0,
  address1,
  size = 440,
  sizeMobile = 28,
  main = true,
  style
}: LiquidityProviderTokenLogoProps) {
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const currencySize = size * 0.45
  const currencySizeMobile = sizeMobile * 0.45
  const lpTokenStyle: React.CSSProperties = {
    width: isUpToExtraSmall ? sizeMobile : size + 'px',
    minWidth: isUpToExtraSmall ? sizeMobile : size + 'px',
    height: 'auto',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 3
  }

  return (
    <LiquidityProviderTokenLogoWrapper size={size} sizeMobile={sizeMobile} style={style}>
      <CurrencyLeft size={currencySize} sizeMobile={currencySizeMobile}>
        <CurrencyLogo
          address={address0}
          size={currencySize + 'px'}
          sizeMobile={currencySizeMobile + 'px'}
          style={{ position: 'absolute' }}
        />
      </CurrencyLeft>
      <CurrencyRight size={currencySize} sizeMobile={currencySizeMobile}>
        <CurrencyLogo
          address={address1}
          size={currencySize + 'px'}
          sizeMobile={currencySizeMobile + 'px'}
          style={{ position: 'absolute' }}
        />
      </CurrencyRight>
      {main ? <LpTokenRed style={lpTokenStyle} /> : <LpToken style={lpTokenStyle} />}
      {/* Backup cho trường hợp render svg bị lỗi or something. */}
      {/*<img*/}
      {/*  src={main ? LpTokenRedSrc : LpTokenSrc}*/}
      {/*  alt="lp-token"*/}
      {/*  width={isUpToExtraSmall ? sizeMobile : size + 'px'}*/}
      {/*  style={{ position: 'absolute', top: 0, left: 0, zIndex: 3 }}*/}
      {/*/>*/}
    </LiquidityProviderTokenLogoWrapper>
  )
}
