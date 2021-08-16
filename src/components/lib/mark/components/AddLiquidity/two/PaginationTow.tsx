import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { useGuideStepManager } from '../../../../../../state/user/hooks'

import { TowStep3 } from '../../index'
import { arrowLeft, arrowRight, arrowSkip } from '../../assets'
import { PaginationProps } from '../../styled'

const PaginationOne = ({ handlePrevious, handleNext, handleSkip }: PaginationProps) => {
  const { t } = useTranslation()
  const [guideStep] = useGuideStepManager()

  return (
    <>
      <StyledMark>
        {guideStep.step === 5 && guideStep.screen === 'liquidity' && <TowStep3 />}
        <StyledMarkPagination>
          <StyledMarkPaginationButtonGroup>
            {guideStep.step !== 1 && (
              <StyledMarkPaginationButton onClick={() => handlePrevious(guideStep.step)}>
                <img style={{ marginRight: '10px' }} src={arrowLeft} alt="arrow" />
                {t('previous')}
              </StyledMarkPaginationButton>
            )}
            {guideStep.step !== 5 && (
              <StyledMarkPaginationButtonRight onClick={() => handleNext(guideStep.step)}>
                {t('next_step')}
                <img style={{ marginLeft: '10px' }} src={arrowRight} alt="arrow" />
              </StyledMarkPaginationButtonRight>
            )}
          </StyledMarkPaginationButtonGroup>
          <StyledMarkPaginationButtonSkip onClick={handleSkip}>
            {t('skip_tutorial')}
            <img style={{ marginLeft: '10px' }} src={arrowSkip} alt="arrow" />
          </StyledMarkPaginationButtonSkip>
        </StyledMarkPagination>
      </StyledMark>
    </>
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
  ${({ theme }) => theme.mediaWidth.upToLarge`
     font-size: 26px;
  `};
`
