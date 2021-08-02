import React, { useMemo, useState } from 'react'
import { AppBody, StyledPadding } from '../../theme'
import { TransactionType } from '../../state/transactions/types'
import AppBodyTitleDescriptionSettings from '../../components/AppBodyTitleDescriptionSettings'
import { AutoColumn } from '../../components/Column'
import { useTranslation } from 'react-i18next'
import PanelPairInput from '../../components/PanelPairInput'
import { ButtonPrimary } from '../../components/Button'
import Row, { RowFixed } from '../../components/Row'
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
      ? t('Unstake')
      : undefined

  const showDetails = error === undefined || error === t('Unstake')

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

  return (
    <>
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
      <AutoColumn gap={isUpToExtraSmall ? '1.25rem' : '35px'} style={{ width: '100%' }} justify="center">
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
                <ButtonPrimary onClick={onUnstake}>{t('unstake')}</ButtonPrimary>
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
      </AutoColumn>
    </>
  )
}
