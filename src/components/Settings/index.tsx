import React, { useState } from 'react'
import { Settings, X } from 'react-feather'
import { Text } from 'rebass'
import styled from 'styled-components'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleSettingsMenu } from '../../state/application/hooks'
import {
  useExpertModeManager,
  useUserTransactionTTL,
  useUserSlippageTolerance,
  useIsDarkMode
} from '../../state/user/hooks'
import { CloseIcon } from '../../theme'
import { ButtonError } from '../Button'
import { AutoColumn } from '../Column'
import Modal from '../Modal'
import QuestionHelper from '../QuestionHelper'
import { RowBetween, RowFixed } from '../Row'
import Toggle from '../Toggle'
import TransactionSettings from '../TransactionSettings'
import SwapVectorLight from '../../assets/images/swap-vector-light.svg'
import SwapVectorDark from '../../assets/images/swap-vector-dark.svg'
import { ReactComponent as ExpertIcon } from '../../assets/svg/expert_icon.svg'
import { useTranslation } from 'react-i18next'

const StyledMenuIcon = styled(Settings)`
  height: 20px;
  width: 20px;

  > * {
    stroke: ${({ theme }) => theme.text2};
  }

  :hover {
    opacity: 0.7;
  }
`

const StyledCloseIcon = styled(X)`
  height: 20px;
  width: 20px;
  :hover {
    cursor: pointer;
  }

  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`

const StyledMenuButton = styled.button`
  position: relative;
  width: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  height: 35px;
  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
  }

  svg {
    margin-top: 2px;
  }
`
const EmojiWrapper = styled.div`
  position: absolute;
  bottom: -6px;
  right: 0;
  font-size: 14px;
`

const StyledMenu = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

const MenuFlyout = styled.span`
  position: relative;
  min-width: 20.125rem;
  background-color: ${({ theme }) => theme.bg1Sone};
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.01), 0 4px 8px rgba(0, 0, 0, 0.04), 0 16px 24px rgba(0, 0, 0, 0.04),
    0 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  width: 100%;
  z-index: 100;
  padding: 2.5rem;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    min-width: 18.125rem;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 20px;
  `};
`

const Break = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.bg3};
`

const ModalContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  background-color: ${({ theme }) => theme.bg2};
  border-radius: 20px;
`

const Title = styled.div`
  font-size: 40px;
  font-weight: 700;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 20px;
  `};
`

export const SectionWrapper = styled(AutoColumn)`
  grid-row-gap: 35px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    grid-row-gap: 20px;
  `};
`

export const ResponsiveAutoColumn = styled(AutoColumn)`
  grid-row-gap: 15px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    grid-row-gap: 10px;
  `};
`

const TitleBodyMarginer = styled(AutoColumn)`
  grid-row-gap: 15px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    grid-row-gap: 20px;
  `};
`

export const SectionHeading = styled.div`
  font-size: 20px;
  font-weight: 500;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 1rem;
  `};
`

const SwapVector = styled.img`
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  width: 177.12px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    bottom: 1rem;
    right: 1rem;
    width: 119.71px;
  `};
`

const StyledExpertIcon = styled(ExpertIcon)`
  margin-right: 7px;

  path {
    stroke: ${({ theme }) => theme.text1};
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 22px;
    height: 18px;
    margin-right: 1px;
  `};
`

export default function SettingsTab() {
  const { t } = useTranslation()
  const isDarkMode = useIsDarkMode()
  const open = useModalOpen(ApplicationModal.SETTINGS)
  const toggle = useToggleSettingsMenu()

  const [userSlippageTolerance, setUserSlippageTolerance] = useUserSlippageTolerance()

  const [ttl, setTtl] = useUserTransactionTTL()

  const [expertMode, toggleExpertMode] = useExpertModeManager()

  // show confirmation view before turning on
  const [showConfirmation, setShowConfirmation] = useState(false)

  return (
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    <StyledMenu>
      <Modal isOpen={showConfirmation} onDismiss={() => setShowConfirmation(false)} maxHeight={100}>
        <ModalContentWrapper>
          <AutoColumn gap="lg">
            <RowBetween style={{ padding: '0 2rem' }}>
              <div />
              <Text fontWeight={500} fontSize={20}>
                {t('are-you-sure')}
              </Text>
              <StyledCloseIcon onClick={() => setShowConfirmation(false)} />
            </RowBetween>
            <Break />
            <AutoColumn gap="lg" style={{ padding: '0 2rem' }}>
              <Text fontWeight={500} fontSize={20}>
                {t('expert-mode-warning-msg-desc')}
              </Text>
              <Text fontWeight={600} fontSize={20}>
                {t('only-use-this-mode-if-u-know-what-u-are-doing')}
              </Text>
              <ButtonError
                error={true}
                padding={'12px'}
                onClick={() => {
                  if (window.prompt(`Please type the word "confirm" to enable expert mode.`) === 'confirm') {
                    toggleExpertMode()
                    setShowConfirmation(false)
                  }
                }}
              >
                <Text fontSize={20} fontWeight={500} id="confirm-expert-mode">
                  {t('turn-on-expert-mode')}
                </Text>
              </ButtonError>
            </AutoColumn>
          </AutoColumn>
        </ModalContentWrapper>
      </Modal>
      <StyledMenuButton onClick={toggle} id="open-settings-dialog-button">
        <StyledMenuIcon />
        {expertMode ? (
          <EmojiWrapper>
            <span role="img" aria-label="wizard-icon">
              🧙
            </span>
          </EmojiWrapper>
        ) : null}
      </StyledMenuButton>
      {open && (
        <Modal isOpen={open} onDismiss={toggle}>
          <MenuFlyout>
            <SwapVector src={isDarkMode ? SwapVectorDark : SwapVectorLight} alt="swap-vector" />
            <TitleBodyMarginer>
              <RowBetween>
                <Title>{t('settings')}</Title>
                <CloseIcon onClick={toggle} />
              </RowBetween>
              <SectionWrapper>
                <TransactionSettings
                  rawSlippage={userSlippageTolerance}
                  setRawSlippage={setUserSlippageTolerance}
                  deadline={ttl}
                  setDeadline={setTtl}
                />
                <ResponsiveAutoColumn>
                  <RowFixed>
                    <StyledExpertIcon />
                    <SectionHeading>{t('expert-mode')}</SectionHeading>
                    <QuestionHelper text={t('question-helper-expert-mode')} />
                  </RowFixed>
                  <Toggle
                    id="toggle-expert-mode-button"
                    isActive={expertMode}
                    toggle={
                      expertMode
                        ? () => {
                            toggleExpertMode()
                            setShowConfirmation(false)
                          }
                        : () => {
                            toggle()
                            setShowConfirmation(true)
                          }
                    }
                  />
                </ResponsiveAutoColumn>
              </SectionWrapper>
            </TitleBodyMarginer>
          </MenuFlyout>
        </Modal>
      )}
    </StyledMenu>
  )
}
