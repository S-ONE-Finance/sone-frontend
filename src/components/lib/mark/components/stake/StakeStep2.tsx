import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useGuideStepManager } from '../../../../../state/user/hooks'
import { handIcon } from '../assets'
import { ChildrenProp } from '../styled'

const StakeStep2 = ({ children }: ChildrenProp) => {
  const { t } = useTranslation()
  const [guideStep] = useGuideStepManager()

  return (
    <>
      <Step1Wrapper className="step-2">
        {children}
        {Number(guideStep.step) === 2 && guideStep.screen === 'stake' && (
          <>
            <Step1Intro>{t('input_your_lp_token_here_to_stake')}</Step1Intro>
            <StyledHandIcon>
              <img src={handIcon} alt="hand" />
            </StyledHandIcon>
          </>
        )}
      </Step1Wrapper>
    </>
  )
}

export default StakeStep2

const Step1Wrapper = styled.div`
  position: relative;
`

const Step1Intro = styled.div`
  position: absolute;
  color: #fff;
  font-weight: 700;
  font-size: 36px;
  top: -108px;
  width: max-content;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    font-size: 26px;
    top: -60px;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 16px;
    top: -40px;
  `};
`

const StyledHandIcon = styled.div`
  position: absolute;
  top: 130px;
  right: -15px;
  transform: rotate(-29.31deg);

  ${({ theme }) => theme.mediaWidth.upToLarge`
    & > img {
      width: 60px;
    }
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    top: 110px;
    right: 20px;
    transform: rotate(-29.31deg);
    & > img {
      width: 50px;
    }
  `};
`
