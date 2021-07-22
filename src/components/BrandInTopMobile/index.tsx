import React from 'react'
import styled from 'styled-components'
import { ReactComponent as LogoForMobileResponsive } from '../../assets/images/logo_for_mobile_responsive.svg'
import Row from '../Row'

const LogoResponsive = styled(LogoForMobileResponsive)`
  width: 140px;
  height: 20px;
`

export default function BrandIdentitySone() {
  return (
    <Row align="center" justify="center" style={{ height: '2rem', position: 'relative' }}>
      <LogoResponsive />
    </Row>
  )
}
