import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { girlIcon, closeIcon } from '../assets'

type Step7Props = {
  handleClose: () => void
  handleRestartGuide: () => void
}

const SwapStep7 = ({ handleClose, handleRestartGuide }: Step7Props) => {
  const { t } = useTranslation()
  return (
    <>
      <StyledStep7Wrapper>
        <StyledStep7>
          <StyledGirlIcon>
            <img src={girlIcon} alt="hand" />
          </StyledGirlIcon>
          <StyledStep7Content>
            <StyledStep7ButtonClose onClick={handleClose}>
              <img src={closeIcon} alt="close" />
            </StyledStep7ButtonClose>
            <StyledStep7Button onClick={handleRestartGuide}>{t('see_tutorial_now')}</StyledStep7Button>
            <StyledStep7Text onClick={handleClose}>{t('dont_show_again')}</StyledStep7Text>
          </StyledStep7Content>
        </StyledStep7>
      </StyledStep7Wrapper>
    </>
  )
}

export default SwapStep7

const StyledStep7Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  z-index: 1000;
`
const StyledStep7 = styled.div`
  position: absolute;
  bottom: 161px;
  left: 54px;
  display: flex;
  align-items: flex-end;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    left: 0;
    padding: 0 1rem;
    bottom: 140px;
  `};
`

const StyledGirlIcon = styled.div`
  ${({ theme }) => theme.mediaWidth.upToMedium`
    & > img {
      width: 150px;
    }
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    & > img {
      width: 120px;
    }
  `};
`

const StyledStep7Content = styled.div`
  background: #fef8f8;
  box-shadow: 0px 8px 17px rgb(0 0 0 / 18%);
  border-radius: 25px;
  padding: 32px 54px 15px;
  position: relative;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 22px 34px 15px;
  `};
`

const StyledStep7Button = styled.div`
  padding: 18px 30px;
  font-size: 22px;
  color: #fff;
  font-weight: 700;
  background: #f05359;
  border-radius: 30px;
  cursor: pointer;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 8px 16px;
    font-size: 16px;
  `};
`

const StyledStep7ButtonClose = styled.div`
  position: absolute;
  right: 20px;
  top: 16px;
  cursor: pointer;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    right: 12px;
  `};
`

const StyledStep7Text = styled.div`
  font-size: 16px;
  color: #c9c9c9;
  margin-top: 18px;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin-top: 15px;
    font-size: 13px;
  `};
`
