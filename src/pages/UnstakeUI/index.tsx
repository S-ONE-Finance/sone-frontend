import React, { useState } from 'react'
import { AppBody, StyledPadding } from '../../theme'
import { TransactionType } from '../../state/transactions/types'
import AppBodyTitleDescriptionSettings from '../../components/AppBodyTitleDescriptionSettings'
import { AutoColumn } from '../../components/Column'
import { useTranslation } from 'react-i18next'
import useAddedLiquidityPairs from '../../hooks/useAddedLiquidityPairs'
import PanelPairInput from '../../components/PanelPairInput'
import { ButtonPrimary } from '../../components/Button'
import Row, { RowFixed } from '../../components/Row'
import { Text } from 'rebass'
import styled from 'styled-components'
import CurrencyLogo from '../../components/CurrencyLogo'
import UnstakeTxSectionDetails from './UnstakeTxSectionDetails'
import MyReward from 'components/MyReward'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'

const HeadingSection = styled(AutoColumn)`
  margin: 30px 0;
`

const Heading = styled(Text)`
  color: ${({ theme }) => theme.text6Sone};
  font-size: 2.5rem;
  font-weight: 700;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 1rem;
  `}
`

const SubHeading = styled(Text)`
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

  const [typedValue, setTypedValue] = useState('')

  const onUserInput = (theNewOne: string) => {
    setTypedValue(theNewOne)
  }

  const lpTokenBalance = 888888888.888

  const onMax = () => {
    setTypedValue(lpTokenBalance.toString())
  }

  const [isLoading, allPairs] = useAddedLiquidityPairs()

  const showDetails = true

  return (
    <>
      {isUpToExtraSmall ? (
        <Row justify="center" gap="0.75rem" style={{ marginBottom: '1.75rem' }}>
          <RowFixed gap="0.75rem">
            <CurrencyLogo address="SONE" size="3rem" sizeMobile="2rem" />
            <AutoColumn justify="center">
              <Heading>{t('LP TOKEN')}</Heading>
              <SubHeading>ETH-DAI LP</SubHeading>
            </AutoColumn>
          </RowFixed>
        </Row>
      ) : (
        <HeadingSection justify="center" gap="0.125rem">
          <RowFixed gap="1.25rem">
            <CurrencyLogo address="SONE" size="3rem" sizeMobile="2rem" />
            <Heading>{t('LP TOKEN')}</Heading>
          </RowFixed>
          <SubHeading>ETH-DAI LP</SubHeading>
        </HeadingSection>
      )}
      <AutoColumn gap={isUpToExtraSmall ? '1.25rem' : '35px'} style={{ width: '100%' }} justify="center">
        <AppBody>
          <AppBodyTitleDescriptionSettings transactionType={TransactionType.UNSTAKE} />
          <StyledPadding>
            <AutoColumn gap={isUpToExtraSmall ? '1.5rem' : '35px'}>
              <PanelPairInput
                pair={allPairs.length ? allPairs[0] : undefined}
                value={typedValue}
                onUserInput={onUserInput}
                balance={lpTokenBalance}
                onMax={onMax}
                label={t('Input')}
                customBalanceText={t('Staked') + ':'}
              />
              <ButtonPrimary>{t('Unstake')}</ButtonPrimary>
              {/*<ButtonPrimary disabled={true}>{t('Enter an amount')}</ButtonPrimary>*/}
              {showDetails && <UnstakeTxSectionDetails />}
            </AutoColumn>
          </StyledPadding>
        </AppBody>
        <MyReward />
      </AutoColumn>
    </>
  )
}
