import styled from 'styled-components'
import { Text } from 'rebass'
import { Button } from 'rebass/styled-components'
import { darken } from 'polished'
import { ReactComponent as PlusIconSvg } from '../../assets/images/add-liquidity-vector-light.svg'
import { AutoColumn } from '../../components/Column'
import { ChevronDown } from 'react-feather'
import { Link } from 'react-router-dom'
import Row from '../../components/Row'

export const MyAccountWrapper = styled.div`
  width: 773px;
  max-width: 100%;
  margin-top: 3rem;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-top: 1.25rem;
  `}
`

export const PageTitleMobileOnly = styled.h1`
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  margin: 0.375rem 0 1.75rem;
  display: none;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: block;
  `}
`

export const Sections = styled.div`
  display: grid;
  grid-auto-rows: auto;
  grid-row-gap: 5em;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    grid-row-gap: 2rem;  
  `}
`

export const Section = styled.div`
  display: grid;
  grid-auto-rows: auto;
  grid-row-gap: 2rem;
  justify-items: center;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    grid-row-gap: 10px;
  `}
`

export const Card = styled.div`
  background-color: ${({ theme }) => theme.bg1Sone};
  box-shadow: 0 8px 17px rgba(0, 0, 0, 0.18);
  width: 100%;
  min-height: 75px;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Heading = styled.h2`
  justify-self: flex-start;
  font-size: 40px;
  font-weight: 700;
  color: ${({ theme }) => theme.text6Sone};
  margin: 0;
  padding: 0;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 16px;    
  `}
`

export const SectionText = styled(Text)`
  font-size: 20px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 18px;
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;  
  `}
`

export const SectionButton = styled(Button)<{ is_disabled?: 'yes' }>`
  font-size: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.white};
  height: 60px;
  width: 192px;
  border-radius: 40px;
  background-color: ${({ theme, is_disabled }) => (is_disabled ? theme.text9Sone : theme.red1Sone)};
  box-shadow: 0 4px 39px rgba(0, 0, 0, 0.15);
  cursor: ${({ is_disabled }) => (is_disabled ? 'not-allowed' : 'pointer')};
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;

  :hover {
    background-color: ${({ theme, is_disabled }) => !is_disabled && darken(0.15, theme.red1Sone)};
  }

  :active {
    background-color: ${({ theme, is_disabled }) => !is_disabled && darken(0.2, theme.red1Sone)};
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    height: 45px;
    width: 172px;
    font-size: 18px;
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    height: 2.1875rem;
    max-width: 142px;
    font-size: 13px;
  `}
`

export const PlusIcon = styled(PlusIconSvg)`
  width: 21px;
  min-width: 21px;
  height: auto;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 16px;
    min-width: 16px;  
  `}
`

export const CardLiquidity = styled(Card)`
  border-radius: 15px;
  flex-direction: column;

  & > *:nth-child(even) {
    background-color: ${({ theme }) => theme.bg6Sone};
  }

  & > *:first-child {
    border-radius: 15px 15px 0 0;
  }

  & > *:last-child {
    border-radius: 0 0 15px 15px;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    border-radius: 15px;
  `}
`

export const CardStaking = styled(Card)`
  border-radius: 15px;
  flex-direction: column;
`

export const StakingList = styled.div`
  width: 100%;
  min-height: 75px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  & > *:nth-child(even) {
    background-color: ${({ theme }) => theme.bg6Sone};
  }

  & > *:first-child {
    border-radius: 15px 15px 0 0;
  }

  & > *:last-child {
    border-radius: 0 0 15px 15px;
  }
`

export const MyLiquidityAndStakingContainer = styled.div`
  position: relative;
  width: 100%;
  padding: 20px 30px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 16px 16px;    
  `}
`

export const SummarySection = styled(AutoColumn)`
  grid-template-columns: 40% auto 20%;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    grid-template-columns: 30% auto 30%;    
  `}
`

export const PairName = styled(Text)<{ text: string }>`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.text6Sone};
  margin-left: 1rem;

  &::after {
    content: ${({ text }) => `'${text}'`};
    margin-left: 5px;
    color: ${({ theme }) => theme.text8Sone};
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 18px;    
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;    
  `}
