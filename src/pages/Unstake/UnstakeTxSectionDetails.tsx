import React from 'react'
import Row from '../../components/Row'
import { Text } from 'rebass'
import UnstakeTxDetailRow from './UnstakeTxDetailRow'
import styled from 'styled-components'
import { AutoColumn } from '../../components/Column'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import { useTranslation } from 'react-i18next'
import { getBalanceStringCommas } from '../../hooks/masterfarmer/utils'

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
          {t('After unstaking, you will have')}
        </Text>
      </Row>
      <UnstakeTxDetailRow
        fieldName={t('Total LP Token')}
        qhText={t('Lorem ipsum dolor sit amet.')}
        value={getBalanceStringCommas(totalLpToken)}
        unit="LP"
      />
      <UnstakeTxDetailRow
        fieldName={t('Remain Staked LP')}
        qhText={t('Lorem ipsum dolor sit amet.')}
        value={getBalanceStringCommas(remainStakedLp)}
        unit="LP"
      />
      <UnstakeTxDetailRow
        fieldName={t('available_reward')}
        qhText={t('Lorem ipsum dolor sit amet.')}
        value={getBalanceStringCommas(availableReward)}
        unit="SONE"
      />
    </SectionDetails>
  )
}
