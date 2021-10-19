import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useGuideStepManager } from 'state/user/hooks'
import { handIcon } from '../../assets'
import { BackgroundColor, ChildrenProp } from '../../styled'
import useTheme from 'hooks/useTheme'

const OneStep4 = ({ children }: ChildrenProp) => {
  const { t } = useTranslation()
  const [guideStep] = useGuideStepManager()
  const theme = useTheme()

  return (
    <>
      <StyledStep2 className="step-6" backgroundC={Number(guideStep.step) === 6 ? theme.bg2Sone : 'transparent'}>
        {children}
        {Number(guideStep.step) === 6 && guideStep.screen === 'liquidity' && (
          <StyledStep2Content>
            <StyledStep2Icon>
              <img src={handIcon} alt="hand" />
            </StyledStep2Icon>
            <StyledStep2Text>{t('input_numbers_here')}</StyledStep2Text>
          </StyledStep2Content>
        )}
      </StyledStep2>
    </>
  )
}

export default OneStep4

const StyledStep2 = styled.div`
  position: relative;

  & > #add-liquidity-simple-input-tokena {
    background: ${({ backgroundC }: BackgroundColor) => backgroundC};
  }
`

const StyledStep2Content = styled.div`
  position: absolute;
  left: 35px;
  bottom: -115px;
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    left: 0;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    top: 95px;
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
    font-size: 16px;
  `};
`

const StyledStep2Icon = styled.div`
  margin-right: 37px;

  ${({ theme }) => theme.mediaWidth.upToLarge`
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
