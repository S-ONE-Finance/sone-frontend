import React from 'react'
import styled from 'styled-components'
import { Globe, Menu as MenuIcon, Moon, Sun } from 'react-feather'
import { useActiveWeb3React } from '../../../../../hooks'
import { useDarkModeManager } from '../../../../../state/user/hooks'
import { useUserHasAvailableClaim } from '../../../../../state/claim/hooks'
import useLanguage from '../../../../../hooks/useLanguage'

import { TYPE } from '../../../../../theme'
import PendingStatus from '../../../../Header/PendingStatus'
import PanelMyAccount from '../../../../Header/PanelMyAccount'
import Web3Status from '../../../../Web3Status'
import SoneAmount from '../../../../SoneAmount'

const HeaderFrame = styled.div`
  display: none;
  grid-template-columns: 1fr 120px;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
  top: 0;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 0 80px;
  pointer-events: none;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    display: grid;
    grid-template-columns: 1fr;
    padding: 0 1rem;
    width: calc(100%);
  `};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;

  /* addresses safari's lack of support for "gap" */
  & > *:not(:first-child) {
    margin-left: 1rem;
  }

  & > *:first-child {
    margin-left: 0;
  }

  ${({ theme }) => theme.mediaWidth.upToLarge`
    flex-direction: row-reverse;
    align-items: center;

    & > *:last-child {
      margin-left: 0 !important;
    }

    & > *:first-child {
      margin-left: 0.5rem !important;
    }
  `};
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;
`

// Put `display` in props to cast block during dev.
const SubMenu = styled.div<{ width?: string; borderRadius?: string; display?: string }>`
  position: absolute;
  top: calc(70px + 1rem);
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.24);
  background-color: ${({ theme }) => theme.bg1Sone};
  border-radius: ${({ borderRadius }) => borderRadius ?? '10px'};
  width: ${({ width }) => width ?? '172px'};
  cursor: default;
  display: ${({ display }) => display ?? 'none'};
`

// Put submenu cling to the bottom left of the screen.
const ResponsiveBottomLeftSubMenu = styled(SubMenu)`
  ${({ theme }) => theme.mediaWidth.upToLarge`
    top: unset;
    bottom: calc(70px + 1rem);
    left: 0;
    transform: none;
`}
`

// Put submenu cling to the bottom right of the screen.
const ResponsiveBottomRightSubMenu = styled(SubMenu)`
  ${({ theme }) => theme.mediaWidth.upToLarge`
    top: unset;
    bottom: calc(70px + 1rem);
    transform: none;
    left: unset;
    right: 0;
  `}
`

// The same style as SubMenuItemNavLink.
const SubMenuItemText = styled.span`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text1Sone};
  font-size: 18px;
  font-weight: 400;
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;

  :hover {
    color: ${({ theme }) => theme.red1Sone};
    background-color: ${({ theme }) => theme.bg2Sone};
    text-decoration: none;
  }
`

export const StyledMenuButton = styled.button<{ cursor?: string; primary?: boolean }>`
  position: relative;
  width: max-content;
  border: none;
  background-color: rgba(0, 0, 0, 0.0001);
  height: 2.1875rem;
  margin: 0 0 0 1rem;
  padding: 0.15rem 1rem;
  border-radius: 20px;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.12);
  cursor: ${({ cursor }) => cursor || 'default'};
  outline: none;

  :hover {
    background-color: ${({ theme }) => theme.bg4};
  }

  svg {
    margin-top: 2px;
  }

  > * {
    stroke: rgba(0, 0, 0, 0.7);
    color: rgba(0, 0, 0, 0.7);
  }
`

const StyledMenuButtonWithText = styled(StyledMenuButton)`
  display: flex;
  justify-content: center;
  align-items: center;
