import React, { memo, useEffect, useState } from 'react'
import styled from 'styled-components'
import { StyledCloseIcon as CloseIcon } from '../../theme'
import Row, { RowFixed } from '../../components/Row'
import Column from 'components/Column'
import { Text } from 'rebass'
import { Trans, useTranslation } from 'react-i18next'
import CheckedIcon from 'assets/svg/checked.svg'
import useTheme from '../../hooks/useTheme'
import { ButtonStake, ButtonUnstake } from '../MyAccount/components'
import { S_ONE_FAQ_URL } from '../../constants/urls'

const GuidePopupWrapper = styled.div`
  position: fixed;
  right: 16px;
  bottom: 100px;
  background: ${({ theme }) => theme.bg1Sone};
  color: ${({ theme }) => theme.text6Sone};
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.16);
  border-radius: 17px;
  padding: 16px;
  max-width: 425px;
  z-index: 1;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    display:none; 
  `}
`

const CloseIconWrapper = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
`

export default memo(function GuidePopup() {
  const { t } = useTranslation()
  const theme = useTheme()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const showStakeGuidePopup = localStorage.getItem('show_stake_guide_popup')

    if (showStakeGuidePopup === 'no') return
    setShow(true)
  }, [])

  if (!show) return null

  return (
    <GuidePopupWrapper>
      <CloseIconWrapper onClick={() => setShow(false)}>
        <CloseIcon size="12px" />
      </CloseIconWrapper>
      <Column gap="16px" style={{ padding: '0 16px 0 0' }}>
        <RowFixed gap="8px">
          <img src={CheckedIcon} alt="checked-icon" />
          <Text fontWeight={400} fontSize={16} color={theme.text3Sone}>
            <Trans
              i18nKey="During the first 8 weeks since launch, 25% of your earned SONE is available to unlock."
              components={[<Text display="inline" key="0" fontWeight={700} fontSize={16} color={theme.text5Sone} />]}
            />
          </Text>
        </RowFixed>
        <RowFixed gap="8px">
          <img src={CheckedIcon} alt="checked-icon" />
          <Text fontWeight={400} fontSize={16} color={theme.text3Sone}>
            {t('Beginning December 1st, 2021, the remaining 75% will be unlocked linearly every block over 1 year.')}
          </Text>
        </RowFixed>
        <Row justify="center" gap="16px">
          <ButtonUnstake
            style={{
              minHeight: '40px',
              minWidth: '145px',
              fontSize: '16px',
              fontWeight: 500,
              color: theme.black
            }}
            onClick={() => {
              setShow(false)
              localStorage.setItem('show_stake_guide_popup', 'no')
            }}
          >
            {t('dont_show_again')}
          </ButtonUnstake>
          <ButtonStake
            style={{
              minHeight: '40px',
              minWidth: '145px',
              fontSize: '16px',
              fontWeight: 500
            }}
            onClick={() => {
              window.open(S_ONE_FAQ_URL, '_blank')
            }}
          >
            {t('see_details')}
          </ButtonStake>
        </Row>
      </Column>
    </GuidePopupWrapper>
  )
})
