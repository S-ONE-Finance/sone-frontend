import React, { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { ExternalLink, HideLarge, TYPE } from '../../theme'

import { useBlockNumber } from '../../state/application/hooks'
import { getEtherscanLink } from '../../utils'
import { useActiveWeb3React } from '../../hooks'

const StyledPolling = styled.div`
  position: fixed;
  display: flex;
  right: 0;
  bottom: 45px; // Equals footer's height.
  padding: 1rem;
  transition: opacity 0.25s ease;
  color: ${({ theme }) => theme.green1};
  :hover {
    opacity: 1;
  }
`
const StyledPollingDot = styled.div`
  width: 19px;
  height: 19px;
  min-height: 19px;
  min-width: 19px;
  margin-left: 10px;
  border-radius: 50%;
  position: relative;
  background-color: ${({ theme }) => theme.green1Sone};
`

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const Spinner = styled.div`
  animation: ${rotate360} 1.5s cubic-bezier(0.83, 0, 0.17, 1) infinite;
  transform: translateZ(0);

  border-top: 3px solid transparent;
  border-right: 3px solid transparent;
  border-bottom: 3px solid transparent;
  border-left: 3px solid ${({ theme }) => theme.green1};
  background: transparent;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  position: relative;
  left: -4.75px;
  top: -4.75px;
`

export default function Polling() {
  const { chainId } = useActiveWeb3React()

  const blockNumber = useBlockNumber()

  const [isMounted, setIsMounted] = useState(true)

  useEffect(
    () => {
      const timer1 = setTimeout(() => setIsMounted(true), 1000)

      // this will clear Timeout when component unmount like in willComponentUnmount
      return () => {
        setIsMounted(false)
        clearTimeout(timer1)
      }
    },
    [blockNumber] //useEffect will run only one time
    //if you pass a value to array, like this [data] than clearTimeout will run every time this value changes (useEffect re-run)
  )

  return (
    <HideLarge>
      <ExternalLink href={chainId && blockNumber ? getEtherscanLink(chainId, blockNumber.toString(), 'block') : ''}>
        <StyledPolling>
          <TYPE.black fontSize={'16px'} style={{ opacity: isMounted ? '0.2' : '0.6' }}>
            {blockNumber}
          </TYPE.black>
          <StyledPollingDot style={{ opacity: isMounted ? '0.5' : '1' }}>{!isMounted && <Spinner />}</StyledPollingDot>
        </StyledPolling>
      </ExternalLink>
    </HideLarge>
  )
}
