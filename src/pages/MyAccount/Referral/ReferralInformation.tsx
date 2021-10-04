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
import { Trans, useTranslation } from 'react-i18next'
import { useFormattedSoneInUSD } from '../../../hooks/useOneSoneInUSD'
import { S_ONE_APP_URL } from '../../../constants/urls'
import BigNumber from 'bignumber.js'

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
    margin-top: 2.1875rem;
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
  margin-top: 20px;
  margin-bottom: 20px;
  height: 150px;
  width: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.white};
  border-radius: 0.5rem;

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

function NumberCountUp({ value }: { value: BigNumber | undefined }) {
  const curr = value ? value.toPrecision(6).toString() : '0'
  const prev = usePrevious(curr)
  const prevReset = prev === curr ? '0' : prev

  return (
    <CountUp
      autoResetKey={curr}
      isCounting
      start={prevReset ? +prevReset : 0}
      end={+curr}
      thousandsSeparator={','}
      duration={1}
    />
  )
}

export default function ReferralInformation() {
  const { t } = useTranslation()
  const isUpToSmall = useIsUpToSmall()
  const isUpToExtraSmall = useIsUpToExtraSmall()

  const [isCopied, setCopied] = useCopyClipboard()

  const referrerInformation = useReferrerInformation()

  const { code, totalPaidReward, totalRewardAmount, pendingAmount, totalFriend } = referrerInformation || {}
  const formattedTotalPaidRewardInUSD = useFormattedSoneInUSD(totalPaidReward)
  const formattedTotalRewardAmountInUSD = useFormattedSoneInUSD(totalRewardAmount)

  const shareUrlRaw = S_ONE_APP_URL + '/#/swap?referral-id=' + code
  const shareUrlEncoded = S_ONE_APP_URL + '%2F%23%2Fswap%3Freferral-id%3D' + code

  return (
    <FlexibleRow>
      <FriendsAndReward>
        <Row gap="5px">
          <Trans
            i18nKey="123_friends_have_used_your_referral_id"
            values={{ numberOfFriends: totalFriend }}
            components={[<TextAccent key="0" />, <TextAccentSmall key="1" />, <TextDefault key="2" />]}
          />
          <QuestionHelper1416 text={t('question_helper_123_friends_have_used_your_referral_id')} />
        </Row>
        <PendingRewardRow>
          <SoneLogo />
          <Column>
            <Row align="baseline" gap="10px" wrap="wrap">
              <TextAccentBig>
                <NumberCountUp value={new BigNumber(pendingAmount ?? '0')} />
              </TextAccentBig>
              <TextSoneUnitBig>SONE</TextSoneUnitBig>
            </Row>
            <TextSubtitle>{t('pending_reward')}</TextSubtitle>
          </Column>
        </PendingRewardRow>
        <Row wrap="wrap" gap="5px">
          <TextDefault minWidth={isUpToExtraSmall ? 'unset' : 137}>{t('paid_reward') + ':'}</TextDefault>
          <TextAccent>
            <NumberCountUp value={new BigNumber(totalPaidReward ?? '0')} />
          </TextAccent>
          <RowFixed>
            <TextSoneUnit>SONE≈</TextSoneUnit>
            <TextDollar>{'$' + formattedTotalPaidRewardInUSD}</TextDollar>
          </RowFixed>
        </Row>
        <Row wrap="wrap" gap="5px">
          <TextDefault minWidth={isUpToExtraSmall ? 'unset' : 137}>{t('reward_amount') + ':'}</TextDefault>
          <TextAccent>
            <NumberCountUp value={new BigNumber(totalRewardAmount ?? '0')} />
          </TextAccent>
          <RowFixed>
            <TextSoneUnit>SONE≈</TextSoneUnit>
            <TextDollar>{'$' + formattedTotalRewardAmountInUSD}</TextDollar>
          </RowFixed>
        </Row>
      </FriendsAndReward>
      <QrCodeShareSection>
        <RowBetween gap={isUpToSmall ? '10px' : undefined}>
          <SubText2>{t('your_referral_id') + ':'}</SubText2>
          <TextReferralID>{code === undefined ? '--' : code}</TextReferralID>
        </RowBetween>
        <StyledQRCode>
          <QRCode value={shareUrlRaw} size={110} />
        </StyledQRCode>
        <SubText2>{t('share_with')}</SubText2>
        <Row gap="20px" justify="center" marginTop="10px">
          <ExternalLink href={`https://twitter.com/intent/tweet?url=${shareUrlEncoded}&text=`}>
            <Twitter />
          </ExternalLink>
          <ExternalLink href={`https://telegram.me/share/url?url=${shareUrlEncoded}&text=`}>
            <Telegram />
          </ExternalLink>
          {isCopied ? <CheckCircle /> : <Copy onClick={() => setCopied(shareUrlRaw)} />}
        </Row>
      </QrCodeShareSection>
    </FlexibleRow>
  )
}
