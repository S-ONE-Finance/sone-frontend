import React from 'react'
import styled from 'styled-components'
import { ReactComponent as LogoForMobileResponsive } from '../../assets/images/logo_for_mobile_responsive.svg'
import LoaderSone from '../LoaderSone'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import Row from '../Row'
import useNoPendingTxs from '../../hooks/useNoPendingTxs'

const LogoResponsive = styled(LogoForMobileResponsive)`
  width: 140px;
  height: 20px;
`

const LoaderSoneWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`

export default function LogoWithPendingAmount() {
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const noPendingTxs = useNoPendingTxs()

  if (isUpToExtraSmall) {
    return (
      <Row align="center" justify="center" style={{ height: '32px', marginBottom: '20px', position: 'relative' }}>
        <LogoResponsive />
        {noPendingTxs && (
          <LoaderSoneWrapper>
            <LoaderSone size="32px" style={{ position: 'relative' }} valueInside={noPendingTxs} />
          </LoaderSoneWrapper>
        )}
      </Row>
    )
  }

  return null
}
