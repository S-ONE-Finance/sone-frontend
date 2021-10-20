import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { useGuideStepManager } from 'state/user/hooks'

import { OneStep6, OneStep2 } from '../../index'
import { arrowLeft, arrowRight, arrowSkip } from '../../assets'
import { PaginationProps } from '../../styled'

const PaginationOne = ({ handlePrevious, handleNext, handleSkip }: PaginationProps) => {
  const { t } = useTranslation()
  const [guideStep] = useGuideStepManager()

  return (
    <>
      <StyledMark />
      {guideStep.step === 8 && guideStep.screen === 'liquidity' && <OneStep6 />}
      <OneStep2 />
      <StyledMarkPagination>
        <StyledMarkPaginationButtonGroup>
          {guideStep.step !== 1 && (
            <StyledMarkPaginationButton onClick={() => handlePrevious(guideStep.step)}>
              <img style={{ marginRight: '10px' }} src={arrowLeft} alt="arrow" />
              {t('previous')}
            </StyledMarkPaginationButton>
          )}
          {guideStep.step !== 8 && (
            <StyledMarkPaginationButtonRight onClick={() => handleNext(guideStep.step)}>
              {t('next_step')}
              <img style={{ marginLeft: '10px' }} src={arrowRight} alt="arrow" />
            </StyledMarkPaginationButtonRight>
          )}
        </StyledMarkPaginationButtonGroup>
        <StyledMarkPaginationButtonSkip onClick={handleSkip}>
          {guideStep.step === 8 ? t('finish_tutorial') : t('skip_tutorial')}
          <img style={{ marginLeft: '10px' }} src={arrowSkip} alt="arrow" />
        </StyledMarkPaginationButtonSkip>
      </StyledMarkPagination>
    </>
  )
}

export default PaginationOne

const StyledMark = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
`

const StyledMarkPagination = styled.div`
  z-index: 1002;
  bottom: 100px;
  width: 100%;
  position: fixed;
  padding: 0 61px 0 88px;

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

const StyledMarkPaginationButton = styled.div`
  font-weight: 500;
  font-size: 36px;
  color: #fff;
  cursor: pointer;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    font-size: 26px;
  `};
`

const StyledMarkPaginationButtonRight = styled(StyledMarkPaginationButton)`
  margin-left: auto;
  margin-right: 0;
`

const StyledMarkPaginationButtonSkip = styled.div`
  font-weight: 500;
  font-size: 36px;
  color: #fff;
  text-align: right;
  cursor: pointer;
  width: fit-content;
  float: right;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    font-size: 26px;
  `};
`
