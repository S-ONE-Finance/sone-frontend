import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useGuideStepManager } from 'state/user/hooks'
import { handIcon } from '../../assets'
import { ChildrenProp } from '../../styled'

const OneStep1 = ({ children }: ChildrenProp) => {
  const { t } = useTranslation()
  const [guideStep] = useGuideStepManager()

  return (
    <>
      <StepWrapper className="step-3">
        {children}
        {Number(guideStep.step) === 3 && guideStep.screen === 'liquidity' && (
          <StyledOneStep1>
            <StyledHandIcon>
              <img src={handIcon} alt="hand" />
            </StyledHandIcon>
            <StepIntro>{t('select_a_pair_here')}</StepIntro>
          </StyledOneStep1>
        )}
      </StepWrapper>
    </>
  )
}

export default OneStep1

const StepWrapper = styled.div`
  position: relative;
`

const StyledOneStep1 = styled.div`
  position: absolute;
  top: 70px;
  left: 85px;
  width: max-content;
  display: flex;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
    flex-direction: column;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    top: 50px;
    left: -70px;
    width: 300px;
  `};

}`

const StyledHandIcon = styled.div`
  margin-right: 31px;
  width: fit-content;
  transform: rotate(-29.31deg);

  ${({ theme }) => theme.mediaWidth.upToLarge`
    transform: unset;
    & > img {
      width: 60px;
    }
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  transform: rotate(48deg);
    & > img {
      width: 50px;
    }
  `};
`

const StepIntro = styled.div`
  font-weight: 700;
  font-size: 36px;
  color: #fff;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    font-size: 26px;
    margin-left: -200px;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 16px;
    margin-left: unset;
  `};
`
