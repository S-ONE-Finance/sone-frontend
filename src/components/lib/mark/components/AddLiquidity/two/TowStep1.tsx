import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useAddLiquidityModeManager, useGuideStepManager } from 'state/user/hooks'
import { AddLiquidityModeEnum } from 'state/user/actions'
import { ChildrenProp } from '../../styled'

const TowStep1 = ({ children }: ChildrenProp) => {
  const { t } = useTranslation()
  const [guideStep] = useGuideStepManager()
  const [addLiquidityMode] = useAddLiquidityModeManager()
  const addLiquidityAdvancedWrapper = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (
      addLiquidityAdvancedWrapper.current &&
      guideStep.isGuide &&
      guideStep.screen === 'liquidity' &&
      guideStep.step === 3 &&
      addLiquidityMode === AddLiquidityModeEnum.TwoToken
    ) {
      addLiquidityAdvancedWrapper.current.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' })
    }
  }, [guideStep, addLiquidityMode])

  return (
    <>
      <StepWrapper
        ref={addLiquidityAdvancedWrapper}
        className={addLiquidityMode === AddLiquidityModeEnum.TwoToken ? 'step-3' : ''}
      >
        {children}
        {Number(guideStep.step) === 3 &&
          guideStep.screen === 'liquidity' &&
          addLiquidityMode === AddLiquidityModeEnum.TwoToken && (
            <StyledOneStep1>
              <StepIntro>{t('select_two_tokens_and_input_amount')}</StepIntro>
            </StyledOneStep1>
          )}
      </StepWrapper>
    </>
  )
}

export default TowStep1

const StepWrapper = styled.div`
  position: relative;
  max-width: 602px;
  width: 100%;
`

const StyledOneStep1 = styled.div`
  position: absolute;
  left: 0;
  top: -60px;
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    top: -45px;
    left: 0;
    width: 300px;
  `};
}`

const StepIntro = styled.div`
  font-weight: 700;
  font-size: 36px;
  color: #fff;
  width: max-content;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    font-size: 26px;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 16px;
  `};
`
