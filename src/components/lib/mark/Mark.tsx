import React from 'react'
import { StakeMark, SwapMark, AddLiquidityMark } from './components'
import { useGuideStepManager } from '../../../state/user/hooks'

const Mark = () => {
  const [guideStep] = useGuideStepManager()

  return (
    <>
      {guideStep.isGuide && (
        <>
          {guideStep.screen === 'swap' && <SwapMark />}
          {guideStep.screen === 'stake' && <StakeMark />}
          {guideStep.screen === 'liquidity' && <AddLiquidityMark />}
        </>
      )}
    </>
  )
}

export default Mark
