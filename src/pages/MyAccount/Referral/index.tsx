import React from 'react'
import { Card, Heading, Section, SectionButton, SectionText } from '../components'
import { RowBetween } from '../../../components/Row'
import styled from 'styled-components'
import InvitedFriendsTable from './InvitedFriendsTable'
import ReferralInformation from './ReferralInformation'
import { Text } from 'rebass'
import useRequestReward from './hooks/useRequestReward'
import useReferrerInformation from './hooks/useReferrerInformation'
import { AutoColumn } from '../../../components/Column'
import { useTranslation } from 'react-i18next'

const CardReferral = styled(Card)`
  padding: 40px 40px 30px 40px;
  display: grid;
  grid-template-columns: 100%;
  grid-row-gap: 40px;
  border-radius: 15px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 40px 0;
    grid-row-gap: 30px;
    border-radius: 10px;
  `}
`

const TitleBodyWrapper = styled.div`
  display: grid;
  grid-row-gap: 20px;
  width: 100%;
  overflow-x: hidden;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    grid-row-gap: 10px;
  `}
`

const ReferralInformationWrapper = styled(TitleBodyWrapper)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0 20px;
  `}
`

const TextSubSection = styled(Text)`
  color: ${({ theme }) => theme.text6Sone};
  font-size: 24px;
  font-weight: 700;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 20px;
  `}
`

export const Padding20ExtraSmall = styled.div`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0 20px;
  `}
`

const PendingText = styled(Text)`
  color: ${({ theme }) => theme.text6Sone};
  font-size: 14px;
  text-align: center;
  padding-top: 10px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 11px;
    padding-top: 3px;
  `}
`

// export const FETCH_REFERRAL_DATA_INTERVAL = 15000

export default function Referral() {
  // Ở đây dùng tạm hàm biến cờ "justClicked" để set "Waiting for Approval"
  // ngay sau khi POST lệnh "request reward" thành công. Sau 15000ms (FETCH_DATA_REFERRAL_INTERVAL) sẽ nhả ra.
  const { t } = useTranslation()
  const [justClicked, requestReward] = useRequestReward()
  const { isRequestRewardPending, pendingAmount, status } = useReferrerInformation() || {}
  const isDisabled =
    justClicked ||
    isRequestRewardPending === undefined ||
    isRequestRewardPending === true ||
    pendingAmount === undefined ||
    pendingAmount < 0.000001 ||
    status == 'Disable'

  const disabledText = pendingAmount === undefined || pendingAmount < 0.000001 ? '' : t('waiting_for_approval')

  return (
    <Section>
      <RowBetween>
        <Heading>{t('referral')}</Heading>
        <AutoColumn>
          <SectionButton disabled={isDisabled} onClick={requestReward} is_disabled={isDisabled ? 'yes' : undefined}>
            <SectionText>{t('request_reward')}</SectionText>
          </SectionButton>
          {isDisabled && <PendingText>{disabledText}</PendingText>}
        </AutoColumn>
      </RowBetween>
      <CardReferral>
        <ReferralInformationWrapper>
          <TextSubSection>{t('referral_information')}</TextSubSection>
          <ReferralInformation />
        </ReferralInformationWrapper>
        <TitleBodyWrapper>
          <Padding20ExtraSmall>
            <TextSubSection>{t('invited_friends')}</TextSubSection>
          </Padding20ExtraSmall>
          <InvitedFriendsTable />
        </TitleBodyWrapper>
      </CardReferral>
    </Section>
  )
}
