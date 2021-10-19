import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useAddLiquidityModeManager, useGuideStepManager } from 'state/user/hooks'
import { handIcon } from '../../assets'
import { ChildrenProp } from '../../styled'
import { AddLiquidityModeEnum } from 'state/user/actions'

const TowStep2 = ({ children }: ChildrenProp) => {
  const { t } = useTranslation()
  const [guideStep] = useGuideStepManager()
  const [addLiquidityMode] = useAddLiquidityModeManager()
  const addLiquidityAdvancedStep4Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (
      addLiquidityAdvancedStep4Ref.current &&
      guideStep.isGuide &&
      guideStep.screen === 'liquidity' &&
      guideStep.step === 4 &&
      addLiquidityMode === AddLiquidityModeEnum.TwoToken
    ) {
      addLiquidityAdvancedStep4Ref.current.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' })
    }
  }, [guideStep, addLiquidityMode])

  return (
    <StepWrapper ref={addLiquidityAdvancedStep4Ref} className="step-4">
      {children}
      {Number(guideStep.step) === 4 && guideStep.screen === 'liquidity' && (
        <StyledOneStep1>
          <StyledHandIcon>
            <img src={handIcon} alt="hand" />
          </StyledHandIcon>
          <StepIntro>{t('click_here')}</StepIntro>
        </StyledOneStep1>
      )}
    </StepWrapper>
  )
}

export default TowStep2

const StepWrapper = styled.div`
  position: relative;
`

const StyledOneStep1 = styled.div`
  position: absolute;
  top: 130%;
  left: 30%;
  display: flex;
  align-items: center;
  width: 100%;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    left: 50%;
    width: 250px;
  `};
}`

const StepIntro = styled.div`
  font-weight: 700;
  font-size: 36px;
  color: #fff;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    font-size: 26px;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 16px;
  `};
`

const StyledHandIcon = styled.div`
  margin-right: 31px;
  transform: rotate(-29.31deg);

  ${({ theme }) => theme.mediaWidth.upToLarge`
    transform: unset;
    & > img {
      width: 60px;
    }
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 4px;
    & > img {
      width: 50px;
    }
  `};
`
