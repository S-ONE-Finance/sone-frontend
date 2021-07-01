// BUG: Chưa fix bug vỡ layout với số dài hơn "888,888.888".

import React from 'react'
import Row, { RowBetween, RowFixed } from '../../../components/Row'
import { QuestionHelper1416 } from '../../../components/QuestionHelper'
import Column, { AutoColumn, ColumnCenter } from '../../../components/Column'
import styled, { css } from 'styled-components'
import { Text } from 'rebass'
import { ReactComponent as SoneLogoSvg } from '../../../assets/images/logo_token_sone.svg'
import QRCode from 'qrcode.react'
import { ReactComponent as TwitterSvg } from '../../../assets/svg/twitter.svg'
import { ReactComponent as TelegramSvg } from '../../../assets/svg/telegram.svg'
import { ReactComponent as CopySvg } from '../../../assets/svg/copy.svg'
import useCopyClipboard from '../../../hooks/useCopyClipboard'
import { CheckCircle } from 'react-feather'
import { ExternalLink } from '../../../theme'

const FriendsAndReward = styled(AutoColumn)`
  display: grid;
  grid-auto-rows: auto;
  grid-row-gap: 20px;
  flex-grow: 1;
`

const TextAccent = styled(Text)`
  color: ${({ theme }) => theme.text5Sone};
  font-size: 24px;
  font-weight: 700;
`

const TextAccentBig = styled(TextAccent)`
  font-size: 40px;
`

const TextAccentSmall = styled(TextAccent)`
  font-size: 18px;
`

const TextDefault = styled(Text)`
  color: ${({ theme }) => theme.text6Sone};
  font-size: 18px;
  font-weight: 400;
`

const TextSoneUnit = styled(TextDefault)`
  font-weight: 700;
`

const TextSoneUnitBig = styled(TextSoneUnit)`
  font-size: 24px;
`

const PendingRewardRow = styled(Row)`
  align-items: center;
  gap: 40px;
`

const SoneLogo = styled(SoneLogoSvg)`
  width: 90px;
  min-width: 90px;
  height: auto;
`

const TextSubtitle = styled(TextDefault)`
  color: ${({ theme }) => theme.text4Sone};
`

const TextDollar = styled(TextSoneUnit)`
  color: ${({ theme }) => theme.text4Sone};
`

const QrCodeShareSection = styled(ColumnCenter)`
  min-width: 254px;
  width: 254px;
  //background: darkblue;
`

const FlexibleRow = styled.div`
  display: flex;
`

const SubText2 = styled(TextDefault)`
  font-size: 16px;
`

const TextReferralID = styled(TextAccent)`
  color: ${({ theme }) => theme.red1Sone};
`

const StyledQRCode = styled(QRCode)`
  border-radius: 0;
  margin-top: 20px;
  margin-bottom: 40px;
`

const BaseIcon = css`
  cursor: pointer;
  * {
    fill: ${({ theme }) => theme.text1Sone};
  }

  :focus,
  :hover {
    * {
      fill: ${({ theme }) => theme.text5Sone};
    }
  }
`

const Twitter = styled(TwitterSvg)`
  ${BaseIcon}
`

const Telegram = styled(TelegramSvg)`
  ${BaseIcon}
`

const Copy = styled(CopySvg)`
  ${BaseIcon}
`

export default function ReferralInformation() {
  const [isCopied, setCopied] = useCopyClipboard()
  const num = '88,888.888'

  return (
    <FlexibleRow>
      <FriendsAndReward>
        <Row gap="5px">
          <TextAccent>8888</TextAccent>
          <TextAccentSmall>friends</TextAccentSmall>
          <TextDefault>have used your Referral ID.</TextDefault>
          <QuestionHelper1416 text="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis, rem?" />
        </Row>
        <PendingRewardRow>
          <SoneLogo />
          <Column>
            <Row align="baseline" gap="10px">
              <TextAccentBig>{num}</TextAccentBig>
              <TextSoneUnitBig>SONE</TextSoneUnitBig>
            </Row>
            <TextSubtitle>Pending Reward</TextSubtitle>
          </Column>
        </PendingRewardRow>
        <Row wrap="wrap" gap="5px">
          <TextDefault minWidth={130}>Paid Reward:</TextDefault>
          <TextAccent>{num}</TextAccent>
          <RowFixed>
            <TextSoneUnit>SONE≈</TextSoneUnit>
            <TextDollar>${num}</TextDollar>
          </RowFixed>
        </Row>
        <Row wrap="wrap" gap="5px">
          <TextDefault minWidth={130}>Reward Reward:</TextDefault>
          <TextAccent>{num}</TextAccent>
          <RowFixed>
            <TextSoneUnit>SONE≈</TextSoneUnit>
            <TextDollar>${num}</TextDollar>
          </RowFixed>
        </Row>
      </FriendsAndReward>
      <QrCodeShareSection>
        <RowBetween>
          <SubText2>Your Referral ID:</SubText2>
          <TextReferralID>1A2B3C4D</TextReferralID>
        </RowBetween>
        <StyledQRCode value="https://facebook.github.io/react/" size={110} />
        <SubText2>Share with</SubText2>
        <Row gap="20px" justify="center" marginTop="10px">
          <ExternalLink href="https://www.lipsum.com/">
            <Twitter />
          </ExternalLink>
          <ExternalLink href="https://www.lipsum.com/">
            <Telegram />
          </ExternalLink>
          {isCopied ? <CheckCircle /> : <Copy onClick={() => setCopied('1A2B3C4D')} />}
        </Row>
      </QrCodeShareSection>
    </FlexibleRow>
  )
}
