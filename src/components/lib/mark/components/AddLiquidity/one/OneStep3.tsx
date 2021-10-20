import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useAddLiquidityModeManager, useGuideStepManager } from '../../../../../../state/user/hooks'
import { handIcon } from '../../assets'
import { ChildrenProp } from '../../styled'
import { AddLiquidityModeEnum } from 'state/user/actions'

const OneStep3 = ({ children }: ChildrenProp) => {
  const { t } = useTranslation()
  const [guideStep] = useGuideStepManager()

  const [addLiquidityMode] = useAddLiquidityModeManager()
  const addLiquiditySimpleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (
      addLiquiditySimpleRef.current &&
      guideStep.isGuide &&
      guideStep.screen === 'liquidity' &&
      guideStep.step === 5 &&
      addLiquidityMode === AddLiquidityModeEnum.OneToken
    ) {
      addLiquiditySimpleRef.current.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' })
    }
  }, [guideStep, addLiquidityMode])

  return (
    <>
      <StyledStep2 ref={addLiquiditySimpleRef} className="step-5">
        {children}
        {Number(guideStep.step) === 5 && guideStep.screen === 'liquidity' && (
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

export default OneStep3
const StyledStep2 = styled.div`
  position: relative;
  // z-index: 1001;
`

const StyledStep2Content = styled.div`
  position: absolute;
  top: 60px;
  display: flex;
  align-items: center;
}

  ${({ theme }) => theme.mediaWidth.upToLarge`
    left: 0;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    flex-direction: column;
    left: -60px;
    top: 50px;
  `};
`
const StyledStep2Text = styled.div`
  font-weight: 700;
  font-size: 36px;
  color: #fff;
  margin-top: 20px;
  width: max-content;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    font-size: 26px;
    margin-top: 10px;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 16px;
    margin-left: -30px;
  `};
`

const StyledStep2Icon = styled.div`
  margin-right: 37px;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    margin-right: 10px;
    & > img {
      width: 60px;
    }
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 10px;
    transform: rotate(48deg);
    & > img {
      width: 50px;
    }
  `};
`
