import React, { FC, memo } from 'react'
import styled from 'styled-components'

interface BalanceProps {
  circulatingSupplyValue: number
}

const Balances: FC<BalanceProps> = ({ circulatingSupplyValue }) => {
  // TODO_STAKING: remove fake data
  const fakeData = {
    circulatingSupply: 323233,
    totalSupply: 2131321
  }
  return (
    <>
      <StyledWrapper>
        <StyledCirculating>CRS Circulating Supply</StyledCirculating>
        <StyledNumber1>{`${circulatingSupplyValue} SONE`}</StyledNumber1>
        <StyledCirculating>Total Supply</StyledCirculating>
        <StyledNumber>{`${fakeData.totalSupply} SONE`}</StyledNumber>
      </StyledWrapper>
    </>
  )
}

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: stretch;
  }
`

const StyledCirculating = styled.span`
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
  color: #767676;
  margin-right: 10px;
`

const StyledNumber = styled.div`
  font-weight: 700;
  font-size: 30px;
  line-height: 36.31px;
  color: #333333;
`

const StyledNumber1 = styled(StyledNumber)`
  &:after {
    content: ' ';
    margin: 0 10px;
    border-left: 3px solid #333;
  }
`

export default Balances
