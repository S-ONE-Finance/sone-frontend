import styled from 'styled-components'
import { ReactComponent as PlusIconSvg } from '../../../assets/images/add-liquidity-vector-light.svg'
import { Card } from '../index.styled'
import { Text } from 'rebass'
import { Button } from 'rebass/styled-components'
import { darken } from 'polished'

export const ResponsiveColumn = styled.div`
  display: grid;
  grid-auto-rows: auto;
  grid-row-gap: 2rem;
  justify-items: center;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    grid-row-gap: 10px;
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

export const TextAddLiquidity = styled(Text)`
  font-size: 20px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 18px;
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;  
  `}
`

export const ButtonAddLiquidity = styled(Button)`
  font-size: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.white};
  height: 60px;
  width: 192px;
  border-radius: 40px;
  background-color: ${({ theme }) => theme.red1Sone};
  box-shadow: 0 4px 39px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;

  :hover,
  :focus {
    background-color: ${({ theme }) => darken(0.15, theme.red1Sone)};
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    height: 45px;
    width: 172px;
    font-size: 18px;
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    height: 35px;
    max-width: 142px;
    font-size: 13px;
  `}
`
