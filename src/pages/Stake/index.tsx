import React from 'react'
import Row, { RowFixed } from '../../components/Row'
import CurrencyLogo from '../../components/CurrencyLogo'
import { AutoColumn } from '../../components/Column'
import { AppBody, StyledPadding } from '../../theme'
import AppBodyTitleDescriptionSettings from '../../components/AppBodyTitleDescriptionSettings'
import { TransactionType } from '../../state/transactions/types'
import PanelPairInput from '../../components/PanelPairInput'
import { ButtonPrimary } from '../../components/Button'
import MyReward from '../../components/MyReward'
import { useTranslation } from 'react-i18next'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import { Heading, HeadingSection, SubHeading } from '../Unstake'
import StakeTxSectionDetails from './StakeTxSectionDetails'
// import { useShowTransactionDetailsManager } from '../../state/user/hooks'

export default function Staking() {
  const { t } = useTranslation()
  const isUpToExtraSmall = useIsUpToExtraSmall()

  // const [isShowTransactionDetails, toggleIsShowTransactionDetails] = useShowTransactionDetailsManager()

  const typedValue = ''
  const onUserInput = () => {}
  const fullBalance = 888888888.888
  const onMax = () => {}
  const error = false
  const onStake = () => {}
  const showDetails = true
  const farm: any = undefined
  const symbol = 'ETH-DAI'

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
          <AppBodyTitleDescriptionSettings transactionType={TransactionType.STAKE} />
          <StyledPadding>
            <AutoColumn gap={isUpToExtraSmall ? '1.5rem' : '35px'}>
              <PanelPairInput
                value={typedValue}
                onUserInput={onUserInput}
                balance={fullBalance}
                onMax={onMax}
                label={t('input')}
                customBalanceText={t('LP Balance') + ':'}
              />
              {error ? (
                <ButtonPrimary disabled={true}>{error}</ButtonPrimary>
              ) : (
                <ButtonPrimary onClick={onStake}>{t('stake')}</ButtonPrimary>
              )}
              {showDetails && <StakeTxSectionDetails />}
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
