import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useGuideStepManager } from '../../../../../state/user/hooks'
import { handIcon } from '../assets'
import { ChildrenProp } from '../styled'

const SwapStep5 = ({ children }: ChildrenProp) => {
  const { t } = useTranslation()
  const [guideStep] = useGuideStepManager()
  return (
    <>
      <StyledStep5 className="step-5">
        {children}
        {Number(guideStep.step) === 5 && guideStep.screen === 'swap' && (
          <StyledStep5Content>
            <StyledHandIconStep5>
              <img src={handIcon} alt="hand" />
              <StyledStep5Text>{t('click_swap')}</StyledStep5Text>
            </StyledHandIconStep5>
          </StyledStep5Content>
        )}
      </StyledStep5>
    </>
  )
}

export default SwapStep5

const StyledStep5 = styled.div`
  position: relative;
`

const StyledStep5Content = styled.div`
  position: absolute;
  right: -220px;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    right: 100px;
    top: 85px;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    right: 5px;
    top: 60px;
  `};
`

const StyledStep5Text = styled.div`
  margin-left: 20px;
  font-weight: 700;
  max-width: 300px;
  font-size: 36px;
  color: #fff;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    font-size: 26px;
  `};
`

const StyledHandIconStep5 = styled.div`
  display: flex;
  align-items: center;

  & > img {
    transform: rotate(-27.64deg);
  }

  ${({ theme }) => theme.mediaWidth.upToLarge`
    & > img {
      width: 60px;
      transform: unset;
    }
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    & > img {
      width: 50px;
    }
  `};
`
