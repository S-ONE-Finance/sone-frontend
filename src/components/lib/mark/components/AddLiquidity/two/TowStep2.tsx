import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useGuideStepManager } from '../../../../../../state/user/hooks'
import { handIcon } from '../../assets'
import { ChildrenProp } from '../../styled'

const TowStep1 = ({ children }: ChildrenProp) => {
  const { t } = useTranslation()
  const [guideStep] = useGuideStepManager()

  return (
    <>
      <StepWrapper className="step-4">
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
    </>
  )
}

export default TowStep1

const StepWrapper = styled.div`
  position: relative;
`

const StyledOneStep1 = styled.div`
position: absolute;
top: 130%;
left: 100%;
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
    & > img {
      width: 50px;
    }
  `};
`
