import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useIsDarkMode } from '../../../state/user/hooks'
import AddLiquidity from '../../../assets/images/add_liquid.svg'
import Stake from '../../../assets/images/stake.svg'
import GetReward from '../../../assets/images/get_reward.svg'
import iconMobile from '../../../assets/images/icon-sone-mobile.svg'
import iconDarkMobile from '../../../assets/images/icon-dark-sone-mobile.svg'

const StakingHeader = () => {
  const { t } = useTranslation()
  const headersOptions = [
    {
      image: AddLiquidity,
      numberST: '01',
      contentTitle: t('liquidity'),
      contentDescription: t('add_liquidity_and_get_lp_token')
    },
    {
      image: Stake,
      numberST: '02',
      contentTitle: t('stake'),
      contentDescription: t('stake_lp_token')
    },
    {
      image: GetReward,
      numberST: '03',
      contentTitle: t('get_your_rewards'),
      contentDescription: t('get_sone_on_my_account')
    }
  ]

  const darkMode = useIsDarkMode()

  return (
    <>
      <StyledHeadingWrapper>
        <StyledHeadingLogo>
          {darkMode ? <img src={iconDarkMobile} alt="" /> : <img src={iconMobile} alt="" />}
        </StyledHeadingLogo>
        <StyledHeadingText
          dangerouslySetInnerHTML={{ __html: t('only_3_steps_to_earn_sone', { sone: '<span>SONE</span>' }) }}
        />
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
  @media (min-width: 500px) {
    display: none;
  }
`

const StyledHeadingText = styled.div`
  font-weight: 700;
  font-size: 60px;
  text-align: center;
  margin: 80px 0;
  ${({ theme }) => theme.mediaWidth.upToLarge`
  font-size: 40px;
  margin: 60px 0;
  `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
  font-size: 20px;
  margin: 60px 0;
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-top: 0;
    margin-bottom: 60px;
  `}
  & > span {
    color: #f05359;
  }
`

const StyledItemsWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding: 10px 0 36px 0;
  background: ${({ theme }) => theme.bg8Sone};
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
  @media (min-width: 1200px) {
    padding: 0 124px;
  }
`

const StyledItem = styled.div`
  padding: 18px 12px 32px 8px;
  margin-left: 20px;
  background: ${({ theme }) => theme.bg8Sone};
  box-shadow: 0 0 50px rgba(92, 36, 38, 0.15);
  border-radius: 5px;
  min-width: 270px;
  flex-grow: 1;
  flex-basis: 0;
  @media (min-width: 1024px) {
    box-shadow: none;
    margin-left: 0;
  }
  @media (min-width: 1200px) {
    padding: 16px 0 129px 0;
  }
`

const StyledItemImage = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 22px;
  & > img {
    width: 127px;
    height: 127px;
  }

  @media (min-width: 1200px) {
    & > img {
      width: 158px;
      height: 158px;
    }
  }

  @media (min-width: 1920px) {
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
    font-size: 110px;
  }
  @media (min-width: 1920px) {
    font-size: 130px;
  }
`
const StyledItemBodyContent = styled.div`
  margin-left: 10px;
  @media (min-width: 1200px) {
    margin-left: 34px;
  }
`
const StyledItemBodyContentTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.text11Sone};
  @media (min-width: 1200px) {
    font-size: 23px;
  }
  @media (min-width: 1920px) {
    font-size: 40px;
  }
`
const StyledItemBodyContentDescription = styled.div`
  font-size: 13px;
  font-weight: 400;
  color: ${({ theme }) => theme.text4Sone};
  @media (min-width: 1200px) {
    font-size: 16px;
  }
  @media (min-width: 1920px) {
    font-size: 20px;
  }
`

export default StakingHeader
