import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Heading, Section, SectionButton, SectionText, PlusIcon, CardStaking, StakingList } from '../components'
import { RowBetween, RowFitContent } from '../../../components/Row'
import MyStakingItem from './MyStakingItem'
import useAddedLiquidityPairs from '../../../hooks/useAddedLiquidityPairs'
import OverallNetAPY from './OverallNetAPY'
import { UserInfoSushi } from '@s-one-finance/sdk-core'
import useMyAccountStaked from '../../../hooks/masterfarmer/useMyAccountStaked'

export default function MyStaking() {
  const { t } = useTranslation()
  // TODO: This loading is fake.
  const [isLoading] = useAddedLiquidityPairs()
  const [detailUserInfo, setDetailUserInfo] = useState<string | undefined>()

  const myAccountStaked: UserInfoSushi[] = useMyAccountStaked()

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
          t('Fake loading...')
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
