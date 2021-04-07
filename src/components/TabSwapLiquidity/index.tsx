import React, { useMemo } from 'react'
import { useLocation } from 'react-router'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { darken } from 'polished'
import { useHistory } from 'react-router-dom'

const TabContainer = styled.div`
  width: 350px;
  height: 53px;
  border-radius: 39px;
  background-color: ${({ theme }) => theme.tabBg};
  display: flex;
  margin-bottom: 20px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 90vw;
    max-width: 338px;
    height: 32px;
  `}
`

const TabItem = styled.div<{ isActive?: boolean }>`
  width: 50%;
  height: 100%;
  border-radius: 26.5px;
  background-color: ${({ theme, isActive }) => (isActive ? theme.tabBgActive : theme.tabBg)};
  color: ${({ theme, isActive }) => (isActive ? theme.tabTextActive : theme.tabText)};
  font-size: 18px;
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  :hover,
  :focus {
    color: ${({ theme, isActive }) => (isActive ? darken(0.05, theme.tabTextActive) : darken(0.05, theme.tabText))};
  }

  :active {
    color: ${({ theme, isActive }) => (isActive ? darken(0.1, theme.tabTextActive) : darken(0.1, theme.tabText))};
  }
`

function TabSwapLiquidity() {
  const { t } = useTranslation()
  const location = useLocation()
  const history = useHistory()

  const isSwap = useMemo(() => location?.pathname.startsWith('/swap'), [location])

  return (
    <TabContainer>
      <TabItem isActive={isSwap} onClick={() => history.push('/swap')}>
        {t('swap')}
      </TabItem>
      <TabItem isActive={!isSwap} onClick={() => history.push('/add')}>
        {t('liquidity')}
      </TabItem>
    </TabContainer>
  )
}

export default TabSwapLiquidity
