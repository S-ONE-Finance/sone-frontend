import React from 'react'
import { RowFixed } from '../Row'
import { TYPE } from '../../theme'
import styled from 'styled-components'
import { ArrowDown, ArrowUp } from 'react-feather'

interface PairInfoProps {
  pairName: string
  changeAmount: number
  changePercentage: number
}

const PairInfoWrapper = styled(RowFixed)`
  align-items: center;
  height: 100%;
  width: max-content;
  padding: 0 45px;
`

export default function PairInfo({ pairName, changeAmount, changePercentage }: PairInfoProps) {
  return (
    <PairInfoWrapper>
      <TYPE.black>{pairName}</TYPE.black>
      <TYPE.subText fontWeight={500} marginLeft={'10px'}>
        {changeAmount}
      </TYPE.subText>
      {changePercentage > 0 ? (
        <TYPE.green1Sone fontWeight={400} marginLeft={'10px'} display={'flex'}>
          <ArrowUp size={19} />
          <span>+{changePercentage}%</span>
        </TYPE.green1Sone>
      ) : (
        <TYPE.red1Sone fontWeight={400} marginLeft={'10px'} display={'flex'}>
          <ArrowDown size={19} />−{changePercentage * -1}%
        </TYPE.red1Sone>
      )}
    </PairInfoWrapper>
  )
}
