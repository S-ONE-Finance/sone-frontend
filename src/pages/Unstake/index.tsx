import React, { useEffect, useMemo, useState } from 'react'
import { AppBody, StyledPadding } from '../../theme'
import { TransactionType } from '../../state/transactions/types'
import AppBodyTitleDescriptionSettings from '../../components/AppBodyTitleDescriptionSettings'
import { AutoColumn } from '../../components/Column'
import { useTranslation } from 'react-i18next'
import PanelPairInput from '../../components/PanelPairInput'
import { ButtonPrimary } from '../../components/Button'
import Row, { RowBetween, RowFixed } from '../../components/Row'
import { Text } from 'rebass'
import styled from 'styled-components'
import UnstakeTxSectionDetails from './UnstakeTxSectionDetails'
import MyReward from 'components/MyReward'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import { getBalanceNumber, getBalanceStringCommas } from '../../utils/formatNumber'
import { useParams } from 'react-router-dom'
import { Farm, PoolInfo, Token, UserInfo } from '@s-one-finance/sdk-core'
import useFarm from '../../hooks/staking/useFarm'
import useUnstakeHandler from '../../hooks/staking/useUnstakeHandler'
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../components/TransactionConfirmationModal'
import { TruncatedText } from '../../components/swap/styleds'
import useTheme from '../../hooks/useTheme'
import LiquidityProviderTokenLogo from '../../components/LiquidityProviderTokenLogo'
import { getNumberCommas } from '../../utils/formatNumber'
import useLpTokenBalance from '../../hooks/staking/useLpTokenBalance'
import usePendingReward from '../../hooks/staking/usePendingReward'
import { useBlockNumber } from '../../state/application/hooks'
import BigNumber from 'bignumber.js'
import { tryParseAmount } from '../../state/swap/hooks'
import { useActiveWeb3React } from '../../hooks'

export const HeadingSection = styled(AutoColumn)`
  margin: 30px 0;
`

export const Heading = styled(Text)`
  color: ${({ theme }) => theme.text6Sone};
  font-size: 2.5rem;
  font-weight: 700;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 1rem;
  `}
`

export const SubHeading = styled(Text)`
  color: ${({ theme }) => theme.text4Sone};
  font-size: 1.125rem;
  font-weight: 400;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 0.75rem;
  `}
`

