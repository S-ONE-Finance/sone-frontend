import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useGuideStepManager } from '../../../../state/user/hooks'
import { handIcon } from './assets'
import { ChildrenProp } from './styled'

const SwapStep4 = ({ children }: ChildrenProp) => {
  const { t } = useTranslation()
  const [guideStep] = useGuideStepManager()

  return (
    <>
      <StyledStep4 className="step-4">
        {children}
        {Number(guideStep.step) === 4 && (
          <StyledStep4Content>
            <StyledStep4HandIcon>
              <img src={handIcon} alt="hand" />
            </StyledStep4HandIcon>
            <StyledStep4Text>{t('choose_the_token_after_conversion')}</StyledStep4Text>
          </StyledStep4Content>
        )}
      </StyledStep4>
    </>
  )
}

export default SwapStep4

const StyledStep4 = styled.div`
  position: relative;
  z-index: 1001;
  width: 100%;
`

const StyledStep4Content = styled.div`
  position: absolute;
  right: -375px;
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    top: 130px;
    left: 25px;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    top: 110px;
    left: 0;
  `};
`

const StyledStep4Text = styled.div`
  font-weight: 700;
  max-width: 300px;
  font-size: 36px;
  color: #fff;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    font-size: 26px;
    max-width: fit-content;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    max-width: 280px;
  `};
`

const StyledStep4HandIcon = styled.div`
  margin-right: 20px;
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
