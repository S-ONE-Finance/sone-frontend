import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useGuideStepManager } from 'state/user/hooks'
import { ReactComponent as HandIcon } from 'assets/images/hand-guide.svg'
import ModalSearchPair from './ModalSearchPair'

const OneStep2 = () => {
  const { t } = useTranslation()
  const [guideStep] = useGuideStepManager()

  return (
    <StepWrapper
      style={{ display: Number(guideStep.step) === 4 && guideStep.screen === 'liquidity' ? 'flex' : 'none' }}
    >
      <TextWrapper>
        <ModalSearchPair isOpen={true} onDismiss={() => false} onPairSelect={() => false} selectedPair={null} />
        <StyledOneStep2>
          <StyledHandIcon>
            <HandIcon />
          </StyledHandIcon>
          <StepIntro>{t('select_a_pair_you_want')}</StepIntro>
        </StyledOneStep2>
      </TextWrapper>
    </StepWrapper>
  )
}

export default OneStep2

const StepWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  pointer-events: none;
`

const TextWrapper = styled.div`
  position: relative;
`

const StyledOneStep2 = styled.div`
  position: absolute;
  top: 50%;
  left: 55%;
  width: max-content;
  display: flex;
  align-items: center;
  z-index: 1;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    left: 35%;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    top: 45%;
    left: 38%;
  `};
}`

const StepIntro = styled.div`
  font-weight: 700;
  font-size: 36px;
  color: ${({ theme }) => theme.text1Sone};

  ${({ theme }) => theme.mediaWidth.upToLarge`
    font-size: 26px;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 16px;
  `};
`

const StyledHandIcon = styled.div`
  margin-right: 31px;
  transform: rotate(-29.31deg);

  path {
    fill: ${({ theme }) => theme.text1Sone};
  }

  ${({ theme }) => theme.mediaWidth.upToLarge`
    transform: unset;
    
    & > * {
      width: 60px;
    }
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 6px;
    & > * {
      width: 35px;
    }
  `};
`
