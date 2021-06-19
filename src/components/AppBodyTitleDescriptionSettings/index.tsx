import React from 'react'
import styled from 'styled-components'
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
  return (
    <StyledHeader>
      <RowBetween>
        <AppVector transactionType={transactionType} />
        <TitleDescWrapper>
          <Title>
            {transactionType === TransactionType.SWAP
              ? 'Swap'
              : transactionType === TransactionType.ADD_TWO_TOKENS || transactionType === TransactionType.ADD_ONE_TOKEN
              ? 'Add Liquidity'
              : null}
          </Title>
          <Description>
            {transactionType === TransactionType.SWAP
              ? 'Trade tokens in an instant'
              : transactionType === TransactionType.ADD_TWO_TOKENS || transactionType === TransactionType.ADD_ONE_TOKEN
              ? 'Add liquidity to receive LP tokens'
              : null}
          </Description>
        </TitleDescWrapper>
        <Settings transactionType={transactionType} />
      </RowBetween>
    </StyledHeader>
  )
}
