import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import {
  handIcon,
  summaryAddLiquiditySimpleEN,
  summaryAddLiquiditySimpleJP,
  summaryAddLiquiditySimpleZH
} from '../../assets'

import useLanguage from 'hooks/useLanguage'

const SwapStep6 = () => {
  const { t } = useTranslation()
  const [language] = useLanguage()

  return (
    <>
      <Step6Wrapper>
        <Step6Box>
          <img
            src={
              language?.startsWith('en')
                ? summaryAddLiquiditySimpleEN
                : language?.startsWith('jp')
                ? summaryAddLiquiditySimpleJP
                : language?.startsWith('zh')
                ? summaryAddLiquiditySimpleZH
                : summaryAddLiquiditySimpleEN
            }
            alt="message"
          />
        </Step6Box>
        <Step6Instruction>
          <Step6InstructionText>{t('lets_stake_lp_tokens_to_get_rewards')}</Step6InstructionText>
          <img src={handIcon} alt="hand" />
        </Step6Instruction>
      </Step6Wrapper>
    </>
  )
}

export default SwapStep6

const Step6Wrapper = styled.div`
  z-index: 1000;
  position: absolute;
  top: 103px;
  right: 72px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    margin: 0 1rem;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    left:0;
    right: unset;
  `};
`

const Step6Box = styled.div`
  & > img {
    border-radius: 8px;
    width: 400px;
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
    flex-direction: column;
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
  width: max-content;
  margin-right: 34px;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    font-size: 26px;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 16px;
    order: 1;
  `};
`
