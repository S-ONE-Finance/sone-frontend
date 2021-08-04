import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useGuideStepManager } from '../../../../state/user/hooks'
import { handIcon } from './assets'
import { ChildrenProp } from './styled'

const SwapStep3 = ({ children }: ChildrenProp) => {
  const { t } = useTranslation()
  const [guideStep] = useGuideStepManager()

  return (
    <>
      <StyledStep3 className="step-3">
        {children}
        {Number(guideStep.step) === 3 && (
          <StyledStep3Content>
            <StyledHandIconStep3>
              <img src={handIcon} alt="hand" />
            </StyledHandIconStep3>
            <StyledStep3Text>{t('input_numbers_here')}</StyledStep3Text>
          </StyledStep3Content>
        )}
      </StyledStep3>
    </>
  )
}
export default SwapStep3

const StyledStep3 = styled.div`
  position: relative;
`

const StyledStep3Content = styled.div`
  position: absolute;
  position: absolute;
  left: 55px;
  top: 130px;
  display: flex;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    top: 110px;
    left: 0;
  `};
`

const StyledStep3Text = styled.div`
  font-weight: 700;
  font-size: 36px;
  color: #fff;
  margin-left: 10px;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    font-size: 26px;
  `};
`

const StyledHandIconStep3 = styled.div`
  margin-right: 20px;
  & > img {
    transform: rotate(-27.64deg);
  }

  ${({ theme }) => theme.mediaWidth.upToLarge`
    margin-right: 10px;
    & > img {
      width: 60px;
      transform: unset;
    }
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 10px;
    & > img {
      width: 50px;
    }
  `};
`
