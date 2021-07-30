import React, { useMemo, useState } from 'react'
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
import CurrencyLogo from '../../components/CurrencyLogo'
import UnstakeTxSectionDetails from './UnstakeTxSectionDetails'
import MyReward from 'components/MyReward'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import { getBalanceNumber } from '../../hooks/masterfarmer/utils'
import { useParams } from 'react-router-dom'
import { Farm } from '@s-one-finance/sdk-core'
import useFarm from '../../hooks/masterfarmer/useFarm'
import useUnstake from '../../hooks/masterfarmer/useUnstake'
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../components/TransactionConfirmationModal'
import { TruncatedText } from '../../components/swap/styleds'
import useTheme from '../../hooks/useTheme'

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

  const { farmId } = useParams() as any
  const farm: Farm | undefined = useFarm('' + farmId)
  const amountStaked = farm?.userInfo?.amount
  const fullBalance = useMemo(() => {
    return amountStaked === undefined ? undefined : getBalanceNumber(amountStaked)
  }, [amountStaked])

  const [typedValue, setTypedValue] = useState('')

  const onUserInput = (theNewOne: string) => {
    setTypedValue(theNewOne)
  }

  const onMax = () => {
    setTypedValue((fullBalance ?? 0).toString())
  }

  const [pendingUnstakeTx, setPendingUnstakeTx] = useState(false)

  const error: string | undefined =
    typedValue === '' || +typedValue === 0
      ? t('Enter an amount')
      : fullBalance !== undefined && +typedValue > fullBalance
      ? t('Insufficient LP Token')
      : pendingUnstakeTx
      ? t('Unstaking...')
      : undefined

  const showDetails = error === undefined || error === t('Unstaking...')

  const { symbol } = farm || {
    symbol: '--'
  }

  const { onUnstake: _onUnstake } = useUnstake(Number(farmId))

  const onUnstake = async () => {
    if (typedValue && parseFloat(typedValue) > 0) {
      setPendingUnstakeTx(true)
      await _onUnstake(typedValue, symbol)
      setPendingUnstakeTx(false)
    }
  }

  const [showConfirm, setShowConfirm] = useState(false)
  const [attemptingTxn, setAttemptingTxn] = useState(false) // Clicked confirm.
  const [txHash, setTxHash] = useState('')

  const handleDismissConfirmation = () => {
    setShowConfirm(false)
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      setTypedValue('')
    }
    setTxHash('')
  }

  const ModalHeader = () => {
    return (
      <AutoColumn gap={isUpToExtraSmall ? '10px' : '15px'} style={{ marginTop: '20px' }}>
        <RowBetween align="flex-end">
          <RowFixed gap="0">
            <TruncatedText fontSize={isUpToExtraSmall ? '20px' : '28px'} fontWeight={600} style={{ zIndex: 1 }}>
              888,888,888.888888888
            </TruncatedText>
          </RowFixed>
          {/* zIndex để hiển thị đè lên SwapVector. */}
          <RowFixed gap="0" style={{ height: '100%', zIndex: 1 }} align="center">
            <CurrencyLogo address="SONE" size="24px" style={{ marginRight: '5px' }} />
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
                {t('After unstaking, you will have')}
              </Text>
            </RowFixed>
          </RowBetween>
          <RowBetween>
            <RowFixed>
              <Text fontWeight={500} fontSize={mobile13Desktop16} color={theme.text4Sone}>
                {t('Total LP Token')}
              </Text>
            </RowFixed>
            <Text fontWeight={700} fontSize={mobile13Desktop16} color={theme.text6Sone}>
              10,000,000 LP
            </Text>
          </RowBetween>
          <RowBetween>
            <RowFixed>
              <Text fontWeight={500} fontSize={mobile13Desktop16} color={theme.text4Sone}>
                {t('Remain Staked LP')}
              </Text>
            </RowFixed>
            <Text fontWeight={700} fontSize={mobile13Desktop16} color={theme.text6Sone}>
              10,000,000 LP
            </Text>
          </RowBetween>
          <RowBetween>
            <RowFixed>
              <Text fontWeight={500} fontSize={mobile13Desktop16} color={theme.text4Sone}>
                {t('available_reward')}
              </Text>
            </RowFixed>
            <Text fontWeight={700} fontSize={mobile13Desktop16} color={theme.text6Sone}>
              10,000,000 SONE
            </Text>
          </RowBetween>
        </AutoColumn>

        <ButtonPrimary onClick={onUnstake}>
          <Text fontSize={isUpToExtraSmall ? 16 : 20} fontWeight={700}>
            {t('Unstake')}
          </Text>
        </ButtonPrimary>
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

  const pendingText = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt, quos.'

  return (
    <>
      <TransactionConfirmationModal
        isOpen={showConfirm}
        onDismiss={handleDismissConfirmation}
        hash={txHash}
        content={modalContent}
        attemptingTxn={attemptingTxn}
        pendingText={pendingText}
      />
      {isUpToExtraSmall ? (
        <Row justify="center" gap="0.75rem" style={{ marginBottom: '1.75rem' }}>
          <RowFixed gap="0.75rem">
            <CurrencyLogo address="SONE" size="3rem" sizeMobile="2rem" />
            <AutoColumn justify="center">
              <Heading>{t('LP TOKEN')}</Heading>
              <SubHeading>{symbol} LP</SubHeading>
            </AutoColumn>
          </RowFixed>
        </Row>
      ) : (
        <HeadingSection justify="center" gap="0.125rem">
          <RowFixed gap="1.25rem">
            <CurrencyLogo address="SONE" size="3rem" sizeMobile="2rem" />
            <Heading>{t('LP TOKEN')}</Heading>
          </RowFixed>
          <SubHeading>{symbol} LP</SubHeading>
        </HeadingSection>
      )}
      <AppBody>
        <AppBodyTitleDescriptionSettings transactionType={TransactionType.UNSTAKE} />
        <StyledPadding>
          <AutoColumn gap={isUpToExtraSmall ? '1.5rem' : '35px'}>
            <PanelPairInput
              value={typedValue}
              onUserInput={onUserInput}
              balance={fullBalance}
              onMax={onMax}
              label={t('input')}
              customBalanceText={t('staked') + ':'}
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
            {showDetails && <UnstakeTxSectionDetails unstakeAmount={+typedValue} farm={farm} />}
          </AutoColumn>
        </StyledPadding>
      </AppBody>
      <MyReward
        myReward={
          farm?.userInfo?.sushiHarvested === undefined ? undefined : +(+farm.userInfo.sushiHarvested).toFixed(3)
        }
      />
    </>
  )
}
