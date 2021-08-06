import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { closeIcon, stakeTickIcon } from '../assets'

const StakeStep2 = () => {
  const { t } = useTranslation()
  return (
    <>
      <StyledStep7Wrapper>
        <StyledStep7>
          <StyledStep2Right>
            <StyledStep2RightContent>
              <StyledStep7ButtonClose>
                <img src={closeIcon} alt="close" />
              </StyledStep7ButtonClose>
              <StyledStep2ContentText>
                <TickIcon>
                  <img src={stakeTickIcon} alt="close" />
                </TickIcon>
                <div>
                  During the first 8 weeks since launch <br /> <span>25% of your earned SONE</span> is available to
                  unlock.
                </div>
              </StyledStep2ContentText>
              <StyledStep2ContentText>
                <TickIcon>
                  <img src={stakeTickIcon} alt="close" />
                </TickIcon>
                <div>
                  Beginning January 18, 2021, the remaining 75% <br /> will be unlocked linearly every block over 1
                  year.
                </div>
              </StyledStep2ContentText>
              <DontShowAgain>{t('dont_show_again')}</DontShowAgain>
            </StyledStep2RightContent>
          </StyledStep2Right>
        </StyledStep7>
      </StyledStep7Wrapper>
    </>
  )
}

export default StakeStep2

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
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  padding: 0 54px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: column;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    left: 0;
    padding: 0 1rem;
    bottom: 140px;
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
const StyledStep2Right = styled.div``

const StyledStep2RightContent = styled.div`
  max-width: 402px;
  padding: 41px 17px 26px 19px;
  background: #ffffff;
  box-shadow: 0px 5px 25px rgba(0, 0, 0, 0.16);
  border-radius: 17px;
  position: relative;
`
const StyledStep2ContentText = styled.div`
  color: #767676;
  font-size: 16px;
  margin-bottom: 18px;
  display: flex;
  & > span {
    color: #3faab0;
  }
`
const TickIcon = styled.div`
  margin-right: 6px;
`
const DontShowAgain = styled(StyledStep7Text)`
  text-align: left;
`
