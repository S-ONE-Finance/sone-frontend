import React from 'react'
import Row from '../../components/Row'
import { Text } from 'rebass'
import UnstakeTxDetailRow from './UnstakeTxDetailRow'
import styled from 'styled-components'
import { AutoColumn } from '../../components/Column'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import { useTranslation } from 'react-i18next'
import { getBalanceNumber, reduceFractionDigit } from '../../utils/formatNumber'

export const SectionDetails = styled(AutoColumn)`
  padding: 0 14px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 0 8px;
  `}
`

export default function UnstakeTxSectionDetails({
  totalLpToken,
  remainStakedLp,
  availableReward
}: {
  totalLpToken: string
  remainStakedLp: string
  availableReward: string
}) {
  const { t } = useTranslation()
  const isUpToExtraSmall = useIsUpToExtraSmall()

  return (
    <SectionDetails gap={isUpToExtraSmall ? '10px' : '15px'}>
      <Row>
        <Text fontSize={isUpToExtraSmall ? 13 : 16} fontWeight={500}>
          {t('after_unstaking_you_will_have')}
        </Text>
      </Row>
      <UnstakeTxDetailRow
        fieldName={t('total_lp_token')}
        qhText={t('question_helper_total_lp_token')}
        value={reduceFractionDigit(getBalanceNumber(totalLpToken) + '', 18)}
        unit="LP"
      />
      <UnstakeTxDetailRow
        fieldName={t('remain_staked_lp')}
        qhText={t('question_helper_remain_staked_lp')}
        value={reduceFractionDigit(getBalanceNumber(remainStakedLp) + '', 18)}
        unit="LP"
      />
      <UnstakeTxDetailRow
        fieldName={t('available_reward')}
        qhText={t('question_helper_available_reward')}
        value={reduceFractionDigit(getBalanceNumber(availableReward) + '', 18)}
        unit="SONE"
      />
    </SectionDetails>
  )
}
