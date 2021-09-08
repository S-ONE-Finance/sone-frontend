import React, { useMemo, useState } from 'react'
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
  DownIcon,
  FlexibleRow,
  MyLiquidityAndStakingContainer,
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
import {
  getBalanceNumber,
  getBalanceStringCommas,
  getFixedNumberCommas,
  reduceFractionDigit
} from '../../../utils/formatNumber'
import useClaimRewardHandler from '../../../hooks/staking/useClaimRewardHandler'
import LiquidityProviderTokenLogo from '../../../components/LiquidityProviderTokenLogo'

const DetailedSectionIcon = styled.img`
  width: 90px;
  min-width: 90px;
  height: auto;
  margin-right: 1rem;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 60px;
    min-width: 60px;
    margin-right: 0.25rem;
  `}
`

const RewardedSone = styled(Text)`
  font-weight: 400;
  color: ${({ theme }) => theme.text8Sone};
`

const RewardedSoneValue = styled(Text)`
  font-weight: 700;
  color: ${({ theme }) => theme.text5Sone};
  word-break: break-all;
`

const MyStakingButton = styled.button`
  min-width: min(192px, 20vw);
  min-height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: 500;
  border-radius: 50px;
  outline: none;
  border: none;
  cursor: pointer;
  z-index: 1;
  text-decoration: none;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 16px;
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;
    min-height: 45px;
    min-width: 93px;
    padding: unset 10px;
  `}
`

const ButtonUnstake = styled(MyStakingButton)`
  background-color: ${({ theme }) => theme.text9Sone};
  color: #333333;

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.text9Sone)};
    background-color: ${({ theme }) => darken(0.05, theme.text9Sone)};
  }

  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.text9Sone)};
  }

  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.text9Sone)};
    background-color: ${({ theme }) => darken(0.1, theme.text9Sone)};
  }
`

const ButtonStake = styled(MyStakingButton)`
  background-color: ${({ theme }) => theme.red1Sone};
  color: white;

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.red1Sone)};
    background-color: ${({ theme }) => darken(0.05, theme.red1Sone)};
  }

  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.red1Sone)};
  }

  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.red1Sone)};
    background-color: ${({ theme }) => darken(0.1, theme.red1Sone)};
  }
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

  const rewardedSone = isNaN(+userInfo.soneHarvested) ? '--' : (+userInfo.soneHarvested).toFixed(6)
  const availableReward = usePendingReward(Number(userInfo.pool?.pid)).toString()

  const myStakedLpToken = reduceFractionDigit('' + getBalanceNumber(userInfo.amount), 18)
  const apy = userInfo.pool?.roiPerYear
  const apyRender = apy === undefined ? '--' : `${getFixedNumberCommas(apy * 100)}%`
  // const apy = userInfo.pool?.roiPerYear === undefined ? '--' : `${reduceFractionDigit('' + userInfo.pool.roiPerYear * 100, 2)}%`

  const [poolRequestPending, setPoolRequestPending] = useState(false)
  const onClaimReward = useClaimRewardHandler()
  // TODO: Use-case claim reward là gì?
  const claimReward = async (farmId: number | undefined) => {
    if (farmId !== undefined) {
      setPoolRequestPending(true)
      await onClaimReward(farmId)
      setPoolRequestPending(false)
    }
  }

  // Dynamic style.
  const isLongNumber = useMemo(() => rewardedSone.toString().length + availableReward.toString().length >= 20, [
    rewardedSone,
    availableReward
  ])
  const valueFontSize = useMemo(
    () => (isLongNumber ? (isUpToSmall ? '1.5rem' : '1.75rem') : isUpToSmall ? '2.25rem' : '2.5rem'),
    [isLongNumber, isUpToSmall]
  )
  const titleFontSize = useMemo(
    () => (isLongNumber ? (isUpToSmall ? '1rem' : '1.25rem') : isUpToSmall ? '1.25rem' : '1.5rem'),
    [isLongNumber, isUpToSmall]
  )

  return (
    <MyLiquidityAndStakingContainer>
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
            <TextPercentage onClick={() => alert('Not implemented yet!')}>{apyRender}</TextPercentage>
            <TextAPY>{t('apy')}</TextAPY>
          </Column>
          <DownIcon
            active={isShowDetailed ? 0 : 1}
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
                  <Column>
                    <RewardedSoneValue style={{ fontSize: valueFontSize }}>{rewardedSone}</RewardedSoneValue>
                    <RewardedSone style={{ fontSize: titleFontSize }}>{t('rewarded_sone')}</RewardedSone>
                  </Column>
                </RowFixed>
                <RowFixed>
                  <DetailedSectionIcon src={TickIconSvg} alt="tick-icon-svg" />
                  <Column>
                    <RewardedSoneValue style={{ fontSize: valueFontSize }}>
                      {getBalanceStringCommas(availableReward)}
                    </RewardedSoneValue>
                    <RewardedSone style={{ fontSize: titleFontSize }}>{t('available_reward')}</RewardedSone>
                  </Column>
                </RowFixed>
              </RowReward>
              <RowButtons justify="center" gap="2rem">
                {/* TODO: Specific pair. */}
                <ButtonUnstake as={Link} to={`/my-account/unstake/${userInfo.pool?.pid}`}>
                  {t('unstake')}
                </ButtonUnstake>
                {/* TODO: Specific pair. */}
                <ButtonStake as={Link} to={`/staking/${userInfo.pool?.pid}`}>
                  {t('stake_more')}
                </ButtonStake>
                {/* TODO: ??? */}
                <ButtonRequestReward disabled={poolRequestPending} onClick={() => claimReward(userInfo.pool?.pid)}>
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
