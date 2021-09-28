import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import Settings from '../Settings'
import { RowBetween } from '../Row'
import Column from '../Column'
import AppVector from './AppVector'
import { TransactionType } from '../../state/transactions/types'

const StyledHeader = styled.div`
  padding: 23px 30px 26px;
  width: 100%;
  max-width: 602px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 23px 20px 17px;
  `};
`

const Title = styled.div`
  color: ${({ theme }) => theme.text6Sone};
  font-weight: 700;
  font-size: 40px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 20px;
  `};
`

const Description = styled.div`
  color: ${({ theme }) => theme.text4Sone};
  font-weight: 500;
  font-size: 16px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;
  `};
`

const TitleDescWrapper = styled(Column)`
  margin-left: 20px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-left: 7px;
  `};
`

export default function AppBodyTitleDescriptionSettings({ transactionType }: { transactionType: TransactionType }) {
  const { t } = useTranslation()
  const title =
    transactionType === TransactionType.SWAP
      ? t('swap_noun')
      : transactionType === TransactionType.ADD_ONE_TOKEN || transactionType === TransactionType.ADD_TWO_TOKENS
      ? t('add_liquidity')
      : transactionType === TransactionType.WITHDRAW
      ? t('withdraw_liquidity')
      : transactionType === TransactionType.STAKE
      ? t('stake')
      : transactionType === TransactionType.UNSTAKE
      ? t('unstake')
      : null
  const description =
    transactionType === TransactionType.SWAP
      ? t('swap_description')
      : transactionType === TransactionType.ADD_ONE_TOKEN || transactionType === TransactionType.ADD_TWO_TOKENS
      ? t('add_liquidity_description')
      : transactionType === TransactionType.WITHDRAW
      ? t('withdraw_liquidity_description')
      : transactionType === TransactionType.STAKE
      ? t('stake_description')
      : transactionType === TransactionType.UNSTAKE
      ? t('unstake_description')
      : null

  return (
    <StyledHeader>
      <RowBetween>
        <AppVector transactionType={transactionType} />
        <TitleDescWrapper>
          <Title>{title}</Title>
          <Description>{description}</Description>
        </TitleDescWrapper>
        {(transactionType === TransactionType.SWAP ||
          transactionType === TransactionType.ADD_ONE_TOKEN ||
          transactionType === TransactionType.ADD_TWO_TOKENS ||
          transactionType === TransactionType.WITHDRAW) && <Settings transactionType={transactionType} />}
      </RowBetween>
    </StyledHeader>
  )
}
