import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { handIcon, iconCheck, swapCloseIcon } from '../assets'

const SwapStep6 = () => {
  const { t } = useTranslation()
  return (
    <>
      <Step6Wrapper>
        <Step6Box>
          <Step6BoxHeader>
            <Step6BoxHeaderIconSuccess>
              <img src={iconCheck} alt="check" />
            </Step6BoxHeaderIconSuccess>
            {t('Add 3.14159 ETH and 81.5472 DAI')}
            <Step6BoxHeaderIconClose>
              <img src={swapCloseIcon} alt="close" />
            </Step6BoxHeaderIconClose>
          </Step6BoxHeader>
          <Step6BoxContent>{t('view_on_etherscan')}</Step6BoxContent>
          <Step6BoxButtonWrapper>
            <Step6BoxButton>{t('stake_now')}</Step6BoxButton>
          </Step6BoxButtonWrapper>
        </Step6Box>
        <Step6Instruction>
          <Step6InstructionText>{t('let’s_stake_lp_tokens_to_get_rewards')}</Step6InstructionText>
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
    right: 0;
  `};
`

const Step6Box = styled.div`
  padding: 20px 26px 22px 20px;
  background: #ffffff;
  box-shadow: 0px 4px 39px rgba(0, 0, 0, 0.15);
  border-radius: 15px;
  min-width: 500px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    min-width: unset;
  `};
`

const Step6BoxHeader = styled.div`
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 20px;
  color: #000;
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 16px;
  `};
`
const Step6BoxHeaderIconSuccess = styled.div`
  margin-right: 20px;
  display: flex;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 10px;
    & > img {
      width: 15px;
    }
  `};
`

const Step6BoxHeaderIconClose = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    top: 15px;
    right: 25px
    & > img {
      width: 10px;
    }
  `};
`

const Step6BoxContent = styled.div`
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 20px;
  color: #3faab0;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 16px;
  `};
`

const Step6BoxButtonWrapper = styled.div`
  text-align: right;
`

const Step6BoxButton = styled.div`
  display: inline-block;
  padding: 10px 25px 16px;
  background: #f05359;
  border-radius: 26px;
  color: #fff;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 10px 20px 13px;
  `};
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
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    max-width: 100%;
  `};
`
