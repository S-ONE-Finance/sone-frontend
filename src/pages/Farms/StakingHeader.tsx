import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useIsDarkMode } from '../../state/user/hooks'
import { pxToRem } from '../../utils/PxToRem'
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
  font-size: ${pxToRem(60)};
  text-align: center;
  margin: ${pxToRem(78)} 0 ${pxToRem(97)};
  ${({ theme }) => theme.mediaWidth.upToLarge`
  font-size: ${pxToRem(40)};
  margin: ${pxToRem(60)} 0;
  `}
  ${({ theme }) => theme.mediaWidth.upToMedium`
  font-size: ${pxToRem(20)};
  margin: ${pxToRem(60)} 0;
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-top: 0;
    margin-bottom: ${pxToRem(60)};
  `}
  & > span {
    color: ${({ theme }) => theme.red1Sone};
  }
`

const StyledItemsWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: hidden;
  padding: 0 ${pxToRem(124)};
  background: ${({ theme }) => theme.bg8Sone};
  box-sizing: content-box;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    width: 0;
    background: transparent;
    display: none;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    overflow-x: auto;
    padding: ${pxToRem(10)} 0 ${pxToRem(36)} 0;
  `}
`

const StyledItem = styled.div`
  margin-left: 0;
  padding: ${pxToRem(16)} 0 ${pxToRem(129)} 0;
  background: ${({ theme }) => theme.bg8Sone};
  border-radius: ${pxToRem(5)};
  min-width: ${pxToRem(270)};
  flex-grow: 1;
  flex-basis: 0;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1.125rem 0.75rem 2rem 0.5rem;
    box-shadow: 0 0 ${pxToRem(50)} rgba(92, 36, 38, 0.15);
    margin-left: ${pxToRem(20)};
  `}
`

const StyledItemImage = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${pxToRem(22)};
  & > img {
    width: ${pxToRem(188)};
    height: ${pxToRem(188)};
  }

  ${({ theme }) => theme.mediaWidth.upToLarge`
    & > img {
        width: ${pxToRem(158)};
        height: ${pxToRem(158)};
      }
  `}

  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin-bottom: ${pxToRem(6)};
    & > img {
      width: ${pxToRem(127)};
      height: ${pxToRem(127)};
    }
  `}
`

const StyledItemBody = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    justify-content: unset;
  `}
`

const StyledItemBodyNumberST = styled.div`
  font-size: ${pxToRem(130)};
  font-weight: 700;
  color: ${({ theme }) => theme.text12Sone};

  ${({ theme }) => theme.mediaWidth.upToLarge`
    font-size: ${pxToRem(110)};
  `}

  ${({ theme }) => theme.mediaWidth.upToMedium`
  font-size: ${pxToRem(60)};
  `}
`

const StyledItemBodyContent = styled.div`
  margin-left: ${pxToRem(34)};

  > * + * {
    margin-top: 0.25rem; // 4px.
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin-left: ${pxToRem(10)};
  `}
`
const StyledItemBodyContentTitle = styled.div`
  font-size: ${pxToRem(40)};
  font-weight: 700;
  color: ${({ theme }) => theme.text11Sone};

  ${({ theme }) => theme.mediaWidth.upToLarge`
    font-size: ${pxToRem(21)};
  `}

  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: ${pxToRem(20)};
  `}
`

const StyledItemBodyContentDescription = styled.div`
  font-size: ${pxToRem(20)};
  font-weight: 400;
  color: ${({ theme }) => theme.text4Sone};

  ${({ theme }) => theme.mediaWidth.upToLarge`
    font-size: ${pxToRem(15)};
  `}

  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: ${pxToRem(13)};
  `}
`

export default StakingHeader
