import React, { useState } from 'react'
import { Settings as SettingsIcon } from 'react-feather'
import { Text } from 'rebass'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleSettingsMenu } from '../../state/application/hooks'
import { useExpertModeManager, useUserTransactionTTL, useUserSlippageTolerance } from '../../state/user/hooks'
import { ButtonError } from '../Button'
import { AutoColumn } from '../Column'
import Modal from '../Modal'
import QuestionHelper from '../QuestionHelper'
import { RowBetween, RowFixed } from '../Row'
import Toggle from '../Toggle'
import TransactionSettings from '../TransactionSettings'
import { ReactComponent as ExpertIcon } from '../../assets/svg/expert_icon.svg'
import { ReactComponent as GlassesIcon } from '../../assets/svg/glasses_icon.svg'
import useTheme from '../../hooks/useTheme'
import { StyledCloseIcon } from '../../theme'
import AppVector from '../AppBodyTitleDescriptionSettings/AppVector'
import { TransactionType } from '../../state/transactions/types'

const StyledSettingsIcon = styled(SettingsIcon)`
  width: 24px;
  height: auto;

  > * {
    stroke: ${({ theme }) => theme.text5Sone};
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 14px;
  `};
`

const StyledGlassesIcon = styled(GlassesIcon)`
  width: 24px;
  height: auto;

  > * {
    stroke: ${({ theme }) => theme.text5Sone};
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 14px;
  `};
`

const StyledMenuButton = styled.button`
  position: relative;
  border: none;
  background-color: transparent;
  margin: 0;
  width: 36px;
  height: 36px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 7px;
  border: ${({ theme }) => `2px solid ${theme.text5Sone}`};

  :hover {
    cursor: pointer;
    outline: none;
    opacity: 0.7;
  }

  :focus {
    outline: none;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 22px;
    height: 22px;
    border-radius: 5px;
  `};
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
  background-color: ${({ theme }) => theme.bg1Sone};
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
  grid-row-gap: 2.1875rem;

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

const AbsoluteVector = styled.div`
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  width: 177.1px;
  height: 177.1px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    bottom: 1rem;
    right: 1rem;
    width: 119.7px;
    height: 119.7px;
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

export default function Settings({ transactionType }: { transactionType: TransactionType }) {
  const { t } = useTranslation()
  const open = useModalOpen(ApplicationModal.SETTINGS)
  const toggle = useToggleSettingsMenu()
  const theme = useTheme()

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
                {t('are_you_sure')}
              </Text>
              <StyledCloseIcon onClick={() => setShowConfirmation(false)} />
            </RowBetween>
            <Break />
            <AutoColumn gap="lg" style={{ padding: '0 2rem' }}>
              <Text fontWeight={500} fontSize={20}>
                {t(`expert_mode_description`)}
              </Text>
              <Text fontWeight={600} fontSize={20}>
                {t('expert_mode_warning')}
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
                  {t('turn_on_expert_mode')}
                </Text>
              </ButtonError>
            </AutoColumn>
          </AutoColumn>
        </ModalContentWrapper>
      </Modal>
      <RowFixed>
        {expertMode && (
          <Text fontSize={13} fontWeight={700} color={theme.text5Sone} marginRight={'8px'} width="max-content">
            {t('expert')}
          </Text>
        )}
        <StyledMenuButton onClick={toggle} id="open-settings-dialog-button">
          {expertMode ? <StyledGlassesIcon /> : <StyledSettingsIcon />}
        </StyledMenuButton>
      </RowFixed>
      {open && (
        <Modal isOpen={open} onDismiss={toggle}>
          <MenuFlyout>
            <AbsoluteVector>
              <AppVector transactionType={transactionType} size="100%" sizeMobile="100%" />
            </AbsoluteVector>
            <TitleBodyMarginer>
              <RowBetween>
                <Title>{t('swap_setting')}</Title>
                <StyledCloseIcon onClick={toggle} />
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
                    <SectionHeading>{t('expert_mode')}</SectionHeading>
                    <QuestionHelper text={t('question_helper_expert_mode')} />
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
