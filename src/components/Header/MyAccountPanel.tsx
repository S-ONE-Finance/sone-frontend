// MyAccountPanel is used only in Header component
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { darken, lighten } from 'polished'
import { useTranslation } from 'react-i18next'

import { useWalletModalToggle } from '../../state/application/hooks'
import { useWeb3React } from '@web3-react/core'
import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'

import { NetworkContextName } from '../../constants'
import { TransactionDetails } from '../../state/transactions/reducer'

import Column from '../Column'
import { TYPE } from '../../theme'
import { ButtonPrimary } from '../Button'
import TransactionSone from './TransactionSone'

const MyAccountPanelWrapper = styled.div`
  cursor: default;
  display: block;
  width: 350px;
  overflow: hidden;

  border-radius: inherit;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: calc(100vw - 2rem);
  `}
`

const ColumnWrapper = styled(Column)`
  & > * {
    padding: 1rem;
  }

  & > *:not(:last-child) {
    padding-bottom: 1.25rem;
    border-bottom: ${({ theme }) => `1px solid ${theme.divider1Sone}`};
  }

  & > *:not(:first-child) {
    padding-top: 1.25rem;
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

const ButtonConnectWallet = styled(ButtonPrimary)`
  background-color: ${({ theme }) => theme.red1Sone};
  color: #ffffff;
  width: 100%;
  height: 50px;
  padding: 0;
  font-size: 16px;
  border-radius: 30px;

  :hover,
  :focus {
    background-color: ${({ theme }) => theme.red1Sone};
  }
`

const ColumnScroll = styled(Column)`
  padding-left: 0;
  padding-right: 0;
  padding-bottom: 0.5rem;
  max-height: 200px;
  overflow-x: hidden;
  overflow-y: auto;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    max-height: 25vh;
  `}

  > * {
    padding: 0 1rem;
  }

  /* width */
  ::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background-color: ${({ theme }) => theme.divider1Sone};
    /* border-radius: 10px; */
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.scrollbarThumb};
    /* border-radius: 10px; */
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background-color: ${({ theme }) => `${darken(0.05, theme.scrollbarThumb)}`};
  }
`

const TransactionList = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};

  > * {
    margin-bottom: 0.25rem;
  }
`

function renderTransactions(transactions: string[]) {
  return (
    <TransactionList>
      {transactions.map((hash, i) => {
        return <TransactionSone key={i} hash={hash} />
      })}
    </TransactionList>
  )
}

// We want the latest one to come first, so return negative if a is after b.
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

export default function MyAccountPanel() {
  const { t } = useTranslation()
  const toggleWalletModal = useWalletModalToggle()

  const { active } = useWeb3React()
  const contextNetwork = useWeb3React(NetworkContextName)

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)
  const confirmed = sortedRecentTransactions.filter(tx => tx.receipt).map(tx => tx.hash)

  if (!contextNetwork.active && !active) {
    return null
  }

  return (
    <MyAccountPanelWrapper>
      <ColumnWrapper>
        <Column>
          <TYPE.black fontSize={16}>{t('address')}:</TYPE.black>
          <TYPE.subText marginTop={'0.25rem'}>0x8DE6...e4AE0x8DE6e4AEe4AEe4AE</TYPE.subText>
          <TextBoxChangeAccount onClick={toggleWalletModal}>{t('changeAccount')}</TextBoxChangeAccount>
        </Column>
        <Column>
          <ButtonConnectWallet>{t('myAccount')}</ButtonConnectWallet>
        </Column>
        <ColumnScroll>
          <TYPE.red1Sone marginBottom={'0.75rem'}>{t('recentTransactions')}</TYPE.red1Sone>
          {pending.length || confirmed.length ? (
            <>
              {renderTransactions(pending)}
              {renderTransactions(confirmed)}
            </>
          ) : (
            <TYPE.subText>{t('emptyRecentTransactionsMessage')}</TYPE.subText>
          )}
        </ColumnScroll>
      </ColumnWrapper>
    </MyAccountPanelWrapper>
  )
}
