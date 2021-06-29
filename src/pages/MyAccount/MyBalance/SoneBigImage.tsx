import React, { useEffect, useState } from 'react'
import { useActiveWeb3React } from '../../../hooks'
import { useAggregateSoneBalance, useCurrencyBalance } from '../../../state/wallet/hooks'
import { Currency } from '@s-one-finance/sdk-core'
import { useWindowSize } from '../../../hooks/useWindowSize'
import { StyledSoneBigImage } from './SoneBigImage.styled'

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

  return isShowBigImage ? <StyledSoneBigImage /> : null
}
