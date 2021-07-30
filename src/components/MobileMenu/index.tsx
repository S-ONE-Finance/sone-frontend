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

import { ExternalLink, TYPE } from '../../theme'
import SoneAmount from '../SoneAmount'
import RecentTransactions from '../RecentTransactions'
import Column from '../Column'
import { RowBetween } from '../Row'
import { StyledCloseAbsolute } from '../WalletModal'
import { StyledCloseIcon } from '../../theme'
import {
  S_ONE_WALLET_INTRO_PAGE_URL,
  S_ONE_SWAP_STATISTICS_URL,
  S_ONE_STAKING_STATISTICS_URL,
  S_ONE_WHITE_PAPER_URL,
  S_ONE_FAQ_URL,
  S_ONE_BLOG_URL
} from '../../constants/urls'

const ColumnWrapper = styled(Column)<{ padding?: string }>`
  position: relative;
  padding-top: 1rem;
  background-color: ${({ theme }) => theme.bg1Sone};

  & > * {
    padding: 1rem;
  }

  & > *:not(:last-child) {
    border-bottom: ${({ theme }) => `1px solid ${theme.divider1Sone}`};
  }
`

const TextBoxChangeAccount = styled.div`
  width: 100%;
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
  const { account } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()

  const closeModal = useCallback(() => {
    setIsShowMobileMenu(false)
  }, [setIsShowMobileMenu])

  return (
    <ColumnWrapper onClick={closeModal}>
      <Column>
        <StyledCloseAbsolute>
          <StyledCloseIcon />
        </StyledCloseAbsolute>
        <TYPE.black fontSize={14}>{t('address')}:</TYPE.black>
        <TYPE.subText marginTop="0.25rem">{account && shortenAddress(account, 14)}</TYPE.subText>
        <RowBetween marginTop="1rem">
          <SoneAmount isSmall={true} />
          <TextBoxChangeAccount onClick={toggleWalletModal}>{t('change_account')}</TextBoxChangeAccount>
        </RowBetween>
      </Column>
      <Column>
        <StyledExternalLink href={S_ONE_WALLET_INTRO_PAGE_URL}>{t('sone_wallet')}</StyledExternalLink>
        <StyledNavLink to="/swap">{t('swap')}</StyledNavLink>
        <StyledNavLink to="/pool" isActive={(match, { pathname }) => Boolean(match) || pathname.startsWith('/add')}>
          {t('liquidity')}
        </StyledNavLink>
        <StyledNavLink to="/staking">{t('staking')}</StyledNavLink>
        <StyledExternalLink href={S_ONE_SWAP_STATISTICS_URL}>{t('swap_stats')}</StyledExternalLink>
        <StyledExternalLink href={S_ONE_STAKING_STATISTICS_URL}>{t('Staking Stats')}</StyledExternalLink>
        <StyledExternalLink href={S_ONE_WHITE_PAPER_URL}>{t('White Paper')}</StyledExternalLink>
        <StyledExternalLink href={S_ONE_FAQ_URL}>{t('faq')}</StyledExternalLink>
        <StyledExternalLink href={S_ONE_BLOG_URL}>{t('blog')}</StyledExternalLink>
      </Column>
      <RecentTransactions isSmall={true} />
    </ColumnWrapper>
  )
}
