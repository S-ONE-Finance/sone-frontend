import React, { useCallback, useState } from 'react'
import { UserInfoSone } from '@s-one-finance/sdk-core'
import { Text } from 'rebass'
import styled from 'styled-components'
import { darken } from 'polished'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Row, { RowFitContent, RowFixed } from '../../../components/Row'
import Column from '../../../components/Column'
import { useIsUpToExtraSmall, useIsUpToSmall } from '../../../hooks/useWindowSize'
import useTheme from '../../../hooks/useTheme'
import {
  ButtonStake,
  ButtonUnstake,
  DownIcon,
  FlexibleRow,
  MyLiquidityAndStakingContainer,
  MyStakingButton,
  MyStakingDetailedSection,
  PairName,
  SummarySection,
  TextAPY,
  TextLpTokens,
  TextPercentage,
  Watermark
} from '../components'
import EscalationDark from '../../../assets/images/escalation-dark.svg'
import EscalationLight from '../../../assets/images/escalation-light.svg'
import { useIsDarkMode } from '../../../state/user/hooks'
import SoneLogoSvg from '../../../assets/images/logo_token_sone.svg'
import TickIconSvg from '../../../assets/images/tick-icon.svg'
import { HideExtraSmall } from '../../../theme'
import usePendingReward from '../../../hooks/staking/usePendingReward'
import { formatSONE, getFixedNumberCommas } from '../../../utils/formatNumber'
import useClaimRewardHandler from '../../../hooks/staking/useClaimRewardHandler'
import LiquidityProviderTokenLogo from '../../../components/LiquidityProviderTokenLogo'
import BigNumber from 'bignumber.js'
import ModalUnstakeWarning from '../../../components/ModalUnstakeWarning'
import ModalRequestRewardWarning from 'components/ModalRequestRewardWarning'

const DetailedSectionIcon = styled.img`
  width: 90px;
  min-width: 90px;
  height: auto;
  margin-right: 1rem;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 48px;
    min-width: 48px;
    margin-right: 0.25rem;
  `}
`

const RewardedSone = styled(Text)`
  font-weight: 400;
  color: ${({ theme }) => theme.text8Sone};
  font-size: 24px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;
  `}
`

const RewardedSoneValue = styled(Text)`
  font-weight: 700;
  color: ${({ theme }) => theme.text5Sone};
  word-break: break-all;
  font-size: 40px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 20px;
  `}
`

const ButtonRequestReward = styled(MyStakingButton)`
  background-color: ${({ theme }) => theme.text5Sone};
  color: white;

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.text5Sone)};
    background-color: ${({ theme }) => darken(0.05, theme.text5Sone)};
  }

  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.text5Sone)};
  }

  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.text5Sone)};
    background-color: ${({ theme }) => darken(0.1, theme.text5Sone)};
  }
`

const RowReward = styled(Row)`
  ${({ theme }) => theme.mediaWidth.upToMedium`
    > * + * {
      margin-left: 2rem !important;
    }
  `}

  ${({ theme }) => theme.mediaWidth.upToSmall`
    > * + * {
      margin-left: 1rem !important;
    }
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    flex-direction: column;
    > * + * {
      margin-left: unset !important;
      margin-top: 0.5rem !important;
    }
  `}
`

const RowButtons = styled(Row)`
  margin-top: 4rem;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin-top: 2rem;
  `}

  ${({ theme }) => theme.mediaWidth.upToSmall`
    > * + * {
      margin-left: 1rem !important;
    }
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-top: 1rem;

    > * + * {
      margin-left: 0.5rem !important;
    }
  `}
`

type MyStakingItemProps = {
  userInfo: UserInfoSone
  isShowDetailed: boolean
  setDetailUserInfo: React.Dispatch<React.SetStateAction<string | undefined>>
}

/**
 *
 * @param props
 * @param props.userInfo The User Information
 * @param props.isShowDetailedSection
 * @param props.setDetailUserInfo
 * @constructor
 */
