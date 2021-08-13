/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import styled from 'styled-components'

import { useGuideStepManager, useAddLiquidityModeManager } from '../../../../state/user/hooks'
import { AddLiquidityModeEnum } from '../../../../state/user/actions'
import { PaginationTow, PaginationOne } from './index'

const StyledMarkWrapper = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
`

const Mark = () => {
  const [guideStep, updateStepGuide] = useGuideStepManager()
  const [addLiquidityMode] = useAddLiquidityModeManager()

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
    const max = addLiquidityMode === AddLiquidityModeEnum.OneToken ? 8 : 5
    handleSkip()
    for (let i = 1; i < max; i++) {
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
      if (guideStep.oldStep) handleCheckStep(`step-${guideStep.oldStep}`, 'old')
      handleCheckStep(`step-${guideStep.step}`, 'new')
    }
  }, [guideStep])

  return (
    <>
      {guideStep.isGuide && (
        <StyledMarkWrapper id="swap-mark">
          {addLiquidityMode === AddLiquidityModeEnum.OneToken ? (
            <PaginationOne handleNext={handleNext} handlePrevious={handlePrevious} handleSkip={handleSkip} />
          ) : (
            <PaginationTow handleNext={handleNext} handlePrevious={handlePrevious} handleSkip={handleSkip} />
          )}
        </StyledMarkWrapper>
      )}
    </>
  )
}

export default Mark