`

// `style-components` không hoạt động với boolean, nên phải để `active: 0 | 1`.
export const DownIcon = styled(ChevronDown)<{ active: 0 | 1 }>`
  width: 22px;
  min-width: 22px;
  height: 22px;
  min-height: 22px;
  transform: ${({ active }) => active && 'rotate(-90deg)'};
  transform-style: flat;
  color: ${({ theme }) => theme.text5Sone};
  cursor: pointer;
  user-select: none;
  z-index: 1;

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.05, theme.text5Sone)};
  }
`

export const StakeLink = styled(Link)`
  color: ${({ theme }) => theme.red1Sone};
  font-size: 16px;
  font-weight: 500;
  z-index: 1;

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.05, theme.red1Sone)};
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;    
  `}
`

export const TextLpTokens = styled(Text)`
  font-size: 20px;
  font-weight: 700;
  word-break: break-all;
  color: ${({ theme }) => theme.text6Sone};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 18px;    
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;    
  `}
`

export const TextPercentage = styled(Text)`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.text5Sone};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 18px;    
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;    
  `}
`

export const TextAPY = styled(Text)`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.text4Sone};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;    
  `}
`

export const MyLiquidityDetailedSection = styled(AutoColumn)`
  padding: 40px min(160px, 15vw) 20px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 20px min(160px, 15vw) 10px;
  `}
`

export const MyStakingDetailedSection = styled(AutoColumn)`
  padding: 2.5rem 0 1.25rem;
  z-index: 1;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 1.25rem 0 0.25rem;
  `}
`

export const ButtonRemove = styled(Button)`
  font-size: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.text5Sone};
  height: 60px;
  width: 45%;
  max-width: 192px;
  border-radius: 40px;
  background-color: ${({ theme }) => theme.white};
  box-shadow: 0 4px 39px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;

  :hover,
  :focus {
    background-color: ${({ theme }) => darken(0.15, theme.white)};
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    height: 45px;
    max-width: 122px;
    font-size: 18px;
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    height: 45px;
    max-width: 122px;
    font-size: 13px;
  `}
`

export const ButtonAdd = styled(ButtonRemove)`
  color: ${({ theme }) => theme.white};
  background-color: ${({ theme }) => theme.red1Sone};

  :hover,
  :focus {
    background-color: ${({ theme }) => darken(0.05, theme.red1Sone)};
  }
`

export const Watermark = styled.img<{ size?: string }>`
  position: absolute;
  width: ${({ size }) => size ?? '180.46px'};
  min-width: ${({ size }) => size ?? '180.46px'};
  height: auto;
  right: 20px;
  bottom: 40px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 120px;
    min-width: 120px;
  `}
`

export const FlexibleRow = styled(Row)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    flex-direction: column;
  `}
`

export const MyStakingButton = styled.button`
  min-width: min(192px, 20vw);
  min-height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: 500;
  border-radius: 50px;
  outline: none;
  border: none;
  cursor: pointer;
  z-index: 1;
  text-decoration: none;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 16px;
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;
    min-height: 45px;
    min-width: 93px;
    padding: unset 10px;
  `}
`

export const ButtonUnstake = styled(MyStakingButton)`
  background-color: ${({ theme }) => theme.text9Sone};
  color: #333333;

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.text9Sone)};
    background-color: ${({ theme }) => darken(0.05, theme.text9Sone)};
  }

  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.text9Sone)};
  }

  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.text9Sone)};
    background-color: ${({ theme }) => darken(0.1, theme.text9Sone)};
  }
`

export const ButtonStake = styled(MyStakingButton)`
  background-color: ${({ theme }) => theme.red1Sone};
  color: white;

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.red1Sone)};
    background-color: ${({ theme }) => darken(0.05, theme.red1Sone)};
  }

  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.red1Sone)};
  }

  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.red1Sone)};
    background-color: ${({ theme }) => darken(0.1, theme.red1Sone)};
  }
`
