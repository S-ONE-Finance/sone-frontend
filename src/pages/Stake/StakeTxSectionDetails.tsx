import React from 'react'
import Row from '../../components/Row'
import { Text } from 'rebass'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import { useTranslation } from 'react-i18next'
import { SectionDetails } from '../Unstake/UnstakeTxSectionDetails'
import StakeTxDetailRow from './StakeTxDetailRow'

export default function StakeTxSectionDetails() {
  const { t } = useTranslation()
  const isUpToExtraSmall = useIsUpToExtraSmall()

  return (
    <SectionDetails gap={isUpToExtraSmall ? '10px' : '15px'}>
      <Row>
        <Text fontSize={isUpToExtraSmall ? 13 : 16} fontWeight={500}>
          {t('after_staking_you_will_have')}
        </Text>
      </Row>
      <StakeTxDetailRow
        fieldName={t('Total Staked Value')}
        qhText={t('Lorem ipsum dolor sit amet.')}
        value={'888,888,888.888'}
        unit="LP"
      />
      <StakeTxDetailRow
        fieldName={t('Earned Reward')}
        qhText={t('Lorem ipsum dolor sit amet.')}
        value={'888,888,888.888'}
        unit="SONE"
      />
      <StakeTxDetailRow
        fieldName={t('apy')}
        qhText={t('Lorem ipsum dolor sit amet.')}
        value={'888,888,888.888'}
        unit="%"
        valueColorPrimary
      />
    </SectionDetails>
  )
}
