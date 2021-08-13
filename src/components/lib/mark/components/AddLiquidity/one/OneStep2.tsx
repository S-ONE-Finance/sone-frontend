import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useGuideStepManager } from '../../../../../../state/user/hooks'
import { handIcon } from '../../assets'
import ModalSearchPair from './ModalSearchPair'
import { useGetPairFromSubgraphAndParse } from '../../../../../../subgraph'

const OneStep2 = () => {
  const { t } = useTranslation()
  const [guideStep] = useGuideStepManager()
  const [isLoading, allPairs] = useGetPairFromSubgraphAndParse()

  return (
    <>
      <StepWrapper>
        <TextWrapper>
          <ModalSearchPair
            isOpen={true}
            onDismiss={() => false}
            onPairSelect={() => false}
            selectedPair={null}
            isLoading={isLoading}
            allPairs={allPairs}
          />
          {Number(guideStep.step) === 4 && guideStep.screen === 'liquidity' && (
            <StyledOneStep2>
              <StyledHandIcon>
                <img src={handIcon} alt="hand" />
              </StyledHandIcon>
              <StepIntro>{t('Select a pair you want')}</StepIntro>
            </StyledOneStep2>
          )}
        </TextWrapper>
      </StepWrapper>
    </>
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

${({ theme }) => theme.mediaWidth.upToExtraSmall`
  top: 60%;
  left: 15%;
  width: 300px;
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
  margin-right: 31px;
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
