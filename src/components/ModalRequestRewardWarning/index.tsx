import React, { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from 'rebass'
import styled from 'styled-components'

import ChibiSrc from 'assets/svg/chibi_2.svg'

import { useIsUpToExtraSmall } from 'hooks/useWindowSize'

import Modal from 'components/Modal'
import Column from '../Column'
import {
  ButtonStayTuned,
  ButtonUnstakeAnyway,
  Chibi,
  ModalContent,
  RowDesktopColumnMobile,
  TextDefault
} from 'components/ModalUnstakeWarning'

const TextPrimary2 = styled(Text)`
  color: ${({ theme }) => theme.red1Sone};
  font-weight: 700;
  font-size: 30px;
  margin-top: 8px;

  &::after {
    content: 'SONE';
    font-size: 20px;
    color: ${({ theme }) => theme.text1Sone};
    margin-left: 1ch;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 20px;
  
    &::after {
      font-size: 13px;
    }
  `}
`

export default memo(function ModalRequestRewardWarning({
  onRequestReward,
  formattedAvailableSONE,
  isOpen,
  onDismiss
}: {
  onRequestReward: () => void
  formattedAvailableSONE: string
  isOpen: boolean
  onDismiss: () => void
}) {
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const { t } = useTranslation()

  const _onRequestReward = useCallback(() => {
    onRequestReward()
    onDismiss()
  }, [onDismiss, onRequestReward])

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <ModalContent gap={isUpToExtraSmall ? '23px' : '32px'}>
        <RowDesktopColumnMobile gaps={['22px', '60px']}>
          <Chibi src={ChibiSrc} alt="chibi" />
          <Column align={isUpToExtraSmall ? 'center' : undefined} width="fit-content">
            <TextDefault>{t('you_will_receive_request_reward')}</TextDefault>
            <TextPrimary2>{formattedAvailableSONE}</TextPrimary2>
          </Column>
        </RowDesktopColumnMobile>
        <RowDesktopColumnMobile gaps={['15px', '20px']}>
          {isUpToExtraSmall ? (
            <>
              <ButtonStayTuned onClick={_onRequestReward}>{t('request_reward')}</ButtonStayTuned>
              <ButtonUnstakeAnyway onClick={onDismiss}>{t('later')}</ButtonUnstakeAnyway>
            </>
          ) : (
            <>
              <ButtonUnstakeAnyway onClick={onDismiss}>{t('later')}</ButtonUnstakeAnyway>
              <ButtonStayTuned onClick={_onRequestReward}>{t('request_reward')}</ButtonStayTuned>
            </>
          )}
        </RowDesktopColumnMobile>
      </ModalContent>
    </Modal>
  )
})
