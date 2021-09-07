import styled from 'styled-components'
import { ExternalLink } from '../../theme'
import { darken } from 'polished'
import { Token } from '@s-one-finance/sdk-core'
import React from 'react'
import { S_ONE_STATISTICS_URL } from '../../constants/urls'
import { unwrappedToken } from '../../utils/wrappedCurrency'

const InfoLink = styled(ExternalLink)`
  width: fit-content;
  font-size: 16px;
  padding: 10px 2.1875rem;
  border-radius: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.text5Sone};
  background-color: ${({ theme }) => theme.f3f3f3};

  :hover,
  :active,
  :focus {
    outline: none;
    text-decoration: unset;
  }

  :hover {
    background-color: ${({ theme }) => darken(0.1, theme.f3f3f3)};
  }

  ::after {
    font-family: 'Inter var', sans-serif;
    content: ' ↗';
    font-size: 14px;
    margin-left: 0.25rem;
    margin-top: -0.25rem;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;
    padding: 6px 20px;
    border-radius: 20px;
  `}
`

export default function ViewPairAnalytics({
  pairAddress,
  tokenA,
  tokenB
}: {
  pairAddress?: string
  tokenA?: Token
  tokenB?: Token
}) {
  if (!pairAddress || !tokenA || !tokenB) return null

  return (
    <InfoLink href={S_ONE_STATISTICS_URL + '/#/swap/pair/' + pairAddress} target="_blank">
      View {unwrappedToken(tokenA).symbol}-{unwrappedToken(tokenB).symbol} analytics
    </InfoLink>
  )
}