`

const MenuItem = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  outline: none;
  cursor: default;
  text-decoration: none;
  color: ${({ theme }) => theme.text1Sone};
  font-size: 18px;
  width: fit-content;
  margin: 0 0 0 60px;
  font-weight: 400;
  height: 70px;
  display: flex;
  align-items: center;
  position: relative;

  :hover {
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
    width: calc(100% + 2rem);
    height: 1rem;
    left: 50%;
    transform: translateX(-50%);
    cursor: default;
    bottom: -1rem;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
    margin: 0 0 0 2rem;
  `}

  ${({ theme }) => theme.mediaWidth.upToLarge`
    margin: 0 0 0 3vw;
  `}
`

// Khi màn hình kéo về large thì phải hover lên trên menuitem phải giữ submenu hiện ra.
const ResponsiveMenuItem = styled(MenuItem)`
  ::before {
    ${({ theme }) => theme.mediaWidth.upToLarge`
      bottom: unset;
      top: -1rem;
    `}
  }
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    flex-direction: row;
    justify-content: space-between;
    justify-self: center;
    width: 100%;
    padding: 1rem;
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    height: 72px;
    background-color: rgba(0, 0, 0, 0.7);
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    justify-content: center;
  `};
`

const AccountElement = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;

  :focus {
    border: 1px solid blue;
  }
`

const HideExtraSmall = styled.div`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const ShowOnlyExtraSmall = styled.div`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: inherit;
  `};
`

export default function Header() {
  const { account } = useActiveWeb3React()
  const [language] = useLanguage()
  const [darkMode] = useDarkModeManager()

  const availableClaim: boolean = useUserHasAvailableClaim(account)

  return (
    <>
      <HeaderFrame>
        {/* Cái này là modal thông báo claim uni, sau này cho thành clame sone modal, giờ chưa cần sử dụng. */}
        <HeaderControls>
          <HeaderElement>
            <HideExtraSmall>
              <AccountElement style={{ pointerEvents: 'auto' }}>
                <PendingStatus />
              </AccountElement>
            </HideExtraSmall>
            {!availableClaim && account && (
              <HideExtraSmall>
                <SoneAmount />
              </HideExtraSmall>
            )}
            <ResponsiveMenuItem>
              <AccountElement style={{ pointerEvents: 'auto' }}>
                <Web3Status />
              </AccountElement>
              {account && (
                <HideExtraSmall>
                  <ResponsiveBottomLeftSubMenu width="fit-content" borderRadius="20px">
                    <PanelMyAccount />
                  </ResponsiveBottomLeftSubMenu>
                </HideExtraSmall>
              )}
            </ResponsiveMenuItem>
          </HeaderElement>
          <HeaderElementWrap>
            <StyledMenuButton cursor="pointer">
              {darkMode ? <Moon size={20} strokeWidth={2.5} /> : <Sun size={20} strokeWidth={2.5} />}
            </StyledMenuButton>
            <ResponsiveMenuItem style={{ margin: '0' }}>
              <StyledMenuButtonWithText>
                <Globe size={20} />
                <TYPE.language style={{ marginLeft: '5px' }} fontSize="13px">
                  {language?.startsWith('en')
                    ? 'EN'
                    : language?.startsWith('jp')
                    ? '日本語'
                    : language?.startsWith('zh')
                    ? '簡体中文'
                    : 'N/A'}
                </TYPE.language>
              </StyledMenuButtonWithText>
              <ResponsiveBottomRightSubMenu>
                <SubMenuItemText>日本語</SubMenuItemText>
                <SubMenuItemText>English</SubMenuItemText>
                <SubMenuItemText>簡体中文</SubMenuItemText>
              </ResponsiveBottomRightSubMenu>
            </ResponsiveMenuItem>
            <ShowOnlyExtraSmall>
              <StyledMenuButton primary={true}>
                <MenuIcon size={20} strokeWidth={2.5} />
              </StyledMenuButton>
            </ShowOnlyExtraSmall>
          </HeaderElementWrap>
        </HeaderControls>
      </HeaderFrame>
    </>
  )
}
