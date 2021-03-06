import React, { useEffect, useState } from 'react'
import { Route } from 'react-router-dom'
import styled from 'styled-components'
import { useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'

import { ApplicationModal } from '../state/application/actions'
import { useModalOpen, useToggleModal } from '../state/application/hooks'
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader'

import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter'
import AddressClaimModal from '../components/claim/AddressClaimModal'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Polling from '../components/Polling'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import AbsolutePendingTxs from '../components/AbsolutePendingTxs'

import Routing from './Routing'
import Mark from '../components/lib/mark/Mark'
import Notice from '../components/Notice'

const AppWrapper = styled.div<{ pathC?: string }>`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
  min-height: 100vh;
  position: relative;
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url(${({ theme, pathC }) => (pathC === '/staking' ? 'unset' : theme.bgImage)});
  background-size: cover;

  ${({ theme, pathC }) => theme.mediaWidth.upToLarge`
      background-image: url(${({ theme }) => (pathC === '/staking' ? 'unset' : theme.bgImageUpToLarge)});
    `}

  ${({ theme, pathC }) => theme.mediaWidth.upToSmall`
      background-image: url(${({ theme }) => (pathC === '/staking' ? 'unset' : theme.bgImageUpToSmall)});
    `}

  ${({ theme, pathC }) => theme.mediaWidth.upToExtraSmall`
      background-image: url(${({ theme }) => (pathC === '/staking' ? 'unset' : theme.bgImageUpToExtraSmall)});
    `}
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`

const BodyWrapper = styled.div<{ pathC?: string }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  padding: ${({ pathC }) => (pathC === '/staking' ? 'unset' : '0 1rem 8.75rem 1rem')};

  ${({ theme, pathC }) => theme.mediaWidth.upToSmall`
    padding: ${pathC === '/staking' ? 'unset' : '0 1rem 7.75rem 1rem'};
  `};
`

const FooterWrapper = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 45px;
  z-index: 1;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    bottom: 4.5rem; // 72px
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

export default function App() {
  // Trigger i18next in entire app.
  useTranslation()

  const location = useLocation()
  const { pathname } = location

  const [isDisplayMaintenanceNotice, setIsDisplayMaintenanceNotice] = useState<boolean>(true)

  // notice
  useEffect(() => {
    if (sessionStorage.getItem('is_display_maintenance_notice') === '0') {
      setIsDisplayMaintenanceNotice(false)
    }
  }, [])

  const onCloseMaintenanceNotice = () => {
    setIsDisplayMaintenanceNotice(false)
    sessionStorage.setItem('is_display_maintenance_notice', '0')
  }

  return (
    <>
      <Route component={GoogleAnalyticsReporter} />
      <Route component={DarkModeQueryParamReader} />
      <AppWrapper>
        <HeaderWrapper>
          <Header />
        </HeaderWrapper>
        <BodyWrapper pathC={pathname}>
          <Popups />
          <Polling />
          <TopLevelModals />
          <AbsolutePendingTxs />
          <Web3ReactManager>
            <Routing />
          </Web3ReactManager>
        </BodyWrapper>
        <FooterWrapper>
          <Footer />
        </FooterWrapper>
        <div>
          <Mark />
        </div>
        <Notice
          isDisplay={isDisplayMaintenanceNotice}
          title="Maintenance Notice"
          content={
            <div>
              <p>
                <div>We are checking the system in preparation for developing an upgrade.</div>
                <div>
                  You can still use the system without any problems, but we recommend that you use the service after
                  April.
                </div>
                <div>The roadmap is here.</div>
              </p>
            </div>
          }
          link="https://twitter.com/Sone_finance/status/1498208436110397444"
          onClose={onCloseMaintenanceNotice}
        />
      </AppWrapper>
    </>
  )
}
