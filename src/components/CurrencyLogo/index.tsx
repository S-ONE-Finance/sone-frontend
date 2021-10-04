import { Currency, ETHER, Token } from '@s-one-finance/sdk-core'
import React, { CSSProperties, useMemo } from 'react'
import styled from 'styled-components'

import EthereumLogo from '../../assets/images/ethereum-logo.png'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import Logo from '../Logo'
import SoneLogoSvg from '../../assets/images/logo_token_sone.svg'
import { useActiveWeb3React } from '../../hooks'
import useCurrencyIsSone from '../../hooks/useCurrencyIsSone'
import { SONE } from '../../constants'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'

export const getTokenLogoURL = (address: string) =>
  `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`

const StyledEthereumLogo = styled.img<{ size: string; sizeMobile: string }>`
  width: ${({ size }) => size};
  min-width: ${({ size }) => size};
  height: ${({ size }) => size};
  min-height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.075);

  ${({ theme, sizeMobile }) => theme.mediaWidth.upToExtraSmall`
    width: ${sizeMobile};
    min-width: ${sizeMobile};
  `};
`

const SoneLogo = styled.img<{ size: string; sizeMobile: string }>`
  width: ${({ size }) => size};
  min-width: ${({ size }) => size};
  height: auto;
  background: transparent;

  ${({ theme, sizeMobile }) => theme.mediaWidth.upToExtraSmall`
    width: ${sizeMobile};
    min-width: ${sizeMobile};
  `};
`

const SoneLogoBoundedWrapper = styled.div<{ size: string; sizeMobile: string }>`
  width: ${({ size }) => size};
  min-width: ${({ size }) => size};
  height: ${({ size }) => size};
  min-height: ${({ size }) => size};
  background-color: ${({ theme }) => theme.white};
  border-radius: 50%;
  position: relative;

  ${({ theme, sizeMobile }) => theme.mediaWidth.upToExtraSmall`
    height: ${sizeMobile};
    width: ${sizeMobile};
  `};

  // Đừng gộp cái này vào phía trên, không ăn css, chưa rõ lý do.
  ${({ theme, sizeMobile }) => theme.mediaWidth.upToExtraSmall`
    min-height: ${sizeMobile};
    min-width: ${sizeMobile};
  `};
`

const SoneLogoBounded = styled.img<{ size: number; sizeMobile: number }>`
  width: ${({ size }) => size * 0.75 + 'px'};
  min-width: ${({ size }) => size * 0.75 + 'px'};
  height: auto;
  background-color: transparent;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  ${({ theme, sizeMobile }) => theme.mediaWidth.upToExtraSmall`
    width: ${sizeMobile * 0.75 + 'px'};
    min-width: ${sizeMobile * 0.75 + 'px'};
  `};
`

export default function CurrencyLogo({
  currency,
  address,
  size = '24px',
  sizeMobile = '16px',
  style
}: {
  currency?: Currency
  address?: string
  size?: string
  sizeMobile?: string
  style?: CSSProperties
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)
  const { chainId } = useActiveWeb3React()
  const passedCurrencyIsSone = useCurrencyIsSone(currency)
  const isUpToExtraSmall = useIsUpToExtraSmall()

  const srcs: string[] = useMemo(() => {
    if (currency === ETHER) return []

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, getTokenLogoURL(currency.address)]
      }
      return [getTokenLogoURL(currency.address)]
    }
    return []
  }, [currency, uriLocations])

  // SONE.
  if (address && address.toLowerCase() === 'sone') {
    return <SoneLogo size={size} sizeMobile={sizeMobile} src={SoneLogoSvg} style={style} />
  }

  // SONE BOUNDED.
  if (
    (address &&
      (address.toLowerCase() === 'sone_bounded' ||
        (chainId && address.toLowerCase() === SONE[chainId].address.toLowerCase()))) ||
    (currency && passedCurrencyIsSone)
  ) {
    return (
      <SoneLogoBoundedWrapper size={size} sizeMobile={sizeMobile} style={style}>
        <SoneLogoBounded size={Number.parseInt(size)} sizeMobile={Number.parseInt(sizeMobile)} src={SoneLogoSvg} />
      </SoneLogoBoundedWrapper>
    )
  }

  // Nếu truyền vào address thì đơn giản return luôn.
  if (address) {
    return (
      <Logo
        size={size}
        sizeMobile={sizeMobile}
        srcs={[getTokenLogoURL(address)]}
        alt={`${currency?.symbol ?? 'token'} logo`}
        style={style}
      />
    )
  }

  if (currency === ETHER) {
    return (
      <StyledEthereumLogo
        src={EthereumLogo}
        size={isUpToExtraSmall ? sizeMobile : size}
        sizeMobile={sizeMobile}
        style={style}
      />
    )
  }

  return (
    <Logo size={size} sizeMobile={sizeMobile} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  )
}
