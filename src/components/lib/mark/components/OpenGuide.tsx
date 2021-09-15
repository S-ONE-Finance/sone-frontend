/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useGuideStepManager } from '../../../../state/user/hooks'
import { SwapStep7 } from './index'
import { OpenGuideProps } from './styled'
import { QuestionHelper1416 } from '../../../QuestionHelper'
import useTheme from '../../../../hooks/useTheme'

export default function OpenGuide({ screen }: OpenGuideProps) {
  const { t } = useTranslation()
  const theme = useTheme()
  const [guideStep, updateStepGuide] = useGuideStepManager()

  const openGuidePopup = (isGuide: boolean, screen: string) => {
    updateStepGuide({ ...guideStep, step: 1, oldStep: 0, isGuide, screen })
  }

  const onClickBtn = () => {
    if (guideStep.showAgain) {
      openGuidePopup(true, screen)
    }
  }

  useEffect(() => {
    openGuidePopup(false, '')

    return () => {
      openGuidePopup(false, '')
    }
  }, [])

  return (
    <>
      {!guideStep.isGuide && <SwapStep7 screen={screen} />}
      <StyledOpenGuideWrapper onClick={onClickBtn}>
        <StyledOpenGuide>
          <QuestionHelper1416 text={t('question_helper_open_guide_for_beginners')} color={theme.text5Sone} />
          {t('open_guide_for_beginners')}
        </StyledOpenGuide>
      </StyledOpenGuideWrapper>
    </>
  )
}

const StyledOpenGuideWrapper = styled.div`
  // position: absolute;
  // left: 100px;
  // bottom: 180px;
  // z-index: 1;
  // ${({ theme }) => theme.mediaWidth.upToMedium`
  //   left: auto;
  //   bottom: 295px;
  // `};

  // ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  //   bottom: 540px;
  // `};
`

const StyledOpenGuide = styled.div`
  padding: 16px 20px;
  font-weight: bold;
  font-size: 16px;
  color: rgb(63, 170, 176);
  cursor: pointer;
  display: flex;
  align-items: center;

  & > div {
    margin-right: 5px;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 16px;
    padding: 15px 20px;
  `};
`
