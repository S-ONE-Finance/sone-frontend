import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Farm } from '@s-one-finance/sdk-core/'
import IconAPY from '../../assets/images/icon_apy.svg'
import Loader from '../../components/Loader'
import { getFixedNumberCommas, getNumberCommas } from '../../utils/formatNumber'
import LiquidityProviderTokenLogo from '../../components/LiquidityProviderTokenLogo'

const FarmCards: React.FC<{ farms: Farm[] | undefined; isLoading: boolean }> = ({ farms = [], isLoading }) => {
  return (
    <>
      {isLoading ? (
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
  const { t } = useTranslation()
  const { token0, token1 } = farm?.liquidityPair || {}

  return (
    <>
      <CardWrap>
        <StyledCardHeader>
          <StyledCardHeaderTitle>
            <StyledTitle>{farm.symbol}</StyledTitle>
            <StyledMultiplier>{farm.multiplier}X</StyledMultiplier>
          </StyledCardHeaderTitle>
          <StyledCardHeaderIcon>
            <LiquidityProviderTokenLogo
              address0={token0 && token0.id}
              address1={token1 && token1.id}
              size={50}
              sizeMobile={38}
              main={false}
            />
          </StyledCardHeaderIcon>
        </StyledCardHeader>
        <StyledCardBody>
          <StyledItemRow>
            {t('earn')}
            <span>{getFixedNumberCommas(farm.soneHarvested.toString(), 6)} SONE</span>
          </StyledItemRow>
          <StyledItemRow>
            {t('apy')}
            <StyledItemRowImage>
              <img src={IconAPY} alt="" />
              <div>&nbsp;{`${getNumberCommas(farm.roiPerYear * 100)}%`}</div>
            </StyledItemRowImage>
          </StyledItemRow>
          <StyledLastItemRow>
            {t('total_liquidity')}
            <span>${farm.balanceUSD && getNumberCommas(farm.balanceUSD)}</span>
          </StyledLastItemRow>
          <StyledButton>
            <NavLink to={`/staking/${farm.id}`}>{t('select')}</NavLink>
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
  padding: 0 25px 25px;
  grid-template-columns: repeat(3, minmax(339px, 396px));
  column-gap: 50px;
  row-gap: 50px;
  min-height: 200px;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    column-gap: 50px;
    row-gap: 50px;
    grid-template-columns: repeat(2, minmax(339px, 396px));
  `}

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0 21px 0 15px;
    grid-template-columns: repeat(auto-fill, minmax(339px, 396px));
    column-gap: 15px;
    row-gap: 15px;
  `}
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
  font-size: 26px;
  font-weight: bold;
  margin: 0 0 12px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 20px;
  `}
`

const StyledItemRow = styled.div`
  color: ${({ theme }) => theme.text4Sone};
  display: flex;
  align-items: center;
  font-size: 16px;
  justify-content: space-between;
  box-sizing: border-box;
  border-radius: 8px;
  padding: 0 39px 0 32px;
  margin-bottom: 25px;
  background: transparent;
  width: 100%;
  border: 0px solid #e6dcd5;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 13px;
    padding: 0 20px 0 32px;
    margin-bottom: 15px;
  `}

  & > span {
    font-size: 16px;
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
  display: inline-block;
  color: #3faab0;
  padding: 5px 14px;
  font-size: 16px;
  font-weight: bold;
`

const StyledCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 33px 38px 23px 32px;
  background: ${({ theme }) => theme.bg9Sone};
  width: 100%;
  border-top-left-radius: 32px;
  border-top-right-radius: 32px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 21px 29px 20px 34px;
  `}
`

const StyledCardBody = styled.div`
  padding: 28px 0 33px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  padding: 15px 0 21px;
  `}
`
const StyledCardHeaderTitle = styled.div`
  max-width: 60%;
`

const StyledCardHeaderIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.bg1Sone};
  border-radius: 50%;
  width: 84px;
  height: 84px;
  & > img {
    width: 50px;
    height: 65px;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 65px;
    height: 65px;
    & > img {
      width: 38px;
      height: 40px;
    }
  `}
`

const StyledButton = styled.div`
  & > a {
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(90deg, #f05359 27.06%, #f58287 111.99%);
    color: white;
    border-radius: 52px;
    text-decoration: none;
    font-weight: 700;
    margin: 36px 25px 0;
    font-size: 24px;
    padding: 21px 74px;

    ${({ theme }) => theme.mediaWidth.upToMedium`
    margin: 17px 22px 0 25px;
    font-size: 13px;
    padding: 14px 46px 14px 48px;

    `}
  }
`

export default FarmCards
