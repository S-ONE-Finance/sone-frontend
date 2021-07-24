import React from 'react'
import styled from 'styled-components'
import { ReactComponent as LogoForMobileResponsive } from '../../assets/images/logo_for_mobile_responsive.svg'
import Row from '../Row'

const RowMobileOnly = styled(Row)`
  display: none;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: flex;
    height: 2rem;
    position: relative;
  `}
`

const LogoResponsive = styled(LogoForMobileResponsive)`
  width: 140px;
  height: 20px;
`

export default function BrandIdentitySoneForMobile() {
  return (
    <RowMobileOnly align="center" justify="center">
      <LogoResponsive />
    </RowMobileOnly>
  )
}
