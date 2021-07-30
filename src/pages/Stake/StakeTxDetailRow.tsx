import React from 'react'
import { RowBetween, RowFixed } from '../../components/Row'
import { QuestionHelper1416 } from '../../components/QuestionHelper'
import useTheme from '../../hooks/useTheme'
import { TextDetailsValue, TextDetailsField } from 'pages/Unstake/UnstakeTxDetailRow'

type StakeTxDetailsProps = {
  fieldName: string
  // Question helper text.
  qhText: string
  value: string
  unit: string
  valueColorPrimary?: boolean
}

export default function StakeTxDetailRow({ fieldName, qhText, value, unit, valueColorPrimary }: StakeTxDetailsProps) {
  const theme = useTheme()
  const color = valueColorPrimary ? theme.text5Sone : undefined
  const unitFontSize = valueColorPrimary ? 'unset' : 13

  return (
    <RowBetween>
      <RowFixed>
        <TextDetailsField>{fieldName}</TextDetailsField>
        <QuestionHelper1416 text={qhText} color={theme.text4Sone} />
      </RowFixed>
      <RowFixed align="baseline">
        <TextDetailsValue color={color}>{value}</TextDetailsValue>
        <TextDetailsValue fontSize={unitFontSize} color={color} marginLeft={unit === '%' ? '0' : '0.25rem'}>
          {unit}
        </TextDetailsValue>
      </RowFixed>
    </RowBetween>
  )
}
