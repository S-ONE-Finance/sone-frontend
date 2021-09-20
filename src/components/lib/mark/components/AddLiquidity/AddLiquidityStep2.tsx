import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useGuideStepManager, useAddLiquidityModeManager } from '../../../../../state/user/hooks'
import { AddLiquidityModeEnum } from '../../../../../state/user/actions'
import { handIcon } from '../assets'
import { ChildrenProp } from '../styled'

const AddLiquidityStep2 = ({ children }: ChildrenProp) => {
  const { t } = useTranslation()
  const [addLiquidityMode] = useAddLiquidityModeManager()
  const [guideStep] = useGuideStepManager()

  return (
    <StepWrapper className="step-2">
      {children}
      {Number(guideStep.step) === 2 && guideStep.screen === 'liquidity' && (
        <>
          {addLiquidityMode === AddLiquidityModeEnum.OneToken ? (
            <Step2OneToken>
              <StyledHandIcon>
                <img src={handIcon} alt="hand" />
              </StyledHandIcon>
              <StepIntro>{t('add_one_token_mode_is_recommended')}</StepIntro>
            </Step2OneToken>
          ) : (
            <>
              <Step2TwoToken>
                <StylesHandIconTow>
                  <img src={handIcon} alt="hand" />
                </StylesHandIconTow>
                <StepIntro>{t('when_add_two_tokens_mode_is_on')}</StepIntro>
              </Step2TwoToken>
            </>
          )}
        </>
      )}
    </StepWrapper>
  )
}

export default AddLiquidityStep2

const StepWrapper = styled.div`
  position: relative;
`

const Step2OneToken = styled.div`
position: absolute;
top: 70px;
left: 95px;
width: 460px;
display: flex;
align-items: center;
${({ theme }) => theme.mediaWidth.upToLarge`
  left: 45px;
`};

${({ theme }) => theme.mediaWidth.upToExtraSmall`
  top: 50px;
  left: 25px;
  width: fit-content;
`};

}`

const StepIntro = styled.div`
  font-weight: 700;
  font-size: 36px;
  color: #fff;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    font-size: 26px;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 16px;
  `};
`

const StyledHandIcon = styled.div`
  margin-right: 21px;
  transform: rotate(-29.31deg);

  ${({ theme }) => theme.mediaWidth.upToLarge`
    transform: unset;
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

const StylesHandIconTow = styled(StyledHandIcon)`
  margin-right: 0;
  margin-bottom: 22px;
`

const Step2TwoToken = styled(Step2OneToken)`
  left: 50%;
  flex-direction: column;
`
