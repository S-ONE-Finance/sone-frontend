import React from 'react'
import LogoToken from '../../assets/images/logo_token_sone.svg'
import { TYPE } from '../../theme'
import { CountUp } from 'use-count-up'
import styled from 'styled-components'
import { TokenAmount } from '@s-one-finance/sdk-core'
import { useAggregateUniBalance } from '../../state/wallet/hooks'
import usePrevious from '../../hooks/usePrevious'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  //height: 37px;
  font-weight: 400;
  color: ${({ theme }) => theme.red1Sone};
  background: transparent;
`

export default function SoneAmount({ isSmall = false }: { isSmall?: boolean }) {
  const aggregateBalance: TokenAmount | undefined = useAggregateUniBalance()
  const countUpValue = aggregateBalance?.toFixed(0) ?? '0'
  const countUpValuePrevious = usePrevious(countUpValue) ?? '0'
  return aggregateBalance ? (
    <Wrapper style={{ pointerEvents: 'auto' }}>
      <img width={isSmall ? '18px' : '21px'} src={LogoToken} alt="logo" />
      <TYPE.red1Sone style={{ marginLeft: '5px', fontSize: isSmall ? '16px' : '18px' }}>
        <CountUp
          key={countUpValue}
          isCounting
          start={parseFloat(countUpValuePrevious)}
          end={parseFloat(countUpValue)}
          thousandsSeparator={','}
          duration={1}
        />
      </TYPE.red1Sone>
    </Wrapper>
  ) : null
}
