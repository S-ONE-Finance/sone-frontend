/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { useGuideStepManager } from '../../../../state/user/hooks'

import { SwapStep6, SwapStep7 } from './index'
import { arrowLeft, arrowRight, arrowSkip } from './assets'

const StyledMarkWrapper = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
`

const StyledMark = styled.div`
  // position: relative;
`

const StyledMarkPagination = styled.div`
  width: 100%;
  position: absolute;
  bottom: 124px;
  padding: 0 61px 0 88px;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    padding: 0 41px 0 68px;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 0 1rem;
  `};
`

const StyledMarkPaginationButtonGroup = styled.div`
  display: flex;
  align-items: center;
  // justify-content: space-between;
  margin-bottom: 50px;
`

const StyledMarkPaginationButton = styled.div`
  font-weight: 500;
  font-size: 36px;
  color: #fff;
  cursor: pointer;
  ${({ theme }) => theme.mediaWidth.upToLarge`
     font-size: 26px;
  `};
`

const StyledMarkPaginationButtonRight = styled(StyledMarkPaginationButton)`
  margin-left: auto;
  margin-right: 0;
`

const StyledMarkPaginationButtonSkip = styled.div`
  font-weight: 500;
  font-size: 36px;
  color: #fff;
  text-align: right;
  cursor: pointer;
  ${({ theme }) => theme.mediaWidth.upToLarge`
     font-size: 26px;
  `};
`

const Mark = () => {
  const { t } = useTranslation()
  const [guideStep, updateStepGuide] = useGuideStepManager()

  const handleCheckStep = (stepClass: string, type: string) => {
    if (type === 'new') {
      const allEl = document.getElementsByClassName(stepClass) as HTMLCollectionOf<HTMLElement>
      for (let i = 0; i < allEl.length; i++) {
        allEl[i].style.zIndex = '1001'
        allEl[i].style.pointerEvents = 'none'
      }
    } else {
      const allEl = document.getElementsByClassName(stepClass) as HTMLCollectionOf<HTMLElement>
      for (let i = 0; i < allEl.length; i++) {
        allEl[i].style.zIndex = 'unset'
        allEl[i].style.pointerEvents = 'unset'
      }
    }
  }

  const handleNext = (step: number | undefined) => {
    if (!step) return
    const newStep = step + 1
    updateStepGuide({ ...guideStep, step: newStep, oldStep: step })
  }

  const handlePrevious = (step: number | undefined) => {
    if (!step || step === 1) return
    const newStep = step - 1
    updateStepGuide({ ...guideStep, step: newStep, oldStep: step })
  }

  const handleSkip = () => {
    updateStepGuide({ ...guideStep, step: 1, oldStep: 0, isGuide: false, screen: '' })
  }

  const handleReset = () => {
    handleSkip()
    for (let i = 1; i < 8; i++) {
      handleCheckStep(`step-${i}`, 'old')
    }
  }

  useEffect(() => {
    return () => {
      handleReset()
    }
  }, [])

  useEffect(() => {
    if (guideStep.isGuide) {
      console.log(guideStep.oldStep)

      if (guideStep.oldStep) handleCheckStep(`step-${guideStep.oldStep}`, 'old')
      handleCheckStep(`step-${guideStep.step}`, 'new')
    }
  }, [guideStep])

  return (
    <>
      {guideStep.isGuide && (
        // (guideStep.step === 7 && guideStep.screen === 'swap' ? (
        //   <SwapStep7 />
        // ) : (
        <StyledMarkWrapper id="swap-mark">
          <StyledMark>
            {guideStep.step === 6 && guideStep.screen === 'swap' && <SwapStep6 />}
            <StyledMarkPagination>
              <StyledMarkPaginationButtonGroup>
                {guideStep.step !== 1 && (
                  <StyledMarkPaginationButton onClick={() => handlePrevious(guideStep.step)}>
                    <img style={{ marginRight: '10px' }} src={arrowLeft} alt="arrow" />
                    {t('previous')}
                  </StyledMarkPaginationButton>
                )}
                {guideStep.step !== 7 && (
                  <StyledMarkPaginationButtonRight onClick={() => handleNext(guideStep.step)}>
                    {t('next_step')}
                    <img style={{ marginLeft: '10px' }} src={arrowRight} alt="arrow" />
                  </StyledMarkPaginationButtonRight>
                )}
              </StyledMarkPaginationButtonGroup>
              <StyledMarkPaginationButtonSkip onClick={handleSkip}>
                {t('skip_tutorial')}
                <img style={{ marginLeft: '10px' }} src={arrowSkip} alt="arrow" />
              </StyledMarkPaginationButtonSkip>
            </StyledMarkPagination>
          </StyledMark>
        </StyledMarkWrapper>
      )
      // ))
      }
    </>
  )
}

export default Mark
