import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useGuideStepManager } from '../../../../../state/user/hooks'
import { handIcon } from '../assets'
import { ChildrenProp } from '../styled'

const SwapStep1 = ({ children }: ChildrenProp) => {
  const { t } = useTranslation()
  const [guideStep] = useGuideStepManager()

  return (
    <>
      <Step1Wrapper className="step-1">
        {children}
        {Number(guideStep.step) === 1 && guideStep.screen === 'swap' && (
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

export default SwapStep1

const Step1Wrapper = styled.div`
  position: relative;
  z-index: 1001;
  pointer-events: none;
`

const Step1Intro = styled.div`
  position: absolute;
  color: #fff;
  font-weight: 700;
  font-size: 36px;
  top: -100px;
  left: -50%;
  transform: translateX(25%);
  width: max-content;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    font-size: 26px;
    top: -90px;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 16px;
    top: -50px;
    left: 0;
    transform: unset;
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