export default function MyStakingItem({ userInfo, isShowDetailed, setDetailUserInfo }: MyStakingItemProps) {
  const { t } = useTranslation()

  // Style.
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const isUpToSmall = useIsUpToSmall()
  const theme = useTheme()
  const isDark = useIsDarkMode()

  // Data.
  const symbol = userInfo.pool?.symbol ?? '--'
  const token0Address = userInfo.pool?.liquidityPair.token0.id ?? undefined
  const token1Address = userInfo.pool?.liquidityPair.token1.id ?? undefined

  const rewardedSone = formatSONE(userInfo.soneHarvested, true, true) ?? '--'
  const availableRewardRaw = usePendingReward(Number(userInfo.pool?.pid)).toString()
  const availableReward = formatSONE(availableRewardRaw, true, false) ?? '--'

  const myStakedLpToken = formatSONE(userInfo.amount, true, false)
  const apy = userInfo.pool?.roiPerYear
  const apyRender = apy === undefined ? '--' : `${getFixedNumberCommas(new BigNumber(apy * 100).toString(), 2)}%`

  const [poolRequestPending, setPoolRequestPending] = useState(false)
  const onClaimReward = useClaimRewardHandler()
  const claimReward = async (farmId: number | undefined) => {
    if (farmId !== undefined) {
      setPoolRequestPending(true)
      await onClaimReward(farmId, availableReward)
      setPoolRequestPending(false)
    }
  }

  const [isModalUnstakeWarningOpen, setIsModalUnstakeWarningOpen] = useState(false)

  const onModalUnstakeWarningDismiss = useCallback(() => {
    setIsModalUnstakeWarningOpen(false)
  }, [])

  const [isModalRequestRewardOpen, setIsModalRequestRewardOpen] = useState(false)

  const onModalRequestRewardDismiss = useCallback(() => {
    setIsModalRequestRewardOpen(false)
  }, [])

  return (
    <MyLiquidityAndStakingContainer>
      <ModalUnstakeWarning
        url={`/my-account/unstake/${userInfo.pool?.pid}`}
        formattedAvailableSONE={availableReward}
        isOpen={isModalUnstakeWarningOpen}
        onDismiss={onModalUnstakeWarningDismiss}
      />
      <ModalRequestRewardWarning
        onRequestReward={() => claimReward(userInfo.pool?.pid)}
        formattedAvailableSONE={availableReward}
        isOpen={isModalRequestRewardOpen}
        onDismiss={onModalRequestRewardDismiss}
      />
      <SummarySection>
        <RowFitContent
          justify="flex-start"
          flexDirection={isUpToExtraSmall ? 'column' : 'row'}
          align={isUpToExtraSmall ? 'flex-start' : 'center'}
        >
          <LiquidityProviderTokenLogo address0={token0Address} address1={token1Address} size={23} sizeMobile={23} />
          <PairName
            style={{
              marginLeft: isUpToExtraSmall ? '0' : '20px'
            }}
            text={t('LP Token')}
          >
            {symbol}
          </PairName>
        </RowFitContent>
        <FlexibleRow gap={isUpToExtraSmall ? '0' : '10px'} justify="center">
          <Column width="fit-content" align="center">
            <Text color={theme.text8Sone} fontSize={isUpToSmall ? '13px' : '16px'}>
              {t('my_staked_lp_token')}
            </Text>
            <TextLpTokens>{myStakedLpToken}</TextLpTokens>
          </Column>
        </FlexibleRow>
        <Row gap="10px" justify="flex-end">
          <Column width="fit-content" justify="center" align="center">
            <TextPercentage>{apyRender}</TextPercentage>
            <TextAPY>{t('apy')}</TextAPY>
          </Column>
          <DownIcon
            active={isShowDetailed ? 1 : 0}
            onClick={() => setDetailUserInfo(prev => (prev === userInfo.id ? undefined : userInfo.id))}
          />
        </Row>
      </SummarySection>
      {isShowDetailed && (
        <>
          <MyStakingDetailedSection gap="15px">
            <Column>
              <RowReward justify="center" gap="4rem">
                <RowFixed>
                  <DetailedSectionIcon src={SoneLogoSvg} alt="sone-logo-svg" />
                  <Column width={isUpToExtraSmall ? '33vw' : 'unset'}>
                    <RewardedSoneValue>{rewardedSone}</RewardedSoneValue>
                    <RewardedSone>{t('rewarded_sone')}</RewardedSone>
                  </Column>
                </RowFixed>
                <RowFixed>
                  <DetailedSectionIcon src={TickIconSvg} alt="tick-icon-svg" />
                  <Column width={isUpToExtraSmall ? '33vw' : 'unset'}>
                    <RewardedSoneValue>{availableReward}</RewardedSoneValue>
                    <RewardedSone>{t('available_reward')}</RewardedSone>
                  </Column>
                </RowFixed>
              </RowReward>
              <RowButtons justify="center" gap="2rem">
                <ButtonUnstake onClick={() => setIsModalUnstakeWarningOpen(true)}>{t('unstake')}</ButtonUnstake>
                <ButtonStake as={Link} to={`/staking/${userInfo.pool?.pid}`}>
                  {t('stake_more')}
                </ButtonStake>
                <ButtonRequestReward disabled={poolRequestPending} onClick={() => setIsModalRequestRewardOpen(true)}>
                  {t('request_reward')}
                </ButtonRequestReward>
              </RowButtons>
            </Column>
          </MyStakingDetailedSection>
          <HideExtraSmall>
            <Watermark src={isDark ? EscalationDark : EscalationLight} alt="escalation" size="273px" />
          </HideExtraSmall>
        </>
      )}
    </MyLiquidityAndStakingContainer>
  )
}