export default function Unstake() {
  const { t } = useTranslation()
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const { chainId } = useActiveWeb3React()

  const { farmId } = useParams() as any
  const farm: Farm | undefined = useFarm(farmId)
  const amountStaked = farm?.userInfo?.amount
  const fullBalance = useMemo(() => {
    return amountStaked === undefined ? undefined : getBalanceNumber(amountStaked)
  }, [amountStaked])

  const [typedValue, setTypedValue] = useState('')

  const onUserInput = (theNewOne: string) => {
    setTypedValue(theNewOne)
  }

  const onMax = () => {
    if (fullBalance) {
      setTypedValue(fullBalance.toString())
    }
  }

  const { token0, token1 } = farm?.liquidityPair || {}

  // Đã fix cứng lp token decimals = 18
  const tryParse = tryParseAmount(
    typedValue,
    farm && chainId && farm.pairAddress ? new Token(chainId, farm.pairAddress, 18) : undefined
  )

  const error: string | undefined =
    typedValue === '' || +typedValue === 0 || tryParse === undefined
      ? t('enter_an_amount')
      : fullBalance !== undefined && +typedValue > fullBalance
      ? t('Insufficient LP Token')
      : undefined

  const { symbol } = farm || {
    symbol: '--'
  }

  const [totalLpToken, setTotalLpToken] = useState('0')
  const [remainStakedLp, setRemainStakedLp] = useState('0')
  const [availableReward, setAvailableReward] = useState('0')

  const tokenBalance = useLpTokenBalance(farm?.pairAddress)
  const pendingReward = usePendingReward(Number(farm?.id))
  const block = useBlockNumber()

  useEffect(() => {
    const poolInfo = new PoolInfo(farm)
    if (typedValue && farm?.userInfo) {
      const userInfo = new UserInfo(poolInfo, farm.userInfo)
      const newTotalLPToken = userInfo.getTotalLPTokenAfterUnstake(
        tokenBalance ? tokenBalance.toString() : '0',
        new BigNumber(typedValue).times(new BigNumber(10).pow(18)).toString()
      )
      setTotalLpToken(newTotalLPToken)
      const newTotalStaked = userInfo.getRemainStakedValueAfterUnstake(
        new BigNumber(typedValue).times(new BigNumber(10).pow(18)).toString()
      )
      setRemainStakedLp(newTotalStaked)
      setAvailableReward(pendingReward.toString())
    }
  }, [typedValue, farm, block, tokenBalance, pendingReward])

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

  const _onUnstake = useUnstakeHandler(Number(farmId))
  const onUnstake = async () => {
    if (!error) {
      setAttemptingTxn(true)
      const tx = await _onUnstake(typedValue, symbol)
      setAttemptingTxn(false)
      if (tx) {
        setTxHash(tx.hash)
      } else {
        setTxHash('')
      }
    }
  }

  const ModalHeader = () => {
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
  }

  const ModalFooter = () => {
    const theme = useTheme()
    const mobile13Desktop16 = isUpToExtraSmall ? 13 : 16

    return (
      <>
        <AutoColumn gap={isUpToExtraSmall ? '10px' : '15px'}>
          <RowBetween>
            <RowFixed>
              <Text fontWeight={500} fontSize={mobile13Desktop16} color={theme.text6Sone}>
                {t('after_unstaking_you_will_have')}
              </Text>
            </RowFixed>
          </RowBetween>
          <RowBetween>
            <RowFixed>
              <Text fontWeight={500} fontSize={mobile13Desktop16} color={theme.text4Sone}>
                {t('total_lp_token')}
              </Text>
            </RowFixed>
            <Text fontWeight={700} fontSize={mobile13Desktop16} color={theme.text6Sone}>
              {getBalanceStringCommas(totalLpToken)} LP
            </Text>
          </RowBetween>
          <RowBetween>
            <RowFixed>
              <Text fontWeight={500} fontSize={mobile13Desktop16} color={theme.text4Sone}>
                {t('remain_staked_lp')}
              </Text>
            </RowFixed>
            <Text fontWeight={700} fontSize={mobile13Desktop16} color={theme.text6Sone}>
              {getBalanceStringCommas(remainStakedLp)} LP
            </Text>
          </RowBetween>
          <RowBetween>
            <RowFixed>
              <Text fontWeight={500} fontSize={mobile13Desktop16} color={theme.text4Sone}>
                {t('available_reward')}
              </Text>
            </RowFixed>
            <Text fontWeight={700} fontSize={mobile13Desktop16} color={theme.text6Sone}>
              {getBalanceStringCommas(availableReward)} SONE
            </Text>
          </RowBetween>
        </AutoColumn>

        {error ? (
          <ButtonPrimary disabled>{error}</ButtonPrimary>
        ) : (
          <ButtonPrimary onClick={onUnstake}>
            <Text fontSize={isUpToExtraSmall ? 16 : 20} fontWeight={700}>
              {t('unstake')}
            </Text>
          </ButtonPrimary>
        )}
      </>
    )
  }

  // Not show AppVector ==> `transactionType={undefined}`.
  const modalContent = () => (
    <ConfirmationModalContent
      title={t('You will receive')}
      onDismiss={handleDismissConfirmation}
      topContent={ModalHeader}
      bottomContent={ModalFooter}
      transactionType={undefined}
    />
  )

  const pendingText = `Unstaking ${typedValue} LP`

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
      {isUpToExtraSmall ? (
        <Row justify="center" gap="0.75rem" style={{ margin: '1.25rem 0 1.75rem 0' }}>
          <RowFixed gap="0.75rem">
            <LiquidityProviderTokenLogo
              address0={token0 && token0.id}
              address1={token1 && token1.id}
              size={44}
              sizeMobile={28}
              main={false}
            />
            <AutoColumn justify="center">
              <Heading>{t('LP TOKEN')}</Heading>
              <SubHeading>{symbol} LP</SubHeading>
            </AutoColumn>
          </RowFixed>
        </Row>
      ) : (
        <HeadingSection justify="center" gap="0.125rem">
          <RowFixed gap="1.25rem">
            <LiquidityProviderTokenLogo
              address0={token0 && token0.id}
              address1={token1 && token1.id}
              size={44}
              sizeMobile={28}
              main={false}
            />
            <Heading>{t('LP TOKEN')}</Heading>
          </RowFixed>
          <SubHeading>{symbol} LP</SubHeading>
        </HeadingSection>
      )}
      <AppBody>
        <AppBodyTitleDescriptionSettings transactionType={TransactionType.UNSTAKE} />
        <StyledPadding>
          <AutoColumn gap={isUpToExtraSmall ? '1.5rem' : '2.1875rem'}>
            <PanelPairInput
              value={typedValue}
              onUserInput={onUserInput}
              balance={fullBalance}
              onMax={onMax}
              label={t('input')}
              customBalanceText={t('staked') + ':'}
              address0={token0 && token0.id}
              address1={token1 && token1.id}
            />
            {error ? (
              <ButtonPrimary disabled={true}>{error}</ButtonPrimary>
            ) : (
              <ButtonPrimary
                onClick={() => {
                  setShowConfirm(true)
                }}
              >
                {t('unstake')}
              </ButtonPrimary>
            )}
            {!error && (
              <UnstakeTxSectionDetails
                totalLpToken={totalLpToken}
                remainStakedLp={remainStakedLp}
                availableReward={availableReward}
              />
            )}
          </AutoColumn>
        </StyledPadding>
      </AppBody>
      <MyReward
        myReward={farm?.userInfo?.soneHarvested === undefined ? undefined : +(+farm.userInfo.soneHarvested).toFixed(3)}
      />
    </>
  )
}
