import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useGuideStepManager } from '../../../../../state/user/hooks'
import { handIcon } from '../assets'
import { ChildrenProp } from '../styled'

const AddLiquiditySep2 = ({ children }: ChildrenProp) => {
  const { t } = useTranslation()
  const [guideStep] = useGuideStepManager()

  return (
    <>
      <StepWrapper className="step-2">
        {children}
        {Number(guideStep.step) === 2 && guideStep.screen === 'liquidity' && (
          <Step2>
            <StyledHandIcon>
              <img src={handIcon} alt="hand" />
            </StyledHandIcon>
            <StepIntro>{t('Add One Token mode is recommended')}</StepIntro>
          </Step2>
        )}
      </StepWrapper>
    </>
  )
}

export default AddLiquiditySep2

const StepWrapper = styled.div`
  position: relative;
  // z-index: 1001;
  // pointer-events: none;
`

const Step2 = styled.div`
position: absolute;
top: 70px;
left: 95px;
width: 460px;
display: flex;
align-items: center;

${({ theme }) => theme.mediaWidth.upToExtraSmall`
  top: 50px;
  left: 34px;
  width: 300px;
  `};

}`

const StepIntro = styled.div`
  font-weight: 700;
  font-size: 36px;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    font-size: 26px;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 16px;
  `};
`

const StyledHandIcon = styled.div`
  margin-right: 21px;
  transform: rotate(-29.31deg);

  ${({ theme }) => theme.mediaWidth.upToLarge`
    transform: unset;
    & > img {
      width: 60px;
    }
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    & > img {
      width: 50px;
    }
  `};
`
