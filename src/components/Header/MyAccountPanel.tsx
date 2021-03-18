// MyAccountPanel is used only in Header component.
import React from 'react'
import styled from 'styled-components'
import { lighten } from 'polished'
import { useTranslation } from 'react-i18next'
import { useWeb3React } from '@web3-react/core'

import { useWalletModalToggle } from '../../state/application/hooks'
import { useActiveWeb3React } from '../../hooks'

import { NetworkContextName } from '../../constants'

import Column from '../Column'
import { TYPE } from '../../theme'
import { ButtonPrimary } from '../Button'
import RecentTransactions from './RecentTransactions'
import { shortenAddress } from '../../utils'

const MyAccountPanelWrapper = styled.div`
  cursor: default;
  display: block;
  width: 350px;
  overflow: hidden;

  border-radius: inherit;

  // No need to use "media" here anymore because "MyAccountPanel" is no longer used for mobile version. 
  // ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  //   width: calc(100vw - 2rem);
  // `}
`

const ColumnWrapper = styled(Column)<{ padding?: string }>`
  & > * {
    padding: 1rem;
  }

  & > *:not(:last-child) {
    border-bottom: ${({ theme }) => `1px solid ${theme.divider1Sone}`};
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

const MyAccountButton = styled(ButtonPrimary)`
  background-color: ${({ theme }) => theme.red1Sone};
  color: #ffffff;
  width: 100%;
  height: 50px;
  padding: 0;
  font-size: 18px;
  font-weight: 500;
  border-radius: 30px;

  :hover,
  :focus {
    background-color: ${({ theme }) => theme.red1Sone};
  }
`

const PaddingColumn = styled(Column)`
  padding: 1.5rem 1rem;
`

export default function MyAccountPanel() {
  const { chainId, account, connector } = useActiveWeb3React()
  const { t } = useTranslation()
  const toggleWalletModal = useWalletModalToggle()

  const { active } = useWeb3React()
  const contextNetwork = useWeb3React(NetworkContextName)

  if (!contextNetwork.active && !active) {
    return null
  }

  console.log(`account`, account)
  console.log(`chainId`, chainId)
  console.log(`connector`, connector)

  return (
    <MyAccountPanelWrapper>
      <ColumnWrapper>
        <Column>
          <TYPE.black fontSize={16}>{t('address')}:</TYPE.black>
          {/*<TYPE.subText marginTop={'0.25rem'}>0x8DE6...e4AE0x8DE6e4AEe4AEe4AE</TYPE.subText>*/}
          <TYPE.subText marginTop={'0.25rem'}>{account && shortenAddress(account, 14)}</TYPE.subText>
          <TextBoxChangeAccount onClick={toggleWalletModal}>{t('changeAccount')}</TextBoxChangeAccount>
        </Column>
        <PaddingColumn>
          <MyAccountButton>{t('myAccount')}</MyAccountButton>
        </PaddingColumn>
        <RecentTransactions />
      </ColumnWrapper>
    </MyAccountPanelWrapper>
  )
}
