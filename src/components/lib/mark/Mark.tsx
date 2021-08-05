/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { StakeMark, SwapMark } from './components'
import { useGuideStepManager } from '../../../state/user/hooks'

const Mark = () => {
  const [guideStep] = useGuideStepManager()

  return (
    <>
      {guideStep.isGuide && (
        <>
          {guideStep.screen === 'swap' && <SwapMark />}
          {guideStep.screen === 'stake' && <StakeMark />}
        </>
      )}
    </>
  )
}

export default Mark
