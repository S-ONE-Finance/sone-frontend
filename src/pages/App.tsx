import React from 'react'
import { Route } from 'react-router-dom'
import styled from 'styled-components'

import { ApplicationModal } from '../state/application/actions'

import { useModalOpen, useToggleModal } from '../state/application/hooks'

import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader'

import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter'
import AddressClaimModal from '../components/claim/AddressClaimModal'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Polling from '../components/Polling'
import URLWarning from '../components/Header/URLWarning'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'

import TabSwapLiquidity from '../components/TabSwapLiquidity'
import { useLocation } from 'react-router'
import WeeklyRanking from '../components/WeeklyRanking'
import { useTranslation } from 'react-i18next'
import { HideLarge } from '../theme'
import LogoWithPendingAmount from 'components/LogoWithPendingAmount'
import Routing from './Routing'

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
  min-height: 100vh;
  position: relative;
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    padding: 0 1rem 5rem 1rem;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 0 1rem 3.5rem 1rem;
  `};

  z-index: 1;
`

const Marginer = styled.div`
  margin-top: 5rem;
`

const FooterWrapper = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 45px;
  z-index: 1;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    bottom: 72px;
    border-radius: 12px 12px 0 0;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    position: fixed;
    height: 31px;
  `};
`

function TopLevelModals() {
  const open = useModalOpen(ApplicationModal.ADDRESS_CLAIM)
  const toggle = useToggleModal(ApplicationModal.ADDRESS_CLAIM)
  return <AddressClaimModal isOpen={open} onDismiss={toggle} />
}

function OnlyShowAt({ children, paths }: { children?: React.ReactNode; paths: Array<string> }) {
  const location = useLocation()
  const { pathname } = location
  return children && paths.some(path => pathname.startsWith(path)) ? <>{children}</> : null
}

export default function App() {
  // Trigger i18next in entire app.
  useTranslation()

  return (
    <>
      <Route component={GoogleAnalyticsReporter} />
      <Route component={DarkModeQueryParamReader} />
      <AppWrapper>
        <URLWarning />
        <HeaderWrapper>
          <Header />
        </HeaderWrapper>
        <BodyWrapper>
          <Popups />
          <HideLarge>
            <Polling />
          </HideLarge>
          <TopLevelModals />
          <LogoWithPendingAmount />
          <OnlyShowAt paths={['/swap', '/add']}>
            <TabSwapLiquidity />
          </OnlyShowAt>
          <Web3ReactManager>
            <Routing />
          </Web3ReactManager>
          <OnlyShowAt paths={['/swap', '/add']}>
            <WeeklyRanking />
          </OnlyShowAt>
        </BodyWrapper>
        <Marginer />
        <FooterWrapper>
          <Footer />
        </FooterWrapper>
      </AppWrapper>
    </>
  )
}
