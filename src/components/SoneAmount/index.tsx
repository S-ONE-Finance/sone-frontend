import React from 'react'
import LogoToken from '../../assets/images/logo_token_sone.svg'
import { TYPE } from '../../theme'
import { CountUp } from 'use-count-up'
import styled from 'styled-components'
import { TokenAmount } from '@s-one-finance/sdk-core'
import { useAggregateSoneBalance } from '../../state/wallet/hooks'
import usePrevious from '../../hooks/usePrevious'
import { formatSONE } from '../../utils/formatNumber'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  //height: 37px;
  font-weight: 400;
  color: ${({ theme }) => theme.red1Sone};
  background: transparent;
`

export default function SoneAmount({ isSmall = false }: { isSmall?: boolean }) {
  const aggregateBalance: TokenAmount | undefined = useAggregateSoneBalance()
  const countUpValue = formatSONE(aggregateBalance, false, false) ?? '0'
  const countUpValuePrevious = usePrevious(countUpValue) ?? '0'

  return (
    <Wrapper style={{ pointerEvents: 'auto' }}>
      <img width={isSmall ? '18px' : '21px'} src={LogoToken} alt="logo" />
      <TYPE.red1Sone style={{ marginLeft: '5px', fontSize: isSmall ? '16px' : '18px' }}>
        <CountUp
          autoResetKey={countUpValue}
          isCounting
          start={+countUpValuePrevious}
          end={+countUpValue}
          thousandsSeparator={','}
          duration={1}
        />
      </TYPE.red1Sone>
    </Wrapper>
  )
}
