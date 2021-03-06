import React from 'react'
import Row from '../../components/Row'
import { Text } from 'rebass'
import { useIsUpToExtraSmall } from 'hooks/useWindowSize'
import { useTranslation } from 'react-i18next'
import { SectionDetails } from '../Unstake/UnstakeTxSectionDetails'
import StakeTxDetailRow from './StakeTxDetailRow'

export default function StakeTxSectionDetails2({
  rewardPerBlock,
  totalLiquidity
}: {
  rewardPerBlock: string
  totalLiquidity: string
}) {
  const { t } = useTranslation()
  const isUpToExtraSmall = useIsUpToExtraSmall()

  return (
    <SectionDetails gap={isUpToExtraSmall ? '10px' : '15px'}>
      <Row>
        <Text fontSize={isUpToExtraSmall ? 13 : 16} fontWeight={500}>
          {t('reward_information')}
        </Text>
      </Row>
      <StakeTxDetailRow
        fieldName={t('reward_per_block')}
        qhText={t('question_helper_reward_per_block')}
        value={rewardPerBlock}
        unit="SONE"
      />
      <StakeTxDetailRow
        fieldName={t('total_liquidity')}
        qhText={t('question_helper_total_liquidity')}
        value={totalLiquidity}
        unit={undefined}
      />
    </SectionDetails>
  )
}
