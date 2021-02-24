import { TokenAmount } from '@uniswap/sdk'
import React from 'react'
import { Text, Button } from 'rebass'
import { NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CountUp } from 'use-count-up'
import styled from 'styled-components'
import { Moon, Sun, Globe } from 'react-feather'

import Logo from '../../assets/svg/logo_text_sone.svg'
import LogoDark from '../../assets/svg/logo_text_white_sone.svg'
import LogoToken from '../../assets/svg/logo_token_sone.svg'

import { useActiveWeb3React } from '../../hooks'
import { useDarkModeManager } from '../../state/user/hooks'
import { useETHBalances, useAggregateUniBalance } from '../../state/wallet/hooks'
import { useUserHasAvailableClaim } from '../../state/claim/hooks'
import useLanguage from '../../hooks/useLanguage'

import { TYPE, ExternalLink } from '../../theme'
import Row, { RowFixed } from '../Row'
import Web3Status from '../Web3Status'
import ClaimModal from '../claim/ClaimModal'
import usePrevious from '../../hooks/usePrevious'

const HeaderFrame = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  top: 0;
  position: relative;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  padding: 0 80px;
  z-index: 2;
  background-color: ${({ theme }) => theme.bg1Sone};

  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    padding: 0 1rem;
    width: calc(100%);
    position: relative;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        padding: 0.5rem 1rem;
  `}
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;

  /* addresses safari's lack of support for "gap" */
  & > *:not(:first-child) {
    margin-left: 8px;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
   flex-direction: row-reverse;
    align-items: center;
  `};
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;
`

const HeaderRow = styled(RowFixed)`
  ${({ theme }) => theme.mediaWidth.upToMedium`
   width: 100%;
  `};
`

const HeaderMenu = styled(Row)`
  justify-content: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem 0 1rem 1rem;
    justify-content: flex-end;
`};
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 1rem;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
  :hover {
    cursor: pointer;
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
  font-size: 18px;
  width: fit-content;
  margin-left: 2rem;
  font-weight: 400;
  height: 70px;
  display: flex;
  align-items: center;
  position: relative;

  &.${activeClassName} {
    color: ${({ theme }) => theme.red1Sone};

    ::after {
      content: '';
      width: 100%;
      height: 4px;
      background-color: ${({ theme }) => theme.red1Sone};
      position: absolute;
      bottom: 0;
    }
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
  font-size: 18px;
  width: fit-content;
  margin-left: 2rem;
  font-weight: 400;
  height: 70px;
  display: flex;
  align-items: center;

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

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
`}
`

const SubMenu = styled.div`
  position: absolute;
  top: calc(70px + 1rem);
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.24);
  background-color: ${({ theme }) => theme.bg1Sone};
  border-radius: 10px;
  width: 172px;
  display: none;
`

const SubMenuItemNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text1Sone};
  font-size: 18px;
  width: fit-content;
  font-weight: 400;
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;

  :hover,
  :focus {
    color: ${({ theme }) => theme.red1Sone};
    background-color: ${({ theme }) => theme.bg2Sone};
  }
`

// The same style as SubMenuItemNavLink
const SubMenuItemExternalLink = styled(ExternalLink).attrs({
  activeClassName
})<{ isActive?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text1Sone};
  font-size: 18px;
  width: fit-content;
  font-weight: 400;
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;

  :hover,
  :focus {
    color: ${({ theme }) => theme.red1Sone};
    background-color: ${({ theme }) => theme.bg2Sone};
    text-decoration: none;
  }
`

// The same style as SubMenuItemNavLink
const SubMenuItemText = styled.span`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text1Sone};
  font-size: 18px;
  width: fit-content;
  font-weight: 400;
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;

  :hover,
  :focus {
    color: ${({ theme }) => theme.red1Sone};
    background-color: ${({ theme }) => theme.bg2Sone};
    text-decoration: none;
  }
`

export const StyledMenuButton = styled.button`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  background-color: ${({ theme }) => theme.bg3Sone};
  margin: 0;
  padding: 0;
  height: 35px;
  margin-left: 8px;
  padding: 0.15rem 1rem;
  border-radius: 20px;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.12);

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg4};
  }

  svg {
    margin-top: 2px;
  }
  > * {
    stroke: ${({ theme }) => theme.stroke1Sone};
  }
`

const StyledMenuButtonWithText = styled(StyledMenuButton)`
  display: flex;
  justify-content: center;
  align-items: center;
`

const MenuItem = styled.div.attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text1Sone};
  font-size: 18px;
  width: fit-content;
  margin-left: 2rem;
  font-weight: 400;
  height: 70px;
  display: flex;
  align-items: center;
  position: relative;

  :hover,
  :focus {
    color: ${({ theme }) => theme.red1Sone};

    ${SubMenu} {
      display: block;
    }

    ${StyledMenuButton} {
      outline: none;
      background-color: ${({ theme }) => theme.bg4};
    }
  }

  ::before {
    content: '';
    display: block;
    position: absolute;
    height: 1rem;
    width: calc(100% + 2rem);
    left: 50%;
    bottom: -1rem;
    transform: translateX(-50%);
    cursor: default;
  }

  &.${activeClassName} {
    color: ${({ theme }) => theme.red1Sone};

    ::after {
      content: '';
      width: 100%;
      height: 4px;
      background-color: ${({ theme }) => theme.red1Sone};
      position: absolute;
      bottom: 0;
    }
  }
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row;
    justify-content: space-between;
    justify-self: center;
    width: 100%;
    max-width: 960px;
    padding: 1rem;
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    z-index: 99;
    height: 72px;
    border-radius: 12px 12px 0 0;
    background-color: ${({ theme }) => theme.bg1};
  `};
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)};
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;
  cursor: pointer;

  :focus {
    border: 1px solid blue;
  }
