import React, { useEffect, useState } from 'react'
import { useActiveWeb3React } from '../../../hooks'
import { useAggregateSoneBalance, useCurrencyBalance } from '../../../state/wallet/hooks'
import { Currency } from '@s-one-finance/sdk-core'
import { useWindowSize } from '../../../hooks/useWindowSize'
import styled from 'styled-components'
import SoneBigImageSvg from '../../../assets/images/my-account-balance.svg'

export const StyledSoneBigImage = styled.img`
  width: 136.62px;
  min-width: 136.62px;
  height: auto;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 71px;
    min-width: 71px;
  `}
`

export default function SoneBigImage({
  ethBalanceRef,
  soneBalanceRef
}: {
  ethBalanceRef: React.RefObject<HTMLDivElement>
  soneBalanceRef: React.RefObject<HTMLDivElement>
}) {
  const { account } = useActiveWeb3React()
  const soneBalance = useAggregateSoneBalance()
  const ethBalance = useCurrencyBalance(account ?? undefined, Currency.ETHER)?.toFixed(6)
  const [isShowBigImage, setShowBigImage] = useState(false)
  const { width: windowWidth } = useWindowSize()

  useEffect(() => {
    setShowBigImage(
      !!(
        ethBalanceRef?.current &&
        soneBalanceRef?.current &&
        windowWidth &&
        soneBalance !== undefined &&
        ethBalance !== undefined &&
        ethBalanceRef.current.offsetWidth < windowWidth * 0.4 &&
        soneBalanceRef.current.offsetWidth < windowWidth * 0.4
      )
    )
  }, [soneBalance, ethBalance, windowWidth, ethBalanceRef, soneBalanceRef])

  return isShowBigImage ? <StyledSoneBigImage src={SoneBigImageSvg} alt="StyledSoneBigImage" /> : null
}
