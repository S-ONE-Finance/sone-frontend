import React from 'react'
import { Card, Heading, Section } from '../components'
import { RowBetween, RowFitContent } from '../../../components/Row'
import { SectionButton, SectionText } from '../components'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import InvitedFriendsTable from './InvitedFriendsTable'
import ReferralInformation from './ReferralInformation'
import { Text } from 'rebass'

const CardReferral = styled(Card)`
  padding: 40px 40px 30px 40px;
  display: grid;
  grid-template-columns: 100%;
  grid-row-gap: 40px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 40px 0;
    grid-row-gap: 30px;
  `}
`

const TitleBodyWrapper = styled.div`
  display: grid;
  grid-row-gap: 20px;
`

const TextSubSection = styled(Text)`
  color: ${({ theme }) => theme.text6Sone};
  font-size: 24px;
  font-weight: 700;
`

export default function Referral() {
  return (
    <Section>
      <RowBetween>
        <Heading>Referral</Heading>
        <SectionButton as={Link} to="/add/ETH">
          <RowFitContent gap="8px">
            <SectionText>Request Reward</SectionText>
          </RowFitContent>
        </SectionButton>
      </RowBetween>
      <CardReferral>
        <TitleBodyWrapper>
          <TextSubSection>Referral Information</TextSubSection>
          <ReferralInformation />
        </TitleBodyWrapper>
        <TitleBodyWrapper>
          <TextSubSection>Invited Friends</TextSubSection>
          <InvitedFriendsTable />
        </TitleBodyWrapper>
      </CardReferral>
    </Section>
  )
}
