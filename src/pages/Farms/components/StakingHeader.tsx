import React from 'react'
import styled from 'styled-components'
import { useIsDarkMode } from '../../../state/user/hooks'
import AddLiquidity from '../../../assets/images/add_liquid.svg'
import Stake from '../../../assets/images/stake.svg'
import GetReward from '../../../assets/images/get_reward.svg'
import iconMobile from '../../../assets/images/icon-sone-mobile.svg'
import iconDarkMobile from '../../../assets/images/icon-dark-sone-mobile.svg'

const StakingHeader = () => {
  const headersOptions = [
    {
      image: AddLiquidity,
      numberST: '01',
      contentTitle: 'Add Liquidity',
      contentDescription: `Explain how to add liquidity. <br />
      Explain how to add liquidity.`
    },
    {
      image: Stake,
      numberST: '02',
      contentTitle: 'Stake',
      contentDescription: ` Explain how to stake here. <br />
      Explain how to stake here.`
    },
    {
      image: GetReward,
      numberST: '03',
      contentTitle: 'Get Your Rewards',
      contentDescription: `Get your rewards after the steps. Get your rewards after the steps.`
    }
  ]
  const darkMode = useIsDarkMode()

  return (
    <>
      <StyledHeadingWrapper>
        <StyledHeadingLogo>
          {darkMode ? <img src={iconDarkMobile} alt="" /> : <img src={iconMobile} alt="" />}
        </StyledHeadingLogo>
        <StyledHeadingText>
          ONLY 3 STEPS TO EARN <span>SONE</span>
        </StyledHeadingText>
        <StyledItemsWrapper>
          {headersOptions.map((option, opIndex) => (
            <StyledItem key={opIndex}>
              <StyledItemImage>
                <img src={option.image} alt="" />
              </StyledItemImage>
              <StyledItemBody>
                <StyledItemBodyNumberST>{option.numberST}</StyledItemBodyNumberST>
                <StyledItemBodyContent>
                  <StyledItemBodyContentTitle>{option.contentTitle}</StyledItemBodyContentTitle>
                  <StyledItemBodyContentDescription dangerouslySetInnerHTML={{ __html: option.contentDescription }} />
                </StyledItemBodyContent>
              </StyledItemBody>
            </StyledItem>
          ))}
        </StyledItemsWrapper>
      </StyledHeadingWrapper>
    </>
  )
}

const StyledHeadingWrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.bg7Sone};
  overflow: hidden;
`
const StyledHeadingLogo = styled.div`
  display: flex;
  justify-content: center;
  & > img {
    width: 100%;
    height: 100%;
  }
  @media (min-width: 576px) {
    display: none;
  }
`

const StyledHeadingText = styled.div`
  font-weight: 700;
  font-size: 60px;
  text-align: center;
  margin: 80px 0;
  @media (max-width: 768px) {
    font-size: 20px;
    margin-top: 0;
    margin-bottom: 60px;
  }
  & > span {
    color: #f05359;
  }
`

const StyledItemsWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding: 20px 0;
  box-sizing: content-box;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    width: 0;
    background: transparent;
    display: none;
  }
  @media (min-width: 1024px) {
    box-shadow: none;
    padding: 0;
  }
`

const StyledItem = styled.div`
  padding: 18px 10px;
  margin-left: 20px;
  background: ${({ theme }) => theme.bg8Sone};
  box-shadow: 0px 0px 50px rgba(92, 36, 38, 0.15);
  border-radius: 5px;
  min-width: 270px;
  min-width: 270px;
  flex-grow: 1;
  flex-basis: 0;
  @media (min-width: 1024px) {
    box-shadow: none;
    margin-left: 0;
  }
`

const StyledItemImage = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
  & > img {
    width: 127px;
    height: 127px;
  }

  @media (min-width: 1024px) {
    & > img {
      width: 188px;
      height: 188px;
    }
  }
`
const StyledItemBody = styled.div`
  display: flex;
  align-items: center;
  @media (min-width: 1024px) {
    justify-content: center;
  }
`
const StyledItemBodyNumberST = styled.div`
  font-size: 60px;
  font-weight: 700;
  color: ${({ theme }) => theme.text12Sone};
  @media (min-width: 1200px) {
    font-size: 130px;
  }
`
const StyledItemBodyContent = styled.div`
  margin-left: 10px;
  @media (min-width: 1200px) {
    margin-left: 30px;
  }
`
const StyledItemBodyContentTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.text11Sone};
  @media (min-width: 1200px) {
    font-size: 40px;
  }
`
const StyledItemBodyContentDescription = styled.div`
  font-size: 13px;
  font-weight: 400;
  color: ${({ theme }) => theme.text4Sone};
  @media (min-width: 1200px) {
    font-size: 20px;
  }
`

export default StakingHeader
