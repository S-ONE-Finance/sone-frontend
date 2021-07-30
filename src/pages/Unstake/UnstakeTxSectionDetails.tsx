import React, { useEffect, useState } from 'react'
import Row from '../../components/Row'
import { Text } from 'rebass'
import UnstakeTxDetailRow from './UnstakeTxDetailRow'
import styled from 'styled-components'
import { AutoColumn } from '../../components/Column'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import { useTranslation } from 'react-i18next'
import useTokenBalance from '../../hooks/masterfarmer/useTokenBalance'
import usePendingReward from '../../hooks/masterfarmer/usePendingReward'
import { useBlockNumber } from '../../state/application/hooks'
import { PoolInfo, UserInfo } from '@s-one-finance/sdk-core'
import BigNumber from 'bignumber.js'
import { Farm } from '@s-one-finance/sdk-core/'
import { getFullDisplayBalanceWithComma } from '../../hooks/masterfarmer/utils'

export const SectionDetails = styled(AutoColumn)`
  padding: 0 14px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 0 8px;
  `}
`

export default function UnstakeTxSectionDetails({ unstakeAmount, farm }: { unstakeAmount?: number; farm?: Farm }) {
  const { t } = useTranslation()
  const isUpToExtraSmall = useIsUpToExtraSmall()

  const [totalLPToken, setTotalLPToken] = useState('0')
  const [remainStakedLP, setRemainStakedLP] = useState('0')
  const [availableReward, setAvailableReward] = useState('0')

  const tokenBalance = useTokenBalance(farm?.pairAddress)
  const pendingReward = usePendingReward(Number(farm?.id))
  const block = useBlockNumber()

  useEffect(() => {
    const poolInfo = new PoolInfo(farm)
    if (unstakeAmount && farm?.userInfo) {
      const userInfo = new UserInfo(poolInfo, farm.userInfo)
      const newTotalLPToken = userInfo.getTotalLPTokenAfterUnstake(
        tokenBalance.toString(),
        new BigNumber(unstakeAmount).times(new BigNumber(10).pow(18)).toString()
      )
      setTotalLPToken(newTotalLPToken)
      const newTotalStaked = userInfo.getRemainStakedValueAfterUnstake(
        new BigNumber(unstakeAmount).times(new BigNumber(10).pow(18)).toString()
      )
      setRemainStakedLP(newTotalStaked)
      setAvailableReward(pendingReward.toString())
    }
  }, [unstakeAmount, farm, block, tokenBalance, pendingReward])

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
        value={getFullDisplayBalanceWithComma(totalLPToken)}
        unit="LP"
      />
      <UnstakeTxDetailRow
        fieldName={t('Remain Staked LP')}
        qhText={t('Lorem ipsum dolor sit amet.')}
        value={getFullDisplayBalanceWithComma(remainStakedLP)}
        unit="LP"
      />
      <UnstakeTxDetailRow
        fieldName={t('available_reward')}
        qhText={t('Lorem ipsum dolor sit amet.')}
        value={getFullDisplayBalanceWithComma(availableReward)}
        unit="SONE"
      />
    </SectionDetails>
  )
}
