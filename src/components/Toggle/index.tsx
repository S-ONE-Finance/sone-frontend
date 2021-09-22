import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

const ToggleElement = styled.span<{ isActive?: boolean }>`
  font-size: 1rem;
  height: 100%;
  width: 50%;
  padding: 0.35rem 0.6rem;
  border-radius: 10px;
  background: ${({ theme, isActive }) => isActive && theme.red1Sone};
  color: ${({ theme, isActive }) => (isActive ? theme.white : theme.text4Sone)};
  font-weight: ${({ isActive }) => (isActive ? '700' : '500')};
  display: flex;
  align-items: center;
  justify-content: center;
`

const StyledToggle = styled.button<{ isActive?: boolean; activeElement?: boolean }>`
  border-radius: 10px;
  height: 39px;
  width: 129px;
  border: none;
  background: ${({ theme }) => theme.bg5Sone};
  display: flex;
  cursor: pointer;
  outline: none;
  padding: 0;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    height: 2.1875rem;
  `};
`

export interface ToggleProps {
  id?: string
  isActive: boolean
  toggle: () => void
}

export default function Toggle({ id, isActive, toggle }: ToggleProps) {
  const { t } = useTranslation()

  return (
    <StyledToggle id={id} isActive={isActive} onClick={toggle}>
      <ToggleElement isActive={isActive}>{t('on')}</ToggleElement>
      <ToggleElement isActive={!isActive}>{t('off')}</ToggleElement>
    </StyledToggle>
  )
}
