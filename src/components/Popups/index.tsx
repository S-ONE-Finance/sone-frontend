import React from 'react'
import styled from 'styled-components'
import { useActivePopups } from '../../state/application/hooks'
import { AutoColumn } from '../Column'
import PopupItem from './PopupItem'
import ClaimPopup from './ClaimPopup'
import { useURLWarningVisible } from '../../state/user/hooks'

const MobilePopupWrapper = styled.div<{ height: string | number }>`
  position: relative;
  max-width: 100%;
  height: ${({ height }) => height};
  margin: ${({ height }) => (height ? '20px auto 0' : 0)};
  display: none;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    display: block;
  `};

  ${({ theme, height }) => theme.mediaWidth.upToExtraSmall`
    margin: ${height ? '20px auto' : 0};
  `};
`

const MobilePopupInner = styled.div`
  height: 99%;
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  flex-direction: row;
  -webkit-overflow-scrolling: touch;
  ::-webkit-scrollbar {
    display: none;
  }
`

const FixedPopupColumn = styled(AutoColumn)<{ extraPadding: boolean }>`
  position: fixed;
  top: ${({ extraPadding }) => (extraPadding ? '108px' : '88px')};
  right: 1rem;
  max-width: 400px !important;
  width: 100%;
  z-index: 1;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    display: none;
  `};
`

export default function Popups() {
  // Get all popups.
  const activePopups = useActivePopups()

  const urlWarningActive = useURLWarningVisible()

  return (
    <>
      <FixedPopupColumn gap="20px" extraPadding={urlWarningActive}>
        <ClaimPopup />
        {activePopups.map(item => (
          <PopupItem key={item.key} content={item.content} popKey={item.key} removeAfterMs={item.removeAfterMs} />
          // <PopupItem key={item.key} content={item.content} popKey={item.key} removeAfterMs={null} />
        ))}
      </FixedPopupColumn>
      <MobilePopupWrapper height={activePopups?.length > 0 ? 'fit-content' : 0}>
        <MobilePopupInner>
          {activePopups // reverse so new items up front
            .slice(0)
            .reverse()
            .map(item => (
              <PopupItem key={item.key} content={item.content} popKey={item.key} removeAfterMs={item.removeAfterMs} />
              // <PopupItem key={item.key} content={item.content} popKey={item.key} removeAfterMs={null} />
            ))}
        </MobilePopupInner>
      </MobilePopupWrapper>
    </>
  )
}
