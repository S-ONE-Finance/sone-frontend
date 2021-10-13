import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { useGuideStepManager } from 'state/user/hooks'

import { OneStep6, OneStep2 } from '../../index'
import { arrowLeft, arrowRight, arrowSkip } from '../../assets'
import { PaginationProps } from '../../styled'
import { useIsUpToMedium } from 'hooks/useWindowSize'

const PaginationOne = ({ handlePrevious, handleNext, handleSkip }: PaginationProps) => {
  const { t } = useTranslation()
  const [guideStep] = useGuideStepManager()
  const isUpToMedium = useIsUpToMedium()
  const backgroundEnable = isUpToMedium && guideStep.step === 4 ? 1 : 0

  return (
    <StyledMark>
      {guideStep.step === 8 && guideStep.screen === 'liquidity' && <OneStep6 />}
      <OneStep2 />
      <StyledMarkPagination>
        <StyledMarkPaginationButtonGroup>
          {guideStep.step !== 1 && (
            <StyledMarkPaginationButton
              onClick={() => handlePrevious(guideStep.step)}
              backgroundEnable={backgroundEnable}
            >
              <img style={{ marginRight: '10px' }} src={arrowLeft} alt="arrow" />
              {t('previous')}
            </StyledMarkPaginationButton>
          )}
          {guideStep.step !== 8 && (
            <StyledMarkPaginationButtonRight
              onClick={() => handleNext(guideStep.step)}
              backgroundEnable={backgroundEnable}
            >
              {t('next_step')}
              <img style={{ marginLeft: '10px' }} src={arrowRight} alt="arrow" />
            </StyledMarkPaginationButtonRight>
          )}
        </StyledMarkPaginationButtonGroup>
        <StyledMarkPaginationButtonSkip onClick={handleSkip} backgroundEnable={backgroundEnable}>
          {t('skip_tutorial')}
          <img style={{ marginLeft: '10px' }} src={arrowSkip} alt="arrow" />
        </StyledMarkPaginationButtonSkip>
      </StyledMarkPagination>
    </StyledMark>
  )
}

export default PaginationOne

const StyledMark = styled.div``

const StyledMarkPagination = styled.div`
  width: 100%;
  position: absolute;
  bottom: 124px;
  padding: 0 61px 0 88px;
  z-index: 1001;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    padding: 0 41px 0 68px;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 0 1rem;
  `};
`

const StyledMarkPaginationButtonGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 50px;
`

const StyledMarkPaginationButton = styled.div<{ backgroundEnable: 0 | 1 }>`
  font-weight: 500;
  font-size: 36px;
  color: #fff;
  cursor: pointer;
  background: ${({ theme, backgroundEnable }) => (backgroundEnable ? theme.modalBG : '')};

  ${({ theme }) => theme.mediaWidth.upToLarge`
    font-size: 26px;
  `};
`

const StyledMarkPaginationButtonRight = styled(StyledMarkPaginationButton)`
  margin-left: auto;
  margin-right: 0;
`

const StyledMarkPaginationButtonSkip = styled.div<{ backgroundEnable: 0 | 1 }>`
  font-weight: 500;
  font-size: 36px;
  color: #fff;
  text-align: right;
  cursor: pointer;
  width: fit-content;
  float: right;
  background: ${({ theme, backgroundEnable }) => (backgroundEnable ? theme.modalBG : '')};

  ${({ theme }) => theme.mediaWidth.upToLarge`
    font-size: 26px;
  `};
`
