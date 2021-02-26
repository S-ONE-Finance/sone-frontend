// MyAccountPanel is used only in Header component
import React from 'react'
import styled from 'styled-components'
import { lighten } from 'polished'

import Column from '../Column'
import Web3Status from '../Web3Status'
import { TYPE } from '../../theme'

const MyAccountPanelWrapper = styled.div`
  cursor: default;
  display: block;
  width: 350px;
  padding: 1rem;
  border-radius: inherit;
  box-shadow: 0px 16px 20px rgba(0, 0, 0, 0.2);

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: calc(100vw - 2rem);
  `}
`

const ColumnWrapper = styled(Column)`
  & > *:not(:last-child) {
    padding-bottom: 1.25rem;
    border-bottom: ${({ theme }) => `1px solid ${theme.divider1Sone}`};
  }

  & > *:not(:first-child) {
    margin-top: 1.25rem;
  }
`

const TextBoxChangeAccount = styled.div`
  width: 100%;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  color: #3faab0;
  padding-top: 1rem;
  cursor: pointer;

  :hover {
    color: ${`${lighten(0.05, '#3FAAB0')}`};
  }
`

export default function MyAccountPanel() {
  return (
    <MyAccountPanelWrapper>
      <ColumnWrapper>
        <Column>
          <TYPE.black fontSize={16}>Address:</TYPE.black>
          <TYPE.subText marginTop={'0.25rem'}>0x8DE6...e4AE0x8DE6e4AEe4AEe4AE</TYPE.subText>
          <TextBoxChangeAccount>Change Account</TextBoxChangeAccount>
        </Column>
        <Column>
          <Web3Status />
        </Column>
        <Column>
          <TYPE.red1Sone>Recent Transactions</TYPE.red1Sone>
          <TYPE.subText marginTop={'0.75rem'}>You don&apos;t have any transactions recently...</TYPE.subText>
        </Column>
      </ColumnWrapper>
    </MyAccountPanelWrapper>
  )
}
