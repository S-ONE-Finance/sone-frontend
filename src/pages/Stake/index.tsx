import React, { useCallback, useEffect, useState } from 'react'
import Row, { RowBetween, RowFixed } from '../../components/Row'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import { AppBody, StyledPadding } from '../../theme'
import AppBodyTitleDescriptionSettings from '../../components/AppBodyTitleDescriptionSettings'
import { TransactionType } from '../../state/transactions/types'
import PanelPairInput from '../../components/PanelPairInput'
import { ButtonPrimary } from '../../components/Button'
import MyReward from '../../components/MyReward'
import { useTranslation } from 'react-i18next'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import { Heading } from '../Unstake'
import StakeTxSectionDetails1 from './StakeTxSectionDetails1'
import { useGuideStepManager, useShowTransactionDetailsManager } from '../../state/user/hooks'
import { ClickableText } from '../Pool/styleds'
import { ChevronDown, ChevronUp } from 'react-feather'
import useTheme from '../../hooks/useTheme'
import LiquidityProviderTokenLogo from '../../components/LiquidityProviderTokenLogo'
import StakeTxSectionDetails2 from './StakeTxSectionDetails2'
import { useParams } from 'react-router-dom'
import { ChainId, Farm, PoolInfo, UserInfo } from '@s-one-finance/sdk-core'
import useFarm from '../../hooks/staking/useFarm'
import { useBlockNumber, useWalletModalToggle } from '../../state/application/hooks'
import { useActiveWeb3React } from '../../hooks'
import useLpTokenBalance from '../../hooks/staking/useLpTokenBalance'
import { getBalanceNumber, getBalanceStringCommas, getNumberCommas } from '../../utils/formatNumber'
import BigNumber from 'bignumber.js'
import useStakeHandler from '../../hooks/staking/useStakeHandler'
import { TruncatedText } from '../../components/swap/styleds'
import { Text } from 'rebass'
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../components/TransactionConfirmationModal'
import useAllowance from '../../hooks/staking/useAllowance'
import useApproveHandler from '../../hooks/staking/useApproveHandler'
import { OpenGuide, StakeStep1, StakeStep2, StakeStep3 } from '../../components/lib/mark/components'
import { CONFIG_MASTER_FARMER } from '../../constants'
import BubbleMessage from 'components/BubbleMessage'

