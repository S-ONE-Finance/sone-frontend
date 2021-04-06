// TODO: Sau khi chuyển hết logic sang bên MyAccountPanel (desktop) và màn Modal khi click
// vào hamburger icon trên mobile thì sẽ xoá hết logic của file này đi. Chỉ để lại
// Button Text My Account or Connect Wallet or Error
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import React, { useMemo } from 'react'
import { Activity } from 'react-feather'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'

import useENSName from '../../hooks/useENSName'
import { useWindowSize } from '../../hooks/useWindowSize'
import { useWalletModalToggle } from '../../state/application/hooks'
import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'

import { NetworkContextName } from '../../constants'
import { TransactionDetails } from '../../state/transactions/reducer'

import WalletModal from '../WalletModal'

const Text = styled.p`
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 0.5rem 0 0.25rem;
  font-size: 1rem;
  width: fit-content;
  font-weight: 500;
`

const NetworkIcon = styled(Activity)`
  margin-left: 0.25rem;
  margin-right: 0.5rem;
  width: 16px;
  height: 16px;
`

export const ButtonMainRed = styled.div<{ cursor?: string }>`
  background-color: ${({ theme }) => theme.red1Sone};
  color: #ffffff;
  min-width: 154px;
  padding: 0.5rem;
  height: 35px;
  border-radius: 31px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  cursor: ${({ cursor }) => cursor || 'pointer'};
  box-shadow: 4px 4px 4px rgb(0 0 0 / 12%);

  :hover,
  :focus {
    background-color: ${({ theme }) => theme.red1Sone};
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      width: 140px;
  `}
`

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

function Web3StatusInner() {
  const { t } = useTranslation()
  const { account, error } = useWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const history = useHistory()
  const size = useWindowSize()

  if (account) {
    return (
      <ButtonMainRed
        id="web3-status-connected"
        cursor="normal"
        onClick={() => {
          // Trên điện thoại và dưới 500px thì click vào sẽ ra my account.
          if (size?.width && size?.width <= 500) {
            history.push('/my-account')
          }
        }}
      >
        {t('my-account')}
      </ButtonMainRed>
    )
  } else if (error) {
    return (
      <ButtonMainRed onClick={toggleWalletModal}>
        <NetworkIcon />
        <Text>{error instanceof UnsupportedChainIdError ? 'Wrong Network' : 'Error'}</Text>
      </ButtonMainRed>
    )
  } else {
    return (
      <ButtonMainRed id="connect-wallet" onClick={toggleWalletModal}>
        {t('connect-wallet')}
      </ButtonMainRed>
    )
  }
}

export default function Web3Status() {
  const { active, account } = useWeb3React()
  const contextNetwork = useWeb3React(NetworkContextName)

  const { ENSName } = useENSName(account ?? undefined)

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
    <>
      <Web3StatusInner />
      <WalletModal ENSName={ENSName ?? undefined} pendingTransactions={pending} confirmedTransactions={confirmed} />
    </>
  )
}
