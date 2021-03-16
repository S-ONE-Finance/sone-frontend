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
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0 12.5px;
  `};
`

const Text = {
  PairName: styled(TYPE.black)`
    ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 11px;
    `};
  `,
  ChangeAmount: styled(TYPE.black)`
    margin-left: 10px !important;
    ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 11px;
    margin-left: 5px !important;
    `};
  `,
  Up: styled(TYPE.green1Sone)`
    display: flex;
    align-items: center;
    font-weight: 400 !important;
    margin-left: 10px !important;
    ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 11px;
    margin-left: 5px !important;
    `};
  `,
  Down: styled(TYPE.red1Sone)`
    display: flex;
    align-items: center;
    font-weight: 400 !important;
    margin-left: 10px !important;
    ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 11px;
    margin-left: 5px !important;
    `};
  `
}

const ResponsiveArrowUp = styled(ArrowUp)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 15px;
    height: 15px;
  `};
`

const ResponsiveArrowDown = styled(ArrowDown)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 15px;
    height: 15px;
  `};
`

export default function PairInfo({ pairName, changeAmount, changePercentage }: PairInfoProps) {
  return (
    <PairInfoWrapper>
      <Text.PairName>{pairName}</Text.PairName>
      <Text.ChangeAmount>{changeAmount}</Text.ChangeAmount>
      {changePercentage > 0 ? (
        <Text.Up>
          <ResponsiveArrowUp size={19} />
          <span>+{changePercentage}%</span>
        </Text.Up>
      ) : (
        <Text.Down>
          <ResponsiveArrowDown size={19} />
          <span>−{changePercentage * -1}%</span>
        </Text.Down>
      )}
    </PairInfoWrapper>
  )
}
