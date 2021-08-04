import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useGuideStepManager } from '../../../../state/user/hooks'
import { handIcon } from './assets'
import { ChildrenProp } from './styled'

const SwapStep2 = ({ children }: ChildrenProp) => {
  const { t } = useTranslation()
  const [guideStep] = useGuideStepManager()

  return (
    <>
      <StyledStep2 className="step-2">
        {children}
        {Number(guideStep.step) === 2 && (
          <StyledStep2Content>
            <StyledStep2Icon>
              <img src={handIcon} alt="hand" />
            </StyledStep2Icon>
            <StyledStep2Text>{t('choose_token')}</StyledStep2Text>
          </StyledStep2Content>
        )}
      </StyledStep2>
    </>
  )
}

export default SwapStep2
const StyledStep2 = styled.div`
  position: relative;
  z-index: 1001;
`

const StyledStep2Content = styled.div`
  position: absolute;
  left: 100px;
  top: 60px;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    left: 0;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    left: -60px;
    top: 50px;
  `};
`
const StyledStep2Text = styled.div`
  font-weight: 700;
  font-size: 36px;
  color: #fff;
  margin-top: 20px;
  width: 250px;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    font-size: 26px;
    margin-top: 10px;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    max-width: 130px;
  `};
`

const StyledStep2Icon = styled.div`
  & > img {
    transform: rotate(-29.31deg);
  }

  ${({ theme }) => theme.mediaWidth.upToLarge`
    & > img {
      width: 60px;
      transform: unset;
    }
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 0 80px;
    & > img {
      width: 50px;
    }
  `};
`
