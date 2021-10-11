import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { handIcon, swapSummaryLight } from '../assets'

const SwapStep6 = () => {
  const { t } = useTranslation()

  return (
    <>
      <Step6Wrapper>
        <Step6Box>
          <img src={swapSummaryLight} alt="message" />
        </Step6Box>
        <Step6Instruction>
          <Step6InstructionText>{t('swap_successfully')}</Step6InstructionText>
          <img src={handIcon} alt="hand" />
        </Step6Instruction>
      </Step6Wrapper>
    </>
  )
}

export default SwapStep6

const Step6Wrapper = styled.div`
  position: absolute;
  top: 103px;
  right: 72px;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    margin: 0 1rem;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    left: 0;
    right: 0;
    margin: 0 1rem;
  `};
`

const Step6Box = styled.div`
  box-shadow: 0px 4px 39px rgba(0, 0, 0, 0.15);

  & > img {
    border-radius: 8px;
    max-width: calc(100vw - 32px);
  }
`

const Step6Instruction = styled.div`
  display: flex;
  align-items: center;
  margin-top: 24px;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    & > img {
      width: 60px;
    }
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  justify-content: center;
    & > img {
      width: 50px;
    }
  `};
`

const Step6InstructionText = styled.div`
  font-weight: bold;
  font-size: 36px;
  text-align: right;
  color: #ffffff;
  max-width: 360px;
  margin-right: 34px;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    font-size: 26px;
    max-width: 300px;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    max-width: 100%;
    font-size: 16px;
  `};
`