`

const UNIAmount = styled(AccountElement)`
  color: white;
  padding: 4px 8px;
  height: 37px;
  font-weight: 400;
  color: ${({ theme }) => theme.red1Sone};
  background: transparent;
  display: flex;
`

const UNIWrapper = styled.span`
  width: fit-content;
  position: relative;
`

const HideSmall = styled.span`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

export default function Header() {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  const [language, setLanguage] = useLanguage()

  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const [darkMode, toggleDarkMode] = useDarkModeManager()

  const availableClaim: boolean = useUserHasAvailableClaim(account)

  const aggregateBalance: TokenAmount | undefined = useAggregateUniBalance()

  const countUpValue = aggregateBalance?.toFixed(0) ?? '0'
  const countUpValuePrevious = usePrevious(countUpValue) ?? '0'

  const location = useLocation()

  return (
    <HeaderFrame>
      <ClaimModal />
      <HeaderRow>
        <Title href="https://www.lipsum.com/" target="_blank">
          <img width={'100px'} src={darkMode ? LogoDark : Logo} alt="logo" />
        </Title>
        <HeaderMenu>
          <StyledExternalLink href={'https://www.lipsum.com/'}>S-ONE Wallet</StyledExternalLink>
          <MenuItem
            className={
              location.pathname.startsWith('/swap') ||
              location.pathname.startsWith('/pool') ||
              location.pathname.startsWith('/add')
                ? 'ACTIVE'
                : undefined
            }
          >
            {t('swap')}
            <SubMenu>
              <SubMenuItemNavLink id={`swap-nav-link`} to={'/swap'}>
                {t('swap')}
              </SubMenuItemNavLink>
              <SubMenuItemNavLink
                id={`pool-nav-link`}
                to={'/pool'}
                isActive={(match, { pathname }) =>
                  Boolean(match) ||
                  pathname.startsWith('/add') ||
                  pathname.startsWith('/remove') ||
                  pathname.startsWith('/create') ||
                  pathname.startsWith('/find')
                }
              >
                {t('pool')}
              </SubMenuItemNavLink>
            </SubMenu>
          </MenuItem>
          <StyledNavLink to={'/uni'}>{t('staking')}</StyledNavLink>
          <MenuItem>
            {t('stats')}
            <SubMenu>
              <SubMenuItemExternalLink href={'https://www.lipsum.com/'}>{t('swapStats')}</SubMenuItemExternalLink>
              <SubMenuItemExternalLink href={'https://www.lipsum.com/'}>{t('stakingStats')}</SubMenuItemExternalLink>
              <SubMenuItemExternalLink href={'https://www.lipsum.com/'}>{t('lendingStats')}</SubMenuItemExternalLink>
            </SubMenu>
          </MenuItem>
          <MenuItem>
            {t('docs')}
            <SubMenu>
              <SubMenuItemExternalLink href={'https://www.lipsum.com/'}>{t('whitePaper')}</SubMenuItemExternalLink>
              <SubMenuItemExternalLink href={'https://www.lipsum.com/'}>{t('faq')}</SubMenuItemExternalLink>
              <SubMenuItemExternalLink href={'https://www.lipsum.com/'}>{t('blog')}</SubMenuItemExternalLink>
            </SubMenu>
          </MenuItem>
        </HeaderMenu>
      </HeaderRow>
      <HeaderControls>
        <HeaderElement>
          {!availableClaim && aggregateBalance && account && (
            <HideSmall>
              <UNIWrapper>
                <UNIAmount active={!!account && !availableClaim} style={{ pointerEvents: 'auto' }}>
                  <img width={'21px'} src={LogoToken} alt="logo" />
                  <TYPE.red1Sone style={{ marginLeft: '5px', fontSize: '18px' }}>
                    <CountUp
                      key={countUpValue}
                      isCounting
                      start={parseFloat(countUpValuePrevious)}
                      end={parseFloat(countUpValue)}
                      thousandsSeparator={','}
                      duration={1}
                    />
                  </TYPE.red1Sone>
                </UNIAmount>
              </UNIWrapper>
            </HideSmall>
          )}
          {/* Cái này liên quan đến show giá trị ETH và địa chỉ nên phải giữ lại để đọc lại */}
          {/* <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
            {account && userEthBalance ? (
              <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={400}>
                {userEthBalance?.toSignificant(4)} ETH
              </BalanceText>
            ) : null}
            <Web3Status />
          </AccountElement> */}
          {/* TODO: lỗi ko tự động logout khi user lock ví trên metamask */}
          <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
            <Web3Status />
          </AccountElement>
        </HeaderElement>
        <HeaderElementWrap>
          <StyledMenuButton onClick={() => toggleDarkMode()}>
            {darkMode ? <Moon size={20} strokeWidth={2.5} /> : <Sun size={20} strokeWidth={2.5} />}
          </StyledMenuButton>
          <MenuItem style={{ marginLeft: '0.5rem' }}>
            <StyledMenuButtonWithText style={{ marginLeft: 0 }}>
              <Globe size={20} />
              <TYPE.language style={{ marginLeft: '5px' }}>EN</TYPE.language>
            </StyledMenuButtonWithText>
            <SubMenu>
              <SubMenuItemText onClick={() => setLanguage('jp')}>日本語</SubMenuItemText>
              <SubMenuItemText onClick={() => setLanguage('en')}>English</SubMenuItemText>
              <SubMenuItemText onClick={() => setLanguage('zh-CN')}>中文</SubMenuItemText>
            </SubMenu>
          </MenuItem>
        </HeaderElementWrap>
      </HeaderControls>
    </HeaderFrame>
  )
}
