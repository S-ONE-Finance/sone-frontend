import styled from 'styled-components'
import { AutoColumn } from '../../../components/Column'
import { Text } from 'rebass'
import { ChevronDown } from 'react-feather'
import { darken } from 'polished'
import { Link } from 'react-router-dom'
import { Button } from 'rebass/styled-components'
import Row from '../../../components/Row'

export const Container = styled.div`
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

export const PairName = styled(Text)`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.text6Sone};
  margin-left: 1rem;

  &::after {
    content: 'Pair';
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

export const DetailedSection = styled(AutoColumn)`
  padding: 40px min(160px, 15vw) 20px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 20px min(160px, 15vw) 10px;
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
    height: 35px;
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

export const MoneyBag = styled.img`
  position: absolute;
  width: 180.46px;
  min-width: 180.46px;
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
