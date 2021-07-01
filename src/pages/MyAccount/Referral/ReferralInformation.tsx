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
import { useIsUpToExtraSmall, useIsUpToSmall } from '../../../hooks/useWindowSize'
import useReferrerInformation from './hooks/useReferrerInformation'
import usePrevious from '../../../hooks/usePrevious'
import { CountUp } from 'use-count-up'

const FriendsAndReward = styled(AutoColumn)`
  display: grid;
  grid-auto-rows: auto;
  grid-row-gap: 20px;
  flex-grow: 1;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    grid-row-gap: 10px;
  `}
`

const TextAccent = styled(Text)`
  color: ${({ theme }) => theme.text5Sone};
  font-size: 24px;
  font-weight: 700;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 16px;
  `}
`

const TextAccentBig = styled(TextAccent)`
  font-size: 40px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 24px;
  `}
`

const TextAccentSmall = styled(TextAccent)`
  font-size: 18px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 16px;
  `}
`

const TextDefault = styled(Text)`
  color: ${({ theme }) => theme.text6Sone};
  font-size: 18px;
  font-weight: 400;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;
  `}
`

const TextSoneUnit = styled(TextDefault)`
  font-weight: 700;
`

const TextSoneUnitBig = styled(TextSoneUnit)`
  font-size: 24px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 16px;
  `}
`

const PendingRewardRow = styled(Row)`
  align-items: center;
  gap: 50px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    gap: 10px;
  `}
`

const SoneLogo = styled(SoneLogoSvg)`
  width: 90px;
  min-width: 90px;
  height: auto;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 60px;
    min-width: 60px;
  `}
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

  ${({ theme }) => theme.mediaWidth.upToSmall`
    min-width: fit-content;
    width: fit-content;
    margin-top: 35px;
    align-self: center;
  `}
`

const FlexibleRow = styled.div`
  display: flex;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
  `}
`

const SubText2 = styled(TextDefault)`
  font-size: 16px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;
  `}
`

const TextReferralID = styled(TextAccent)`
  color: ${({ theme }) => theme.red1Sone};
`

const StyledQRCode = styled.div`
  border-radius: 0;
  margin-top: 20px;
  margin-bottom: 20px;
  height: 150px;
  width: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.white};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    height: 130px;
    width: 130px;
    margin-top: 10px;
    margin-bottom: 10px;
  `}
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

// TODO: Thay đổi url production deploy.
const S_ONE_FINANCE_URL = 'https://www.lipsum.com/'

function NumberCountUp({ value }: { value: number | undefined }) {
  const curr = value ? +value.toFixed(3) : 0
  const prev = usePrevious(curr)
  const prevReset = prev === curr ? 0 : prev

  return <CountUp autoResetKey={curr} isCounting start={prevReset} end={curr} thousandsSeparator={','} duration={1} />
}

export default function ReferralInformation() {
  const isUpToSmall = useIsUpToSmall()
  const isUpToExtraSmall = useIsUpToExtraSmall()

  const [isCopied, setCopied] = useCopyClipboard()

  const referrerInformation = useReferrerInformation()

  const { code, totalPaidReward, totalRewardAmount, pendingAmount, totalFriend } = referrerInformation || {}

  return (
    <FlexibleRow>
      <FriendsAndReward>
        <Row gap="5px">
          <TextAccent>
            <NumberCountUp value={totalFriend} />
          </TextAccent>
          <TextAccentSmall>friends</TextAccentSmall>
          <TextDefault>have used your Referral ID.</TextDefault>
          <QuestionHelper1416 text="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis, rem?" />
        </Row>
        <PendingRewardRow>
          <SoneLogo />
          <Column>
            <Row align="baseline" gap="10px">
              <TextAccentBig>
                <NumberCountUp value={pendingAmount} />
              </TextAccentBig>
              <TextSoneUnitBig>SONE</TextSoneUnitBig>
            </Row>
            <TextSubtitle>Pending Reward</TextSubtitle>
          </Column>
        </PendingRewardRow>
        <Row wrap="wrap" gap="5px">
          <TextDefault minWidth={isUpToExtraSmall ? 'unset' : 137}>Paid Reward:</TextDefault>
          <TextAccent>
            <NumberCountUp value={totalPaidReward} />
          </TextAccent>
          <RowFixed>
            <TextSoneUnit>SONE≈</TextSoneUnit>
            {/* TODO: Pending SONE to DOLLARS */}
            <TextDollar>88,888.888</TextDollar>
          </RowFixed>
        </Row>
        <Row wrap="wrap" gap="5px">
          <TextDefault minWidth={isUpToExtraSmall ? 'unset' : 137}>Reward Amount:</TextDefault>
          <TextAccent>
            <NumberCountUp value={totalRewardAmount} />
          </TextAccent>
          <RowFixed>
            <TextSoneUnit>SONE≈</TextSoneUnit>
            {/* TODO: Pending SONE to DOLLARS */}
            <TextDollar>88,888.888</TextDollar>
          </RowFixed>
        </Row>
      </FriendsAndReward>
      <QrCodeShareSection>
        <RowBetween gap={isUpToSmall ? '10px' : undefined}>
          <SubText2>Your Referral ID:</SubText2>
          <TextReferralID>{code === undefined ? '--' : code}</TextReferralID>
        </RowBetween>
        <StyledQRCode>
          <QRCode value={S_ONE_FINANCE_URL} size={110} />
        </StyledQRCode>
        <SubText2>Share with</SubText2>
        <Row gap="20px" justify="center" marginTop="10px">
          <ExternalLink href={`https://twitter.com/intent/tweet?url=${S_ONE_FINANCE_URL}&text=`}>
            <Twitter />
          </ExternalLink>
          <ExternalLink href={`https://telegram.me/share/url?url=${S_ONE_FINANCE_URL}&text=`}>
            <Telegram />
          </ExternalLink>
          {/* TODO: Chưa triển khai referral id bên swap và add liquidity. */}
          {isCopied ? <CheckCircle /> : <Copy onClick={() => setCopied(S_ONE_FINANCE_URL)} />}
        </Row>
      </QrCodeShareSection>
    </FlexibleRow>
  )
}
