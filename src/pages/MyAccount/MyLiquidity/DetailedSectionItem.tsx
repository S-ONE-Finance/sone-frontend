import React from 'react'
import { Text } from 'rebass'

import useTheme from '../../../hooks/useTheme'
import { useIsUpToExtraSmall } from '../../../hooks/useWindowSize'
import { RowBetween, RowFitContent } from '../../../components/Row'
import { QuestionHelper1416 } from '../../../components/QuestionHelper'

export default function DetailedSectionItem({
  name,
  explain,
  value
}: {
  name: string
  explain: string
  value: string
}) {
  const theme = useTheme()
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const _13px16px = isUpToExtraSmall ? '13px' : '16px'

  return (
    <RowBetween>
      <RowFitContent gap="0.5rem">
        <Text color={theme.text8Sone} fontSize={_13px16px} fontWeight={400}>
          {name}
        </Text>
        <QuestionHelper1416 text={explain} color={theme.text8Sone} />
      </RowFitContent>
      <Text color={theme.text6Sone} fontSize={_13px16px} fontWeight={700}>
        {value}
      </Text>
    </RowBetween>
  )
}
