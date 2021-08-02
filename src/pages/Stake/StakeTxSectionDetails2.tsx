import React from 'react'
import Row from '../../components/Row'
import { Text } from 'rebass'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import { useTranslation } from 'react-i18next'
import { SectionDetails } from '../Unstake/UnstakeTxSectionDetails'
import StakeTxDetailRow from './StakeTxDetailRow'
import { getNumberCommas } from '../../subgraph/utils/formatter'

export default function StakeTxSectionDetails2({
  rewardPerBlock,
  totalLiquidity
}: {
  rewardPerBlock?: number
  totalLiquidity?: number
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
        fieldName={t('reward_block')}
        qhText={t('Lorem ipsum dolor sit amet.')}
        value={rewardPerBlock === undefined ? '--' : getNumberCommas(rewardPerBlock)}
        unit="SONE"
      />
      <StakeTxDetailRow
        fieldName={t('total_liquidity')}
        qhText={t('Lorem ipsum dolor sit amet.')}
        value={totalLiquidity === undefined ? '--' : '$' + getNumberCommas(totalLiquidity)}
        unit={undefined}
      />
    </SectionDetails>
  )
}
