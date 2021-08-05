/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useGuideStepManager } from '../../../../state/user/hooks'

import { OpenGuideProps } from './styled'

export default function OpenGuide({ screen }: OpenGuideProps) {
  const { t } = useTranslation()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [guideStep, updateStepGuide] = useGuideStepManager()

  const [showBtn, setShowBtn] = useState(true)

  const openGuidePopup = (isGuide: boolean, screen: string) => {
    updateStepGuide({ step: 1, oldStep: 0, isGuide, screen })
  }

  const onClickBtn = () => {
    setShowBtn(false)
    openGuidePopup(true, screen)
  }

  useEffect(() => {
    openGuidePopup(false, '')
  }, [])

  return (
    <>
      {showBtn && (
        <StyledOpenGuideWrapper onClick={onClickBtn}>
          <StyledOpenGuide>{t('Open Guide For Beginners')}</StyledOpenGuide>
        </StyledOpenGuideWrapper>
      )}
    </>
  )
}

const StyledOpenGuideWrapper = styled.div`
  position: absolute;
  left: 100px;
  bottom: 180px;
`

const StyledOpenGuide = styled.div`
  padding: 16px 20px;
  font-weight: bold;
  font-size: 20px;
  color: rgb(63, 170, 176);
  background-color: #fff;
  border-radius: 26px;
  cursor: pointer;
`
