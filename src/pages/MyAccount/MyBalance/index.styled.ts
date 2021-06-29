import styled from 'styled-components'
import { Card } from '../index.styled'
import Row from '../../../components/Row'

export const CardBalance = styled(Card)`
  padding: 51px 99px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 51px 39px;    
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 20px 32px;    
  `}
`

export const TextBalance = styled.div`
  font-size: 20px;
  font-weight: 400;
  color: ${({ theme }) => theme.text6Sone};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;
  `}
`

export const TextBalanceAmount = styled.div`
  font-size: 40px;
  font-weight: 700;
  color: ${({ theme }) => theme.text5Sone};
  margin-left: 20px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 30px;
    margin-left: 6px;
  `}
`

export const TextBalanceSymbol = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.text6Sone};
  margin-left: 8px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 16px;
    margin-left: 3px;
  `}
`

export const MyBalanceWrapper = styled.div`
  display: grid;
  grid-auto-rows: auto;
  grid-row-gap: 2rem;
  justify-items: center;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    grid-row-gap: 10px;
  `}
`

export const BalanceSection = styled.div`
  display: grid;
  grid-auto-rows: auto;
  grid-row-gap: 20px;
  flex-grow: 1;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    grid-row-gap: 10px;
  `}
`

export const RowBaseLine = styled(Row)`
  align-items: baseline;
`
