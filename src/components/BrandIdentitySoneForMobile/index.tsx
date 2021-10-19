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
    margin-top: 1.25rem;
  `}
`

const LogoResponsive = styled(LogoForMobileResponsive)`
  width: 8.75rem; // 140px.
  height: 1.25rem; // 20px.
`

export default function BrandIdentitySoneForMobile() {
  return (
    <RowMobileOnly align="center" justify="center">
      <LogoResponsive />
    </RowMobileOnly>
  )
}
