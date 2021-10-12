import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { handIcon, summarySwapEN } from '../assets'

const StakeStep4 = () => {
  const { t } = useTranslation()

  return (
    <>
      <Step6Wrapper>
        <Step6Box>
          <img src={summarySwapEN} alt="message" />
        </Step6Box>
        <Step6Instruction>
          <Step6InstructionText>{t('lets_stake_lp_tokens_to_get_rewards')}</Step6InstructionText>
          <img src={handIcon} alt="hand" />
        </Step6Instruction>
      </Step6Wrapper>
    </>
  )
}

export default StakeStep4

const Step6Wrapper = styled.div`
  position: absolute;
  top: 103px;
  right: 72px;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    margin: 0 1rem;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    right: 0;
  `};
`

const Step6Box = styled.div`
  & > img {
    border-radius: 8px;
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
