import React, { useMemo } from 'react'
import { useLocation } from 'react-router'
import styled from 'styled-components'
import { darken } from 'polished'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const TabContainer = styled.div`
  width: 350px;
  height: 53px;
  border-radius: 39px;
  background-color: ${({ theme }) => theme.tabBg};
  display: flex;
  margin: 1.25rem 0;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 90vw;
    max-width: 338px;
    height: 32px;
  `}
`

const TabItem = styled.div<{ is_active: 0 | 1 }>`
  width: 50%;
  height: 100%;
  border-radius: 26.5px;
  background-color: ${({ theme, is_active }) => (is_active ? theme.tabBgActive : theme.tabBg)};
  color: ${({ theme, is_active }) => (is_active ? theme.tabTextActive : theme.tabText)};
  font-size: 18px;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  text-decoration: none;

  :hover,
  :focus {
    color: ${({ theme, is_active }) => (is_active ? darken(0.05, theme.tabTextActive) : darken(0.05, theme.tabText))};
  }

  :active {
    color: ${({ theme, is_active }) => (is_active ? darken(0.1, theme.tabTextActive) : darken(0.1, theme.tabText))};
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;
  `}
`

function TabSwapLiquidity() {
  const { t } = useTranslation()
  const location = useLocation()

  const isSwap = useMemo(() => location?.pathname.startsWith('/swap'), [location])

  return (
    <TabContainer>
      <TabItem is_active={isSwap ? 1 : 0} as={Link} to="/swap">
        {t('swap_noun')}
      </TabItem>
      <TabItem is_active={isSwap ? 0 : 1} as={Link} to="/add">
        {t('liquidity')}
      </TabItem>
    </TabContainer>
  )
}

export default TabSwapLiquidity
