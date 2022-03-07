import React from 'react'
import styled from 'styled-components'
import { X } from 'react-feather'
import { useIsDarkMode } from 'state/user/hooks'
import SwapGradientIcon from 'assets/images/swap-gradient.png'

const NoticeWrapper = styled.div<{ isDisplay?: boolean }>`
  display: ${({ theme, isDisplay }) => (isDisplay ? 'block' : 'none')};
  position: fixed;
  bottom: 85px;
  right: 35px;
  box-shadow: 0px 4px 40px rgba(0, 0, 0, 0.15);
  border-radius: 40px;
  width: 596px;
  height: 440px;
  padding: 32px 60px 36px 56px;
  background: ${({ theme }) => theme.bg1Sone};
`

const NoticeTitle = styled.div<{}>`
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 28px;
  line-height: 33px;
  color: ${({ theme }) => theme.text1Sone};
`

const NoticeContent = styled.div<{}>`
  margin-top: 20px;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 28px;
  line-height: 33px;
  color: ${({ theme }) => theme.text1Sone};
`

const NoticeCloseButton = styled.div<{}>`
  position: absolute;
  cursor: pointer;
  right: 56px;
  top: 36px;
  color: ${({ theme }) => theme.text1Sone};
`

const NoticeLink = styled.a<{}>`
  overflow-wrap: break-word;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 28px;
  line-height: 33px;
  color: ${({ theme }) => theme.text7Sone};
`

const NoticeIcon = styled.img<{}>`
  position: absolute;
  right: 80px;
  top: 20px;
  width: 120px;
  height: 105px;
  object-fit: cover;
  z-index: -1;
`

export interface NoticeProps {
  isDisplay: boolean
  title?: string
  content?: JSX.Element
  link?: string
  onClose: () => void
}

export default function Notice({ isDisplay, title, content, link, onClose }: NoticeProps) {
  const darkMode = useIsDarkMode()

  return (
    <NoticeWrapper isDisplay={isDisplay}>
      <NoticeIcon src={SwapGradientIcon} style={{ display: darkMode ? 'none' : 'block' }}></NoticeIcon>
      <NoticeCloseButton onClick={onClose}>
        <X size={24} />
      </NoticeCloseButton>
      <NoticeTitle>{title}</NoticeTitle>
      <NoticeContent>{content}</NoticeContent>
      <NoticeLink href={link}>{link}</NoticeLink>
    </NoticeWrapper>
  )
}
