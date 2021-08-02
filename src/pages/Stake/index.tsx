import React from 'react'
import Row, { RowFixed } from '../../components/Row'
import CurrencyLogo from '../../components/CurrencyLogo'
import { AutoColumn, ColumnCenter } from '../../components/Column'
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
import { useShowTransactionDetailsManager } from '../../state/user/hooks'
import { ClickableText } from '../Pool/styleds'
import { ChevronDown, ChevronUp } from 'react-feather'
import useTheme from '../../hooks/useTheme'
import LiquidityProviderTokenLogo from '../../components/LiquidityProviderTokenLogo'

export default function Staking() {
  const { t } = useTranslation()
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const mobile13Desktop16 = isUpToExtraSmall ? '13px' : '16px'
  const theme = useTheme()

  const [isShowTransactionDetails, toggleIsShowTransactionDetails] = useShowTransactionDetailsManager()

  const typedValue = ''
  const onUserInput = () => {}
  const lpBalance = 888888888.888
  const onMax = () => {}
  const error = false
  const onStake = () => {}
  const farm: any = 1
  const symbol = 'ETH-DAI'

  return (
    <>
      {isUpToExtraSmall ? (
        <Row justify="center" gap="0.75rem" style={{ marginBottom: '1.75rem' }}>
          <RowFixed gap="0.75rem">
            {/* TODO: address0 & address1. */}
            <LiquidityProviderTokenLogo size={44} sizeMobile={28} main={false} />
            <AutoColumn justify="center">
              <Heading>{t('LP TOKEN')}</Heading>
              <SubHeading>{symbol} LP</SubHeading>
            </AutoColumn>
          </RowFixed>
        </Row>
      ) : (
        <HeadingSection justify="center" gap="0.125rem">
          <RowFixed gap="1.25rem">
            {/* TODO: address0 & address1. */}
            <LiquidityProviderTokenLogo size={44} sizeMobile={28} main={false} />
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
                balance={lpBalance}
                onMax={onMax}
                label={t('input')}
                customBalanceText={t('LP Balance') + ':'}
              />
              {error ? (
                <ButtonPrimary disabled={true}>{error}</ButtonPrimary>
              ) : (
                <ButtonPrimary onClick={onStake}>{t('stake')}</ButtonPrimary>
              )}
              {farm && <StakeTxSectionDetails />}
              {farm && !isShowTransactionDetails && (
                <ColumnCenter>
                  <ClickableText
                    fontSize={mobile13Desktop16}
                    fontWeight={500}
                    color={theme.text5Sone}
                    onClick={toggleIsShowTransactionDetails}
                  >
                    {t('show_more_information')} <ChevronDown size={12} />
                  </ClickableText>
                </ColumnCenter>
              )}
              {farm && isShowTransactionDetails && (
                <ColumnCenter>
                  <ClickableText
                    fontSize={mobile13Desktop16}
                    fontWeight={500}
                    color={theme.text5Sone}
                    onClick={toggleIsShowTransactionDetails}
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
            farm?.userInfo?.sushiHarvested === undefined ? undefined : +(+farm.userInfo.sushiHarvested).toFixed(3)
          }
        />
      </AutoColumn>
    </>
  )
}
