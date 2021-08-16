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
        {Number(guideStep.step) === 10 && guideStep.screen === 'stake' && (
          <>
            <Step1Intro>{t('lets_click_connect_wallet_to_connect_and_start')}</Step1Intro>
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
  max-width: 446px;
  top: -190px;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    font-size: 26px;
    top: -90px;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 26px;
    top: -100px;
  `};
`

const StyledHandIcon = styled.div`
  position: absolute;
  top: 80px;
  right: -15px;
  transform: rotate(-29.31deg);

  ${({ theme }) => theme.mediaWidth.upToLarge`
    top: 95px;
    right: 50%;
    transform: unset;
    & > img {
      width: 60px;
    }
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    top: 60px;
    right: 20px;
    transform: rotate(-29.31deg);
    & > img {
      width: 50px;
    }
  `};
`
