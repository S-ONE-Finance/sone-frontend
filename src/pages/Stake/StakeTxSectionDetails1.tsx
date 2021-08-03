import React from 'react'
import Row from '../../components/Row'
import { Text } from 'rebass'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import { useTranslation } from 'react-i18next'
import { SectionDetails } from '../Unstake/UnstakeTxSectionDetails'
import StakeTxDetailRow from './StakeTxDetailRow'

export default function StakeTxSectionDetails1({
  totalStakedAfterStake,
  earnedRewardAfterStake,
  apyAfterStake
}: {
  totalStakedAfterStake: string
  earnedRewardAfterStake: string
  apyAfterStake: string
}) {
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
        fieldName={t('total_staked_value')}
        qhText={t('Lorem ipsum dolor sit amet.')}
        value={totalStakedAfterStake}
        unit="LP"
      />
      <StakeTxDetailRow
        fieldName={t('earned_reward')}
        qhText={t('Lorem ipsum dolor sit amet.')}
        value={earnedRewardAfterStake}
        unit="SONE"
      />
      <StakeTxDetailRow
        fieldName={t('apy')}
        qhText={t('Lorem ipsum dolor sit amet.')}
        value={apyAfterStake}
        unit="%"
        valueColorPrimary
      />
    </SectionDetails>
  )
}
