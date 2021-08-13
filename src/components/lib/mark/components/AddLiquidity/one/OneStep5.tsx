import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useGuideStepManager } from '../../../../../../state/user/hooks'
import { handIcon } from '../../assets'
import { ChildrenProp } from '../../styled'

const OneStep5 = ({ children }: ChildrenProp) => {
  const { t } = useTranslation()
  const [guideStep] = useGuideStepManager()

  return (
    <>
      <StyledStep2 className="step-7">
        {children}
        {Number(guideStep.step) === 7 && guideStep.screen === 'liquidity' && (
          <StyledStep2Content>
            <StyledStep2Icon>
              <img src={handIcon} alt="hand" />
            </StyledStep2Icon>
            <StyledStep2Text>{t('click_here')}</StyledStep2Text>
          </StyledStep2Content>
        )}
      </StyledStep2>
    </>
  )
}

export default OneStep5
const StyledStep2 = styled.div`
  position: relative;
`

const StyledStep2Content = styled.div`
  position: absolute;
  left: 65%;
  display: flex;
  align-items: center;
}

  ${({ theme }) => theme.mediaWidth.upToLarge`
    left: 0;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    left: 40%;
    top: 70px;
  `};
`
const StyledStep2Text = styled.div`
  font-weight: 700;
  font-size: 36px;
  color: #fff;
  margin-top: 20px;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    font-size: 26px;
    margin-top: 10px;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    max-width: 130px;
    font-size: 16px;
  `};
`

const StyledStep2Icon = styled.div`
  margin-right: 37px;
  transform: rotate(-37.55deg);
  ${({ theme }) => theme.mediaWidth.upToLarge`
    transform: unset;
    margin-right: 20px;
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
