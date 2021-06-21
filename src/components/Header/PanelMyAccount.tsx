/**
 * PanelMyAccount is used only in Header component.
 */

// Libraries.
import React from 'react'
import styled from 'styled-components'
import { lighten } from 'polished'
import { useWeb3React } from '@web3-react/core'
import { useHistory } from 'react-router-dom'

// Hooks and Utils.
import { useWalletModalToggle } from '../../state/application/hooks'
import { useActiveWeb3React } from '../../hooks'
import { shortenAddress } from '../../utils'

// Constants.
import { NetworkContextName } from '../../constants'

// Components.
import Column from '../Column'
import { TYPE } from '../../theme'
import { ButtonPrimary } from '../Button'
import RecentTransactions from '../RecentTransactions'
import { injected, walletlink } from 'connectors'

const PanelMyAccountWrapper = styled.div`
  cursor: default;
  display: block;
  width: 350px;
  overflow: hidden;

  border-radius: inherit;
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
`

const PaddingColumn = styled(Column)`
  padding: 1.5rem 1rem;
`

export default function PanelMyAccount() {
  const history = useHistory()
  const { account, connector } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()

  const { active } = useWeb3React()
  const contextNetwork = useWeb3React(NetworkContextName)

  if (!contextNetwork.active && !active) {
    return null
  }

  return (
    <PanelMyAccountWrapper>
      <ColumnWrapper>
        <Column>
          <TYPE.black fontSize={16}>Address:</TYPE.black>
          <TYPE.subText marginTop={'0.25rem'}>{account && shortenAddress(account, 14)}</TYPE.subText>
          <TextBoxChangeAccount onClick={toggleWalletModal}>Change Account</TextBoxChangeAccount>
          {connector !== injected && connector !== walletlink && (
            <TextBoxChangeAccount
              onClick={() => {
                ;(connector as any).close()
              }}
            >
              Disconnect
            </TextBoxChangeAccount>
          )}
        </Column>
        <PaddingColumn>
          <MyAccountButton onClick={() => history.push('/my-account')}>My Account</MyAccountButton>
        </PaddingColumn>
        <RecentTransactions />
      </ColumnWrapper>
    </PanelMyAccountWrapper>
  )
}