export default function Staking() {
  const { t } = useTranslation()
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const mobile13Desktop16 = isUpToExtraSmall ? '13px' : '16px'
  const theme = useTheme()
  const [guideStep] = useGuideStepManager()

  const [isShowRewardInformation, toggleIsShowRewardInformation] = useShowTransactionDetailsManager()

  const [isShowBubbleBonus, setIsShowBubbleBonus] = useState(true)

  const { farmId } = useParams() as any
  const farm: Farm | undefined = useFarm(farmId)

  const [typedValue, setTypedValue] = useState('')

  const { pairAddress, symbol } = farm || {}
  const lpBalanceRaw = useLpTokenBalance(pairAddress)
  const lpBalance = getBalanceNumber(lpBalanceRaw.toString())

  const toggleWalletModal = useWalletModalToggle()
  const { account, chainId } = useActiveWeb3React()

  const { token0, token1 } = farm?.liquidityPair || {}

  const [totalStakedAfterStake, setTotalStakedAfterStake] = useState<string>()
  const [earnedRewardAfterStake, setEarnedRewardAfterStake] = useState<string>()
  const [apyAfterStake, setApyAfterStake] = useState<string>()
  const totalStakedAfterStakeRender =
    totalStakedAfterStake === undefined ? '--' : getBalanceStringCommas(totalStakedAfterStake)
  const earnedRewardAfterStakeRender =
    earnedRewardAfterStake === undefined ? '--' : getBalanceStringCommas(earnedRewardAfterStake, 0)
  const apyAfterStakeRender = apyAfterStake === undefined ? '--' : getBalanceStringCommas(apyAfterStake, 0)

  const bonusMultiplier = (farm && (farm.owner as any))?.bonusMultiplier ?? 1
  const rewardPerBlock = farm && farm.rewardPerBlock * bonusMultiplier
  const totalLiquidity = farm && +farm.balanceUSD

  const block = useBlockNumber()

  useEffect(() => {
    if (typedValue === '') {
      setTotalStakedAfterStake(undefined)
      setEarnedRewardAfterStake(undefined)
      setApyAfterStake(undefined)
      return
    }
    const poolInfo = new PoolInfo(farm, CONFIG_MASTER_FARMER[chainId || (3 as ChainId)])
    if (typedValue && farm?.userInfo) {
      const userInfo = new UserInfo(poolInfo, farm.userInfo)
      const newTotalStaked = userInfo.getTotalStakedValueAfterStake(
        new BigNumber(typedValue).times(new BigNumber(10).pow(18)).toString()
      )
      setTotalStakedAfterStake(newTotalStaked)
      const newEarnedReward = userInfo.getEarnedRewardAfterStake(
        new BigNumber(typedValue).times(new BigNumber(10).pow(18)).toString(),
        block || 0
      )
      setEarnedRewardAfterStake(newEarnedReward)
      const newAPY = userInfo.getAPYAfterStake(
        new BigNumber(typedValue).times(new BigNumber(10).pow(18)).toString(),
        block || 0
      )
      setApyAfterStake(newAPY)
    }
  }, [typedValue, farm, block, chainId])

  const [showConfirm, setShowConfirm] = useState(false)
  const [attemptingTxn, setAttemptingTxn] = useState(false) // Clicked confirm.
  const [txHash, setTxHash] = useState('')

  const handleDismissConfirmation = () => {
    setShowConfirm(false)
    if (txHash) {
      setTypedValue('')
    }
    setTxHash('')
  }

  const onUserInput = (theNewOne: string) => {
    setTypedValue(theNewOne)
  }

  const onMax = () => {
    if (lpBalance) {
      setTypedValue(lpBalance.toString())
    }
  }

  const [isApproving, setIsApproving] = useState(false)
  const [isApproveTxPushed, setIsApproveTxPushed] = useState(false)
  const allowance = useAllowance(pairAddress)

  const error = !farm
    ? t('invalid_farm')
    : !account
    ? t('connect_wallet')
    : +typedValue === 0
    ? t('enter_an_amount')
    : lpBalance === undefined || new BigNumber(lpBalance).isLessThan(typedValue)
    ? t('insufficient_lp_token')
    : allowance.toString() === '0' && (isApproveTxPushed || isApproving)
    ? t('approving')
    : allowance.toString() === '0' && !isApproveTxPushed
    ? t('approve')
    : undefined

  const _onApprove = useApproveHandler(pairAddress)
  const onApprove = useCallback(
    async symbol => {
      setIsApproving(true)
      const txHash = await _onApprove(symbol)
      setIsApproving(false)
      if (txHash) {
        setIsApproveTxPushed(true)
      }
      if (txHash) {
      }
    },
    [_onApprove]
  )

  const _onStake = useStakeHandler(Number(farmId))
  const onStake = useCallback(async () => {
    if (!error && symbol) {
      setAttemptingTxn(true)
      const tx = await _onStake(typedValue, symbol)
      setAttemptingTxn(false)
      if (tx) {
        setTxHash(tx.hash)
      } else {
        setTxHash('')
      }
    }
  }, [_onStake, error, symbol, typedValue])

  const pendingText = t('staking_123_lp', { amount: typedValue })

  const ModalHeader = useCallback(
    function ModalHeader() {
      return (
        <AutoColumn gap={isUpToExtraSmall ? '10px' : '15px'} style={{ marginTop: '20px' }}>
          <RowBetween align="flex-end">
            <RowFixed gap="0">
              <TruncatedText fontSize={isUpToExtraSmall ? '20px' : '28px'} fontWeight={600} style={{ zIndex: 1 }}>
                {getNumberCommas(typedValue)}
              </TruncatedText>
            </RowFixed>
            {/* zIndex để hiển thị đè lên SwapVector. */}
            <RowFixed gap="0" style={{ height: '100%', zIndex: 1 }} align="center">
              <LiquidityProviderTokenLogo
                address0={token0 && token0.id}
                address1={token1 && token1.id}
                size={28}
                sizeMobile={14}
                main={false}
                style={{ marginRight: '0.625rem' }}
              />
              <Text fontSize={isUpToExtraSmall ? 16 : 24} fontWeight={500}>
                LP
              </Text>
            </RowFixed>
          </RowBetween>
        </AutoColumn>
      )
    },
    [isUpToExtraSmall, token0, token1, typedValue]
  )

  const ModalFooter = useCallback(
    function ModalFooter() {
      const mobile13Desktop16 = isUpToExtraSmall ? 13 : 16

      return (
        <>
          <AutoColumn gap={isUpToExtraSmall ? '10px' : '15px'}>
            <RowBetween>
              <RowFixed>
                <Text fontWeight={500} fontSize={mobile13Desktop16} color={theme.text6Sone}>
                  {t('after_staking_you_will_have')}
                </Text>
              </RowFixed>
            </RowBetween>
            <RowBetween>
              <RowFixed>
                <Text fontWeight={500} fontSize={mobile13Desktop16} color={theme.text4Sone}>
                  {t('total_staked_value')}
                </Text>
              </RowFixed>
              <Text fontWeight={700} fontSize={mobile13Desktop16} color={theme.text6Sone}>
                {totalStakedAfterStakeRender} LP
              </Text>
            </RowBetween>
            <RowBetween>
              <RowFixed>
                <Text fontWeight={500} fontSize={mobile13Desktop16} color={theme.text4Sone}>
                  {t('earned_reward')}
                </Text>
              </RowFixed>
              <Text fontWeight={700} fontSize={mobile13Desktop16} color={theme.text6Sone}>
                {earnedRewardAfterStakeRender} LP
              </Text>
            </RowBetween>
            <RowBetween>
              <RowFixed>
                <Text fontWeight={500} fontSize={mobile13Desktop16} color={theme.text4Sone}>
                  {t('apy')}
                </Text>
              </RowFixed>
              <Text fontWeight={700} fontSize={mobile13Desktop16} color={theme.text5Sone}>
                {apyAfterStakeRender}%
              </Text>
            </RowBetween>
          </AutoColumn>

          {error ? (
            <ButtonPrimary disabled>{error}</ButtonPrimary>
          ) : (
            <ButtonPrimary onClick={onStake}>
              <Text fontSize={isUpToExtraSmall ? 16 : 20} fontWeight={700}>
                {t('stake')}
              </Text>
            </ButtonPrimary>
          )}
        </>
      )
    },
    [
      apyAfterStakeRender,
      earnedRewardAfterStakeRender,
      error,
      isUpToExtraSmall,
      onStake,
      t,
      theme.text4Sone,
      theme.text5Sone,
      theme.text6Sone,
      totalStakedAfterStakeRender
    ]
  )

  const modalContent = () => (
    <ConfirmationModalContent
      title={t('stake_confirmation')}
      onDismiss={handleDismissConfirmation}
      topContent={ModalHeader}
      bottomContent={ModalFooter}
      transactionType={undefined}
    />
  )

  return (
    <>
      <TransactionConfirmationModal
        isOpen={showConfirm}
        onDismiss={handleDismissConfirmation}
        hash={txHash}
        attemptingTxn={attemptingTxn}
        pendingText={pendingText}
        content={modalContent}
      />
      <Row
        justify="center"
        gap="0.75rem"
        style={{ margin: isUpToExtraSmall ? '1.25rem 0 1.75rem 0' : '1.75rem 0 2.25rem 0' }}
      >
        <RowFixed gap="0.75rem">
          <LiquidityProviderTokenLogo
            address0={token0 && token0.id}
            address1={token1 && token1.id}
            size={44}
            sizeMobile={28}
            main={false}
          />
          <Heading>{(symbol ? symbol : '--') + ' ' + t('lp_token').toUpperCase()}</Heading>
        </RowFixed>
      </Row>
      <AutoColumn gap={isUpToExtraSmall ? '1.25rem' : '2.1875rem'} style={{ width: '100%' }} justify="center">
        <AppBody>
          <AppBodyTitleDescriptionSettings transactionType={TransactionType.STAKE} />
          <StyledPadding>
            <AutoColumn gap={isUpToExtraSmall ? '1.5rem' : '2.1875rem'}>
              <StakeStep2>
                <PanelPairInput
                  value={Number(guideStep.step) > 1 && guideStep.screen === 'stake' ? '100,100' : typedValue}
                  onUserInput={onUserInput}
                  balance={Number(guideStep.step) > 1 && guideStep.screen === 'stake' ? '111634' : lpBalance}
                  onMax={onMax}
                  label={t('input')}
                  customBalanceText={t('lp_balance') + ':'}
                  address0={token0 && token0.id}
                  address1={token1 && token1.id}
                  decimal={18}
                />
              </StakeStep2>
              {error === t('connect_wallet') ? (
                <>
                  {Number(guideStep.step) === 1 && guideStep.screen === 'stake' ? (
                    <StakeStep1>
                      <ButtonPrimary>{error}</ButtonPrimary>
                    </StakeStep1>
                  ) : (
                    <>
                      {Number(guideStep.step) === 3 && guideStep.screen === 'stake' ? (
                        <StakeStep3>
                          <ButtonPrimary>{t('stake')}</ButtonPrimary>
                        </StakeStep3>
                      ) : (
                        <ButtonPrimary onClick={toggleWalletModal}>{error}</ButtonPrimary>
                      )}
                    </>
                  )}
                </>
              ) : error === t('approve') || error === t('approving') ? (
                <ButtonPrimary disabled={error === t('approving')} onClick={() => onApprove(symbol)}>
                  {error === t('approving')
                    ? error
                    : t('approve_eth_sone_lp_token', {
                        symbol
                      })}
                </ButtonPrimary>
              ) : error ? (
                Number(guideStep.step) === 1 && guideStep.screen === 'stake' ? (
                  <StakeStep1>
                    <ButtonPrimary>{t('connect_wallet')}</ButtonPrimary>
                  </StakeStep1>
                ) : Number(guideStep.step) === 3 && guideStep.screen === 'stake' ? (
                  <StakeStep3>
                    <ButtonPrimary>{t('stake')}</ButtonPrimary>
                  </StakeStep3>
                ) : (
                  <ButtonPrimary disabled={guideStep.screen === 'stake' ? false : true}>
                    {Number(guideStep.step) > 1 && guideStep.screen === 'stake' ? t('stake') : error}
                  </ButtonPrimary>
                )
              ) : (
                <ButtonPrimary
                  onClick={() => {
                    setShowConfirm(true)
                  }}
                >
                  {t('stake')}
                </ButtonPrimary>
              )}

              {isShowBubbleBonus && (
                <Row padding={isUpToExtraSmall ? '0 10px' : '0 30px'}>
                  <BubbleMessage bonus={bonusMultiplier} setShow={setIsShowBubbleBonus} />
                </Row>
              )}

              {!error && (
                <StakeTxSectionDetails1
                  totalStakedAfterStake={totalStakedAfterStakeRender}
                  earnedRewardAfterStake={earnedRewardAfterStakeRender}
                  apyAfterStake={apyAfterStakeRender}
                />
              )}

              {!error && !isShowRewardInformation && (
                <ColumnCenter>
                  <ClickableText
                    fontSize={mobile13Desktop16}
                    fontWeight={500}
                    color={theme.text5Sone}
                    onClick={toggleIsShowRewardInformation}
                  >
                    {t('show_more_information')} <ChevronDown size={12} />
                  </ClickableText>
                </ColumnCenter>
              )}
              {!error && isShowRewardInformation && (
                <StakeTxSectionDetails2 rewardPerBlock={rewardPerBlock} totalLiquidity={totalLiquidity} />
              )}
              {!error && isShowRewardInformation && (
                <ColumnCenter>
                  <ClickableText
                    fontSize={mobile13Desktop16}
                    fontWeight={500}
                    color={theme.text5Sone}
                    onClick={toggleIsShowRewardInformation}
                  >
                    {t('show_less')} <ChevronUp size={12} />
                  </ClickableText>
                </ColumnCenter>
              )}
            </AutoColumn>
          </StyledPadding>
        </AppBody>
        <MyReward
          myReward={
            !account || farm?.userInfo?.soneHarvested === undefined
              ? undefined
              : +(+farm.userInfo.soneHarvested).toFixed(3)
          }
        />
        <OpenGuide screen="stake" />
      </AutoColumn>
    </>
  )
}
