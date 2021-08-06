/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useGuideStepManager } from '../../../../state/user/hooks'
import { SwapStep7 } from './index'
import { OpenGuideProps } from './styled'

export default function OpenGuide({ screen }: OpenGuideProps) {
  const { t } = useTranslation()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [guideStep, updateStepGuide] = useGuideStepManager()

  const openGuidePopup = (isGuide: boolean, screen: string) => {
    updateStepGuide({ step: 1, oldStep: 0, isGuide, screen })
  }

  const onClickBtn = () => {
    openGuidePopup(true, screen)
  }

  useEffect(() => {
    openGuidePopup(false, '')
  }, [])

  return (
    <>
      <SwapStep7 screen={screen} />
      <StyledOpenGuideWrapper onClick={onClickBtn}>
        <StyledOpenGuide>
          <QuestionWrapper>
            <Question>?</Question>
          </QuestionWrapper>
          {t('Open Guide For Beginners')}
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
  font-size: 20px;
  color: rgb(63, 170, 176);
  // background-color: #fff;
  // border-radius: 26px;
  cursor: pointer;
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 16px;
    padding: 15px 20px;
  `};
`

const QuestionWrapper = styled.div`
  width: 25px;
  height: 25px;
  margin-right: 10px;
  border-radius: 50%;
  border: 1px solid rgb(63, 170, 176);
  color: rgb(63, 170, 176);

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 20px;
    height: 20px;
    margin-right: 5px;
  `};
`

const Question = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
