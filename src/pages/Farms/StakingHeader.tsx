import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useIsDarkMode } from '../../state/user/hooks'
import { PxToRem } from '../../utils/PxToRem'
import AddLiquidity from '../../assets/images/add_liquid.svg'
import Stake from '../../assets/images/stake.svg'
import GetReward from '../../assets/images/get_reward.svg'
import iconMobile from '../../assets/images/icon-sone-mobile.svg'
import iconDarkMobile from '../../assets/images/icon-dark-sone-mobile.svg'

const StakingHeader = () => {
  const { t } = useTranslation()
  const darkMode = useIsDarkMode()

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
                  <StyledItemBodyContentDescription>{option.contentDescription}</StyledItemBodyContentDescription>
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
  justify-content: center;
  display: none;

  & > img {
    width: 100%;
    height: 100%;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: flex;
  `}
`

const StyledHeadingText = styled.div`
  font-weight: 700;
  font-size: ${PxToRem(60)};
  text-align: center;
  margin: ${PxToRem(78)} 0 ${PxToRem(97)};
  ${({ theme }) => theme.mediaWidth.upToLarge`
  font-size: ${PxToRem(40)};
  margin: ${PxToRem(60)} 0;
  `}
  ${({ theme }) => theme.mediaWidth.upToMedium`
  font-size: ${PxToRem(20)};
  margin: ${PxToRem(60)} 0;
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-top: 0;
    margin-bottom: ${PxToRem(60)};
  `}
  & > span {
    color: ${({ theme }) => theme.red1Sone};
  }
`

const StyledItemsWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding: ${PxToRem(10)} 0 ${PxToRem(36)} 0;
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
    padding: 0 ${PxToRem(124)};
  }
`

const StyledItem = styled.div`
  padding: ${PxToRem(18)} ${PxToRem(12)} ${PxToRem(32)} ${PxToRem(8)};
  margin-left: ${PxToRem(20)};
  background: ${({ theme }) => theme.bg8Sone};
  box-shadow: 0 0 ${PxToRem(50)} rgba(92, 36, 38, 0.15);
  border-radius: ${PxToRem(5)};
  min-width: ${PxToRem(270)};
  flex-grow: 1;
  flex-basis: 0;

  @media (min-width: 1024px) {
    box-shadow: none;
    margin-left: 0;
  }

  @media (min-width: 1200px) {
    padding: ${PxToRem(16)} 0 ${PxToRem(129)} 0;
  }
`

const StyledItemImage = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${PxToRem(22)};

  & > img {
    width: ${PxToRem(127)};
    height: ${PxToRem(127)};
  }

  @media (min-width: 1200px) {
    & > img {
      width: ${PxToRem(158)};
      height: ${PxToRem(158)};
    }
  }

  @media (min-width: 1920px) {
    & > img {
      width: ${PxToRem(188)};
      height: ${PxToRem(188)};
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
  font-size: ${PxToRem(60)};
  font-weight: 700;
  color: ${({ theme }) => theme.text12Sone};

  @media (min-width: 1200px) {
    font-size: ${PxToRem(110)};
  }
  @media (min-width: 1920px) {
    font-size: ${PxToRem(130)};
  }
`

const StyledItemBodyContent = styled.div`
  margin-left: ${PxToRem(10)};

  > * + * {
    margin-top: 0.25rem; // 4px.
  }

  @media (min-width: 1200px) {
    margin-left: ${PxToRem(34)};
  }
`
const StyledItemBodyContentTitle = styled.div`
  font-size: ${PxToRem(20)};
  font-weight: 700;
  color: ${({ theme }) => theme.text11Sone};

  @media (min-width: 1200px) {
    font-size: ${PxToRem(23)};
  }
  @media (min-width: 1920px) {
    font-size: ${PxToRem(40)};
  }
`

const StyledItemBodyContentDescription = styled.div`
  font-size: ${PxToRem(13)};
  font-weight: 400;
  color: ${({ theme }) => theme.text4Sone};

  @media (min-width: 1200px) {
    font-size: ${PxToRem(16)};
  }
  @media (min-width: 1920px) {
    font-size: ${PxToRem(20)};
  }
`

export default StakingHeader
