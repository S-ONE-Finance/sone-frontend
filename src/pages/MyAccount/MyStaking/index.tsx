import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Heading, Section, SectionButton, SectionText, PlusIcon, CardStaking, StakingList } from '../components'
import { RowBetween, RowFitContent } from '../../../components/Row'
import MyStakingItem from './MyStakingItem'
import useAddedLiquidityPairs from '../../../hooks/useAddedLiquidityPairs'
import OverallNetAPY from './OverallNetAPY'
import useApyAndMyAccountStaked from './useApyAndMyAccountStaked'

export default function MyStaking() {
  const { t } = useTranslation()
  // TODO: Not thí isLoading.
  const [isLoading] = useAddedLiquidityPairs()
  const [detailUserInfo, setDetailUserInfo] = useState<string | undefined>()

  const [, myAccountStaked] = useApyAndMyAccountStaked()

  return (
    <Section>
      <RowBetween>
        <Heading>{t('my_staking')}</Heading>
        <SectionButton as={Link} to="/staking">
          <RowFitContent gap="8px">
            <PlusIcon />
            <SectionText>{t('stake')}</SectionText>
          </RowFitContent>
        </SectionButton>
      </RowBetween>
      <CardStaking>
        {isLoading ? (
          t('Loading...')
        ) : myAccountStaked.length ? (
          <>
            <OverallNetAPY />
            <StakingList>
              {myAccountStaked.map(userInfo => (
                <MyStakingItem
                  key={userInfo.id}
                  userInfo={userInfo}
                  isShowDetailedSection={detailUserInfo === userInfo.id}
                  setDetailUserInfo={setDetailUserInfo}
                />
              ))}
            </StakingList>
          </>
        ) : (
          t('No item to show.')
        )}
      </CardStaking>
    </Section>
  )
}
