import React from 'react'
import { RowBetween, RowFixed } from '../../components/Row'
import { QuestionHelper1416 } from '../../components/QuestionHelper'
import styled from 'styled-components'
import { Text } from 'rebass'
import useTheme from '../../hooks/useTheme'

export const TextDetailsField = styled(Text)`
  font-weight: 400;
  font-size: 1rem;
  color: ${({ theme }) => theme.text4Sone};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;
  `}
`

export const TextDetailsValue = styled(Text)`
  font-weight: 700;
  font-size: 1rem;
  color: ${({ theme }) => theme.text6Sone};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;
  `}
`

type UnstakeTxDetailsProps = {
  fieldName: string
  qhText: string
  value: string
  unit: string
}

export default function UnstakeTxDetailRow({ fieldName, qhText, value, unit }: UnstakeTxDetailsProps) {
  const theme = useTheme()

  return (
    <RowBetween>
      <RowFixed>
        <TextDetailsField>{fieldName}</TextDetailsField>
        <QuestionHelper1416 text={qhText} color={theme.text4Sone} />
      </RowFixed>
      <RowFixed align="baseline">
        <TextDetailsValue>{value}</TextDetailsValue>
        <TextDetailsValue fontSize={13}>&nbsp;{unit}</TextDetailsValue>
      </RowFixed>
    </RowBetween>
  )
}
