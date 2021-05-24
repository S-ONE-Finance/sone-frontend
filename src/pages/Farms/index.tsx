import React from 'react'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { IsRopsten } from '../../utils'
import Balances from './components/Balances'
import { START_REWARD_AT_BLOCK } from '../../config'
import FarmCards from './components/FarmCards'
import TotalLockValue from './components/TotalLockValue'

export default function Farms() {
  const { chainId } = useActiveWeb3React()
  const ID = chainId === 3 ? 3 : 1
  const isRopsten = IsRopsten(chainId)
  const block = 99999999999
  const launchBlock = START_REWARD_AT_BLOCK[ID]
  return (
    <>
      <div>
        {!isRopsten ? (
          <div style={{ fontWeight: 'bold', fontSize: 22, color: '#ffffff', textAlign: 'center' }}>
            LuaSwap Currently Has{' '}
            <span style={{ color: '#4caf50', fontSize: 30 }}>
              $<TotalLockValue />
            </span>{' '}
            Of Total Locked Value
          </div>) : ''
        }
        {block >= launchBlock && (
          <>
            <Balances />
          </>
        )}
      </div>
      <Box className="mt-4">
        <StyledHeading>SELECT YOUR FIELDS</StyledHeading>
        <StyledParagraph>Earn LUA tokens by staking LUA-V1 LP token</StyledParagraph>
        <FarmCards />
      </Box>
    </>
  )
}

const StyledHeading = styled.h2`
  color: ${({ theme }) => theme.white};
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 0;
  margin-top: 0;
`
const StyledParagraph = styled.p`
  text-align: center;
  margin-top: 10px;
`
const Box = styled.div`
  &.mt-4 {
    margin-top: 40px;
    @media (max-width: 767px) {
      margin-top: 30px;
    }
  }
`