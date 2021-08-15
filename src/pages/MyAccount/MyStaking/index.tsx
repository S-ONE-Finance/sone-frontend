import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CardStaking, Heading, PlusIcon, Section, SectionButton, SectionText, StakingList } from '../components'
import { RowBetween, RowFitContent } from '../../../components/Row'
import MyStakingItem from './MyStakingItem'
import OverallNetAPY from './OverallNetAPY'
import useMyAccountStaked from '../../../hooks/staking/useMyAccountStaked'
import LoaderSone from '../../../components/LoaderSone'

export default function MyStaking() {
  const { t } = useTranslation()
  // TODO: Is it need another name?
  const [detailUserInfo, setDetailUserInfo] = useState<string | undefined>()
  const [isLoading, myAccountStaked] = useMyAccountStaked()

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
          <LoaderSone size="24px" />
        ) : myAccountStaked.length ? (
          <>
            <OverallNetAPY />
            <StakingList>
              {myAccountStaked.map(userInfo => (
                <MyStakingItem
                  key={userInfo.id}
                  userInfo={userInfo}
                  isShowDetailed={detailUserInfo === userInfo.id}
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
