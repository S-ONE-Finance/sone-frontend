/**
 * "MobileMenu" is the content inside a modal.
 * On mobile devices, when the user presses the hamburger icon (menu), the modal will pop up.
 */

import React, { useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { lighten } from 'polished'
import { useTranslation } from 'react-i18next'

import { useActiveWeb3React } from '../../hooks'
import { useWalletModalToggle } from '../../state/application/hooks'
import { shortenAddress } from '../../utils'

import { ExternalLink, StyledCloseIcon, TYPE } from '../../theme'
import SoneAmount from '../SoneAmount'
import RecentTransactions from '../RecentTransactions'
import Column from '../Column'
import { RowBetween } from '../Row'
import { StyledCloseAbsolute } from '../WalletModal'
import {
  S_ONE_DOCS_URL,
  S_ONE_FAQ_URL,
  S_ONE_STAKING_STATISTICS_URL,
  S_ONE_SWAP_STATISTICS_URL,
  S_ONE_WALLET_INTRO_PAGE_URL,
  S_ONE_WHITE_PAPER_URL
} from '../../constants/urls'
import { injected, walletlink } from '../../connectors'
import useSoneLockBalance from '../../hooks/staking/useSoneLockBalance'
import useUnlockHandler from '../../hooks/staking/useUnlockHandler'
import { formatSONE } from 'utils/formatNumber'

const ColumnWrapper = styled(Column)<{ padding?: string }>`
  position: relative;
  background-color: ${({ theme }) => theme.bg1Sone};

  & > * {
    padding: 1rem;
  }

  & > *:not(:last-child) {
    border-bottom: ${({ theme }) => `1px solid ${theme.divider1Sone}`};
  }
`

const TextBoxChangeAccount = styled.div<{ width?: string }>`
  width: ${({ width }) => width ?? '100%'};
  font-size: 14px;
  font-weight: 500;
  color: #3faab0;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  :hover {
    color: ${`${lighten(0.05, '#3FAAB0')}`};
  }
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text1Sone};
  font-size: 16px;
  width: fit-content;
  font-weight: 700;
  display: flex;
  align-items: center;
  position: relative;
  padding-bottom: 0.75rem;

  &.${activeClassName} {
    color: ${({ theme }) => theme.red1Sone};
  }

  :hover,
  :focus {
    color: ${({ theme }) => theme.red1Sone};
  }
`

// The same style as StyledNavLink
const StyledExternalLink = styled(ExternalLink).attrs({
  activeClassName
})<{ isActive?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text1Sone};
  font-size: 16px;
  width: fit-content;
  font-weight: 700;
  display: flex;
  align-items: center;
  padding-bottom: 0.75rem;

  :hover,
  :focus {
    text-decoration: none;
  }

  ::after {
    font-family: 'Inter var', sans-serif;
    content: ' ↗';
    font-size: 14px;
    margin-left: 0.25rem;
    margin-top: -0.25rem;
  }
`

interface MobileMenuProps {
  setIsShowMobileMenu: React.Dispatch<React.SetStateAction<boolean>>
}

export default function MobileMenu({ setIsShowMobileMenu }: MobileMenuProps) {
  const { t } = useTranslation()
  const { account, connector } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()

  const { soneCanUnlock, totalSoneLocked } = useSoneLockBalance()
  const onUnlockSone = useUnlockHandler()

  const closeModal = useCallback(() => {
    setIsShowMobileMenu(false)
  }, [setIsShowMobileMenu])

  const formattedSoneCanUnlock = formatSONE(soneCanUnlock.toString(), true, false) ?? '--'
  const formattedTotalSoneLocked = formatSONE(totalSoneLocked.toString(), true, false) ?? '--'
  const canUnlockValue = formattedSoneCanUnlock + '/' + formattedTotalSoneLocked + ' SONE'

  return (
    <ColumnWrapper onClick={closeModal}>
      {account && (
        <>
          <Column>
            <TYPE.black fontSize={14}>{t('address')}:</TYPE.black>
            <TYPE.subText marginTop="0.25rem">{account && shortenAddress(account, 14)}</TYPE.subText>
            <RowBetween marginTop="1rem">
              <SoneAmount isSmall={true} />
              <Column gap="8px">
                <TextBoxChangeAccount onClick={toggleWalletModal}>{t('change_account')}</TextBoxChangeAccount>
                {connector !== injected && connector !== walletlink && (
                  <TextBoxChangeAccount
                    onClick={() => {
                      ;(connector as any).close()
                    }}
                  >
                    {t('Disconnect')}
                  </TextBoxChangeAccount>
                )}
              </Column>
            </RowBetween>
          </Column>
          <Column>
            <RowBetween>
              <TYPE.black fontSize={14}>{t('can_unlock')}:</TYPE.black>
              <TextBoxChangeAccount width="fit-content" onClick={() => onUnlockSone(formattedSoneCanUnlock)}>
                {t('unlock')}
              </TextBoxChangeAccount>
            </RowBetween>
            <TYPE.subText marginTop="0.25rem">{canUnlockValue}</TYPE.subText>
          </Column>
        </>
      )}
      <Column>
        <StyledCloseAbsolute>
          <StyledCloseIcon />
        </StyledCloseAbsolute>
        <StyledExternalLink href={S_ONE_WALLET_INTRO_PAGE_URL}>{t('sone_wallet')}</StyledExternalLink>
        <StyledNavLink to="/swap">{t('swap_noun')}</StyledNavLink>
        <StyledNavLink
          to="/add/ETH"
          isActive={(match, { pathname }) => Boolean(match) || pathname.startsWith('/add/ETH')}
        >
          {t('liquidity')}
        </StyledNavLink>
        <StyledNavLink to="/staking">{t('staking')}</StyledNavLink>
        <StyledExternalLink href={S_ONE_SWAP_STATISTICS_URL}>{t('swap_stats')}</StyledExternalLink>
        <StyledExternalLink href={S_ONE_STAKING_STATISTICS_URL}>{t('staking_stats')}</StyledExternalLink>
        <StyledExternalLink href={S_ONE_DOCS_URL}>{t('docs')}</StyledExternalLink>
        <StyledExternalLink href={S_ONE_WHITE_PAPER_URL}>{t('white_paper')}</StyledExternalLink>
        <StyledExternalLink href={S_ONE_FAQ_URL}>{t('faq')}</StyledExternalLink>
      </Column>
      <RecentTransactions isSmall={true} />
    </ColumnWrapper>
  )
}
