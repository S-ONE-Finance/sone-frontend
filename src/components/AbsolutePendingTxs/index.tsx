import React from 'react'
import styled from 'styled-components'
import LoaderSone from '../LoaderSone'
import useNoPendingTxs from '../../hooks/useNoPendingTxs'

const LoaderSoneWrapper = styled.div`
  display: none;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    position: absolute;
    top: 1.25rem;
    right: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
  `}
`

export default function AbsolutePendingTxsForMobile() {
  const noPendingTxs = useNoPendingTxs()

  if (noPendingTxs) {
    return (
      <LoaderSoneWrapper>
        <LoaderSone size="2rem" style={{ position: 'relative' }} valueInside={noPendingTxs} />
      </LoaderSoneWrapper>
    )
  }

  return null
}
