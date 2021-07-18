import React from 'react'
import { Route, Switch } from 'react-router-dom'
import styled from 'styled-components'

import { ApplicationModal } from '../state/application/actions'

import { useModalOpen, useToggleModal } from '../state/application/hooks'

import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader'

import { RedirectDuplicateTokenIds, RedirectOldAddLiquidityPathStructure } from './AddLiquidity/redirects'
import { RedirectOldRemoveLiquidityPathStructure } from './WithdrawLiquidity/redirects'
import { OpenClaimAddressModalAndRedirectToSwap, RedirectPathToSwapOnly, RedirectToSwap } from './Swap/redirects'

import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter'
import AddressClaimModal from '../components/claim/AddressClaimModal'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Polling from '../components/Polling'
import URLWarning from '../components/Header/URLWarning'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'

import AddLiquidity from './AddLiquidity'
import Earn from './Earn'
import Manage from './Earn/Manage'
import PoolFinder from './PoolFinder'
import WithdrawLiquidity from './WithdrawLiquidity'
import Swap from './Swap'
import Vote from './Vote'
import VotePage from './Vote/VotePage'
import MyAccountPage from './MyAccount'

import TabSwapLiquidity from '../components/TabSwapLiquidity'
import { useLocation } from 'react-router'
import WeeklyRanking from '../components/WeeklyRanking'
import { useTranslation } from 'react-i18next'
import { HideLarge } from '../theme'
import LogoWithPendingAmount from 'components/LogoWithPendingAmount'
import WithdrawLiquidity2 from './WithdrawLiquidity2'

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
  padding-top: 20px;
  padding-bottom: 45px;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    padding: 22px 1rem 5rem 1rem;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding-bottom: 3rem;
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
  // Khi data empty thì hidden footer.
  // background: ${({ theme }) => theme.bg4Sone};
  // box-shadow: 0 0 20px rgba(0, 0, 0, 0.25);
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
            <Switch>
              <Route exact strict path="/swap" component={Swap} />
              <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
              <Route exact path="/add" component={AddLiquidity} />
              <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
              <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
              <Route exact strict path="/my-account" component={MyAccountPage} />
              <Route
                exact
                strict
                path="/my-account/withdraw/:tokens"
                component={RedirectOldRemoveLiquidityPathStructure}
              />
              <Route exact strict path="/my-account/withdraw/:currencyIdA/:currencyIdB" component={WithdrawLiquidity} />
              <Route
                exact
                strict
                path="/my-account/withdraw2/:currencyIdA/:currencyIdB"
                component={WithdrawLiquidity2}
              />
              {/* Component PoolFinder để import Pool, hiện tại trong requirements của sone chưa có use-case này. */}
              <Route exact strict path="/find" component={PoolFinder} />
              {/* Nhưng route dưới đây là của uni, trong sone không có, nhưng nên giữ lại. */}
              <Route exact strict path="/claim" component={OpenClaimAddressModalAndRedirectToSwap} />
              <Route exact strict path="/vote" component={Vote} />
              <Route exact strict path="/vote/:id" component={VotePage} />
              <Route exact strict path="/uni" component={Earn} />
              <Route exact strict path="/uni/:currencyIdA/:currencyIdB" component={Manage} />
              <Route component={RedirectPathToSwapOnly} />
            </Switch>
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
