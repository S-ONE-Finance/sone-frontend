import React, { useMemo } from 'react'
import Row, { RowFitContent, RowFixed } from '../../../components/Row'
import CurrencyLogoDouble from '../../../components/CurrencyLogoDouble'
import { Pair } from '@s-one-finance/sdk-core'
import { Text } from 'rebass'
import Column from '../../../components/Column'
import { useIsUpToExtraSmall, useIsUpToSmall } from '../../../hooks/useWindowSize'
import useTheme from '../../../hooks/useTheme'
import { unwrappedToken } from '../../../utils/wrappedCurrency'
import {
  DownIcon,
  FlexibleRow,
  Watermark,
  MyLiquidityAndStakingContainer,
  PairName,
  SummarySection,
  TextAPY,
  TextLpTokens,
  TextPercentage,
  MyStakingDetailedSection
} from '../components'
import EscalationDark from '../../../assets/images/escalation-dark.svg'
import EscalationLight from '../../../assets/images/escalation-light.svg'
import { useIsDarkMode } from '../../../state/user/hooks'
import SoneLogoSvg from '../../../assets/images/logo_token_sone.svg'
import TickIconSvg from '../../../assets/images/tick-icon.svg'
import styled from 'styled-components'
import { darken } from 'polished'
import { Link } from 'react-router-dom'
import { HideExtraSmall } from '../../../theme'

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

export default function MyStakingItem({
  pair,
  isShowDetailedSection,
  setDetailPair
}: {
  pair: Pair
  isShowDetailedSection: boolean
  setDetailPair: React.Dispatch<React.SetStateAction<string | undefined>>
}) {
  // Style.
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const isUpToSmall = useIsUpToSmall()
  const theme = useTheme()
  const isDark = useIsDarkMode()

  // Data.
  const currency0 = unwrappedToken(pair.token0)
  const currency1 = unwrappedToken(pair.token1)

  const _8e8 = '888,888,888.888'
  const _8e5 = '888,888.888'

  const rewardedSone = _8e5
  const availableReward = _8e5

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
          <CurrencyLogoDouble currency0={currency0} currency1={currency1} size={22} />
          <PairName
            style={{
              marginLeft: isUpToExtraSmall ? '0' : '20px'
            }}
            text="LP Token"
          >{`${currency0.symbol}-${currency1.symbol}`}</PairName>
        </RowFitContent>
        <FlexibleRow gap={isUpToExtraSmall ? '0' : '10px'} justify="center">
          <Column width="fit-content" align="center">
            <Text color={theme.text8Sone} fontSize={isUpToSmall ? '13px' : '16px'}>
              My Staked LP Token
            </Text>
            <TextLpTokens>{_8e8}</TextLpTokens>
          </Column>
        </FlexibleRow>
        <Row gap="10px" justify="flex-end">
          <Column width="fit-content" justify="center" align="center">
            <TextPercentage onClick={() => alert('Not implemented yet!')}>88.88%</TextPercentage>
            <TextAPY>APY</TextAPY>
          </Column>
          <DownIcon
            active={isShowDetailedSection ? 0 : 1}
            onClick={() =>
              setDetailPair(prev => (prev === pair.liquidityToken.address ? undefined : pair.liquidityToken.address))
            }
          />
        </Row>
      </SummarySection>
      {isShowDetailedSection && (
        <>
          <MyStakingDetailedSection gap="15px">
            <Column>
              <RowReward justify="center" gap="4rem">
                <RowFixed>
                  <DetailedSectionIcon src={SoneLogoSvg} alt="sone-logo-svg" />
                  <Column>
                    <RewardedSoneValue style={{ fontSize: valueFontSize }}>{rewardedSone}</RewardedSoneValue>
                    <RewardedSone style={{ fontSize: titleFontSize }}>Rewarded SONE</RewardedSone>
                  </Column>
                </RowFixed>
                <RowFixed>
                  <DetailedSectionIcon src={TickIconSvg} alt="tick-icon-svg" />
                  <Column>
                    <RewardedSoneValue style={{ fontSize: valueFontSize }}>{availableReward}</RewardedSoneValue>
                    <RewardedSone style={{ fontSize: titleFontSize }}>Available Reward</RewardedSone>
                  </Column>
                </RowFixed>
              </RowReward>
              <RowButtons justify="center" gap="2rem">
                {/* TODO: Specific pair. */}
                <ButtonUnstake as={Link} to="/my-account/unstake">
                  Unstake
                </ButtonUnstake>
                {/* TODO: Specific pair. */}
                <ButtonStake as={Link} to="/staking">
                  Stake More
                </ButtonStake>
                {/* TODO: ??? */}
                <ButtonRequestReward>Request Reward</ButtonRequestReward>
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
