import React, { memo, useEffect, useState } from 'react'
import styled from 'styled-components'
import { StyledCloseIcon as CloseIcon } from '../../theme'
import ChibiSvg from 'assets/svg/chibi_1.svg'
import { Chibi } from '../../components/BubbleMessage'
import Row, { RowFixed } from '../../components/Row'
import Column from 'components/Column'
import { Text } from 'rebass'
import { useTranslation } from 'react-i18next'
import CheckedIcon from 'assets/svg/checked.svg'
import useTheme from '../../hooks/useTheme'

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
    const showAddLiquidityGuidePopup = localStorage.getItem('show_add_liquidity_guide_popup')

    if (showAddLiquidityGuidePopup === 'no') return
    setShow(true)
  }, [])

  if (!show) return null

  return (
    <GuidePopupWrapper>
      <CloseIconWrapper onClick={() => setShow(false)}>
        <CloseIcon size="12px" />
      </CloseIconWrapper>
      <Row gap="16px" align="flex-start">
        <Column gap="16px">
          <Text fontWeight={700} fontSize={20}>
            {t('What is the difference between simple and advance?')}
          </Text>
          <RowFixed gap="8px">
            <img src={CheckedIcon} alt="checked-icon" />
            <Text fontWeight={400} fontSize={16} color={theme.text3Sone}>
              {t('Simple provides liquidity with 1 token')}
            </Text>
          </RowFixed>
          <RowFixed gap="8px">
            <img src={CheckedIcon} alt="checked-icon" />
            <Text fontWeight={400} fontSize={16} color={theme.text3Sone}>
              {t('Advance provides liquidity with 2 tokens')}
            </Text>
          </RowFixed>
          <Text
            fontWeight={500}
            fontSize={16}
            color={theme.text9Sone}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setShow(false)
              localStorage.setItem('show_add_liquidity_guide_popup', 'no')
            }}
          >
            {t('dont_show_again')}
          </Text>
        </Column>
        <Chibi src={ChibiSvg} alt="chibi" />
      </Row>
    </GuidePopupWrapper>
  )
})
