// On mobile devices, when the user presses the hamburger icon (menu), this modal will pop up.

import { useActiveWeb3React } from '../../hooks'
import { shortenAddress } from '../../utils'
import { ExternalLink, TYPE } from '../../theme'
import React from 'react'
import SoneAmount from '../SoneAmount'
import { useWalletModalToggle } from '../../state/application/hooks'
import styled from 'styled-components'
import { lighten } from 'polished'
import { useTranslation } from 'react-i18next'
import RecentTransactions from '../RecentTransactions'
import Column from '../Column'
import { RowBetween } from '../Row'
import { NavLink } from 'react-router-dom'

const ColumnWrapper = styled(Column)<{ padding?: string }>`
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
    color: ${({ theme }) => theme.red1Sone};
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
  setIsShowMobileMenu: any
}

export default function MobileMenu({ setIsShowMobileMenu }: MobileMenuProps) {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()

  const closeModal = React.useCallback(() => {
    setIsShowMobileMenu(false)
  }, [setIsShowMobileMenu])

  return (
    <ColumnWrapper onClick={closeModal}>
      <Column>
        <TYPE.black fontSize={14}>{t('address')}:</TYPE.black>
        <TYPE.subText marginTop={'0.25rem'}>{account && shortenAddress(account, 14)}</TYPE.subText>
        <RowBetween marginTop={'1rem'}>
          <SoneAmount inMobileMenu={true} />
          <TextBoxChangeAccount onClick={toggleWalletModal}>{t('changeAccount')}</TextBoxChangeAccount>
        </RowBetween>
      </Column>
      <Column>
        <StyledExternalLink href={'https://www.lipsum.com/'}>S-ONE Wallet</StyledExternalLink>
        <StyledNavLink to={'/swap'}>{t('swap')}</StyledNavLink>
        <StyledNavLink
          to={'/pool'}
          isActive={(match, { pathname }) =>
            Boolean(match) ||
            pathname.startsWith('/add') ||
            pathname.startsWith('/remove') ||
            pathname.startsWith('/create') ||
            pathname.startsWith('/find')
          }
        >
          {t('liquidity')}
        </StyledNavLink>
        <StyledNavLink to={'/uni'}>{t('staking')}</StyledNavLink>
        <StyledExternalLink href={'https://www.lipsum.com/'}>{t('swapStats')}</StyledExternalLink>
        <StyledExternalLink href={'https://www.lipsum.com/'}>{t('stakingStats')}</StyledExternalLink>
        <StyledExternalLink href={'https://www.lipsum.com/'}>{t('whitePaper')}</StyledExternalLink>
        <StyledExternalLink href={'https://www.lipsum.com/'}>{t('faq')}</StyledExternalLink>
        <StyledExternalLink href={'https://www.lipsum.com/'}>{t('blog')}</StyledExternalLink>
      </Column>
      <RecentTransactions inMobileMenu={true} />
    </ColumnWrapper>
  )
}
