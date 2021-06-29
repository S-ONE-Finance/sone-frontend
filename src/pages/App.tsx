import React from 'react'
import { Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import { useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'

import { ApplicationModal } from '../state/application/actions'
import { useModalOpen, useToggleModal } from '../state/application/hooks'
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader'

import {
  RedirectDuplicateTokenIds,
  RedirectOldAddLiquidityPathStructure,
  RedirectToAddLiquidity
} from './AddLiquidity/redirects'
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects'
import { OpenClaimAddressModalAndRedirectToSwap, RedirectPathToSwapOnly, RedirectToSwap } from './Swap/redirects'

import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter'
import AddressClaimModal from '../components/claim/AddressClaimModal'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Polling from '../components/Polling'
import URLWarning from '../components/Header/URLWarning'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import TabSwapLiquidity from '../components/TabSwapLiquidity'
import WeeklyRanking from '../components/WeeklyRanking'

import AddLiquidity from './AddLiquidity'
import Earn from './Earn'
import Manage from './Earn/Manage'
import MigrateV1 from './MigrateV1'
import MigrateV1Exchange from './MigrateV1/MigrateV1Exchange'
import RemoveV1Exchange from './MigrateV1/RemoveV1Exchange'
import PoolFinder from './PoolFinder'
import RemoveLiquidity from './RemoveLiquidity'
import Swap from './Swap'
import Vote from './Vote'
import VotePage from './Vote/VotePage'
import MyAccountPage from './MyAccount'
import Pool from './Pool'
import Farms from './Farms'
import Farm from './Farm'

import { ReactComponent as LogoForMobileResponsive } from '../assets/images/logo_for_mobile_responsive.svg'

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

const LogoResponsive = styled(LogoForMobileResponsive)`
  display: none;
  width: 140px;
  height: 20px;
  margin-bottom: 20px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: unset;
  `};
`

function TopLevelModals() {
  const open = useModalOpen(ApplicationModal.ADDRESS_CLAIM)
  const toggle = useToggleModal(ApplicationModal.ADDRESS_CLAIM)
  return <AddressClaimModal isOpen={open} onDismiss={toggle} />
}

function OnlyShowAtSwapAndAddLiquidityPages({ children }: { children?: React.ReactNode }) {
  const location = useLocation()
  const { pathname } = location
  return children && (pathname.startsWith('/swap') || pathname.startsWith('/add')) ? <>{children}</> : null
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
          <Polling />
          <TopLevelModals />
          <OnlyShowAtSwapAndAddLiquidityPages>
            <LogoResponsive />
            <TabSwapLiquidity />
          </OnlyShowAtSwapAndAddLiquidityPages>
          <Web3ReactManager>
            <Switch>
              <Route exact strict path="/swap" component={Swap} />
              <Route exact strict path="/claim" component={OpenClaimAddressModalAndRedirectToSwap} />
              <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
              <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
              <Route exact strict path="/find" component={PoolFinder} />
              <Route exact strict path="/pool" component={Pool} />
              <Route exact strict path="/staking" component={Farms} />
              <Route exact strict path="/staking/:farmId" component={Farm} />
              <Route exact strict path="/uni" component={Earn} />
              <Route exact strict path="/vote" component={Vote} />
              <Route exact strict path="/create" component={RedirectToAddLiquidity} />
              <Route exact path="/add" component={AddLiquidity} />
              <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
              <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
              {/*<Route exact path="/create" component={AddLiquidity} />*/}
              {/*<Route exact path="/create/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />*/}
              {/*<Route exact path="/create/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />*/}
              <Route exact strict path="/remove/v1/:address" component={RemoveV1Exchange} />
              <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
              <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />
              <Route exact strict path="/migrate/v1" component={MigrateV1} />
              <Route exact strict path="/migrate/v1/:address" component={MigrateV1Exchange} />
              <Route exact strict path="/uni/:currencyIdA/:currencyIdB" component={Manage} />
              <Route exact strict path="/vote/:id" component={VotePage} />
              <Route exact strict path="/my-account" component={MyAccountPage} />
              <Route component={RedirectPathToSwapOnly} />
            </Switch>
          </Web3ReactManager>
          <OnlyShowAtSwapAndAddLiquidityPages>
            <WeeklyRanking />
          </OnlyShowAtSwapAndAddLiquidityPages>
        </BodyWrapper>
        <Marginer />
        <FooterWrapper>
          <Footer />
        </FooterWrapper>
      </AppWrapper>
    </>
  )
}
