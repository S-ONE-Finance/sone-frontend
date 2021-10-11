// TODO: Sau khi chuyển hết logic sang bên PanelMyAccount (desktop) và màn Modal khi click
// vào hamburger icon trên mobile thì sẽ xoá hết logic của file này đi. Chỉ để lại
// Button Text My Account or Connect Wallet or Error
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import React, { useMemo } from 'react'
import { Activity } from 'react-feather'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'

import useENSName from '../../hooks/useENSName'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import { useWalletModalToggle } from '../../state/application/hooks'
import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'

import { NetworkContextName } from '../../constants'
import { TransactionDetails } from '../../state/transactions/reducer'

import WalletModal from '../WalletModal'
import { darken } from 'polished'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

import { MarkHeader } from '../lib/mark/components'
import { useGuideStepManager } from '../../state/user/hooks'

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

export const ButtonMainRed = styled.div<{ cursor?: string; padding?: string }>`
  background-color: ${({ theme }) => theme.red1Sone};
  color: #ffffff;
  min-width: 154px;
  padding: ${({ padding }) => (padding ? padding : '0.5rem')};
  // Nếu truyền vào padding thì không set height nữa.
  height: ${({ padding }) => (padding ? 'unset' : '2.1875rem')};
  border-radius: 31px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  cursor: ${({ cursor }) => cursor || 'pointer'};
  user-select: none;

  :hover,
  :focus {
    background-color: ${({ theme }) => darken(0.05, theme.red1Sone)};
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    min-width: fit-content;
    width: fit-content;
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
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const history = useHistory()
  const [guideStep] = useGuideStepManager()

  const getLanguage = () => i18next.language || window.localStorage.i18nextLng

  if (guideStep.isGuide && Number(guideStep.step) === 1) {
    return (
      <MarkHeader>
        <ButtonMainRed id="connect-wallet" className="step-1">
          {t('connect_wallet')}
        </ButtonMainRed>
      </MarkHeader>
    )
  } else if (account) {
    return (
      <ButtonMainRed
        id="web3-status-connected"
        cursor="normal"
        style={{ fontSize: isUpToExtraSmall && getLanguage() === 'jp' ? '13px' : '16px' }}
        onClick={() => {
          // Trên small devices, click vào sẽ ra my account.
          if (isUpToExtraSmall) {
            history.push('/my-account')
          }
        }}
      >
        {guideStep.isGuide && Number(guideStep.step) === 1 ? t('connect_wallet') : t('my_account')}
      </ButtonMainRed>
    )
  } else if (error) {
    return (
      <ButtonMainRed onClick={toggleWalletModal}>
        <NetworkIcon />
        <Text>{error instanceof UnsupportedChainIdError ? t('Wrong Network') : t('Error')}</Text>
      </ButtonMainRed>
    )
  } else {
    return (
      <ButtonMainRed id="connect-wallet" onClick={toggleWalletModal}>
        {guideStep.isGuide && Number(guideStep.step) > 1 ? t('my_account') : t('connect_wallet')}
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
