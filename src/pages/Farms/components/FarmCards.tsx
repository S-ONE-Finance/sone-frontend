import React from 'react'
import { isEmpty } from 'lodash'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import IconAPY from '../../../assets/images/icon_apy.svg'
import IconLP from '../../../assets/images/icon_lp.svg'
import Loader from '../../../components/Loader'
import { Farm } from '@s-one-finance/sdk-core/'

const FarmCards: React.FC<{ farms: Farm[] | undefined }> = ({ farms = [] }) => {
  return (
    <>
      {isEmpty(farms) ? (
        <StyledLoadingWrapper>
          <Loader size="30px" />
        </StyledLoadingWrapper>
      ) : (
        <StyledCards>
          {farms.map((farm, i) => (
            <FarmCard farm={farm} key={i} />
          ))}
        </StyledCards>
      )}
    </>
  )
}

interface FarmCardProps {
  farm: Farm
}

const FarmCard: React.FC<FarmCardProps> = ({ farm }) => {
  return (
    <>
      <CardWrap>
        <StyledCardHeader>
          <StyledCardHeaderTitle>
            <StyledTitle>{farm.symbol}</StyledTitle>
            <StyledMultiplier>{farm.multiplier}X</StyledMultiplier>
          </StyledCardHeaderTitle>
          <div>
            <img src={IconLP} alt="" height="84" width="84" />
          </div>
        </StyledCardHeader>
        <StyledCardBody>
          <StyledItemRow>
            Earn
            <span>SONE</span>
          </StyledItemRow>
          <StyledItemRow>
            APY
            <StyledItemRowImage>
              <img src={IconAPY} alt="" />
              <div>&nbsp;{`${farm.roiPerYear * 100}%`}</div>
            </StyledItemRowImage>
          </StyledItemRow>
          <StyledLastItemRow>
            Total liquidity
            <span>${farm.balanceUSD && farm.balanceUSD}</span>
          </StyledLastItemRow>
          <StyledButton>
            <NavLink to={`/staking/${farm.id}`}>Select</NavLink>
          </StyledButton>
        </StyledCardBody>
      </CardWrap>
    </>
  )
}

const CardWrap = styled.div`
  background: ${({ theme }) => theme.bg10Sone};
  border-radius: 32px;
`

const StyledCards = styled.div`
  display: grid;
  justify-content: center;
  width: 100%;
  padding: 0 25px;
  grid-template-columns: repeat(auto-fill, minmax(340px, 396px));
  column-gap: 20px;
  row-gap: 20px;

  @media (min-width: 768px) {
    column-gap: 25px;
    row-gap: 25px;
    grid-template-columns: repeat(2, minmax(340px, 396px));
  }

  @media (min-width: 1024px) {
    padding: 10px 25px 25px;
    column-gap: 45px;
    row-gap: 45px;
    grid-template-columns: repeat(2, minmax(340px, 396px));
  }

  @media (min-width: 1200px) {
    padding: 25px 25px 25px;
    column-gap: 50px;
    row-gap: 50px;
    grid-template-columns: repeat(3, minmax(340px, 396px));
  }
`

const StyledLoadingWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
  width: 100vw;
  height: 100%;
  & > svg {
    margin: 30px 0;
  }
`

const StyledTitle = styled.h4`
  font-size: 20px;
  line-height: 30px;
  font-weight: bold;
  margin: 10px 0 12px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  @media (min-width: 1024px) {
    font-size: 26px;
  }
`

const StyledItemRow = styled.div`
  color: ${({ theme }) => theme.text4Sone};
  display: flex;
  font-size: 13px;
  justify-content: space-between;
  box-sizing: border-box;
  border-radius: 8px;
  margin-bottom: 20px;
  background: transparent;
  width: 100%;
  border: 0px solid #e6dcd5;
  @media (min-width: 1024px) {
    font-size: 16px;
  }

  @media (min-width: 1200px) {
    margin-bottom: 30px;
  }

  & > span {
    color: ${({ theme }) => theme.text6Sone};
    font-weight: 700;
  }
`

const StyledLastItemRow = styled(StyledItemRow)`
  margin-bottom: 0;
`
const StyledItemRowImage = styled.div`
  display: flex;
  align-items: center;
  color: #3faab0;
  height: 22px;
  & > div {
    font-weight: 700;
  }
`

const StyledMultiplier = styled.div`
  border: 2px solid #3faab0;
  border-radius: 19px;
  display: inline;
  color: #3faab0;
  padding: 5px 14px;
  margin-top: 12px;
  font-size: 16px;
`

const StyledCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 25px 20px;
  background: ${({ theme }) => theme.bg9Sone};
  width: 100%;
  border-top-left-radius: 32px;
  border-top-right-radius: 32px;
  @media (min-width: 1200px) {
    padding: 30px 25px;
  }
`

const StyledCardBody = styled.div`
  padding: 25px 20px;
  @media (min-width: 1200px) {
    padding: 30px 25px;
  }
`
const StyledCardHeaderTitle = styled.div`
  max-width: 60%;
`

const StyledButton = styled.div`
  & > a {
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(90deg, #f05359 27.06%, #f58287 111.99%);
    color: white;
    border-radius: 52px;
    font-size: 13px;
    padding: 15px 0;
    text-decoration: none;
    font-weight: 700;
    margin: 20px auto 0;
    @media (min-width: 1024px) {
      margin: 30px auto 0;
      font-size: 24px;
    }
  }
`

export default FarmCards
