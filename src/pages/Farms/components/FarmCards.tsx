import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import IconAPY from '../../../assets/images/icon_apy.svg'
import IconLP from '../../../assets/images/icon_lp.svg'
import Loader from '../../../components/Loader'
import { NUMBER_BLOCKS_PER_YEAR } from '../../../config'
import { Farm } from '../../../contexts/Farms'
import useFarms from '../../../hooks/farms/useFarms'
import { IsRopsten } from '../../../utils'
interface FarmWithStakedValue extends Farm {
  tokenAmount: BigNumber
  token2Amount: BigNumber
  totalToken2Value: BigNumber
  tokenPriceInToken2: BigNumber
  usdValue: BigNumber
  poolWeight: BigNumber
  luaPrice: BigNumber
}

const FarmCards: React.FC = () => {
  const [farms] = useFarms()
  // fake data
  const luaPrice = new BigNumber(10)

  const rows = farms.reduce<FarmWithStakedValue[][]>(
    (farmRows, farm, i) => {
      // fake data
      const farmWithStakedValue: FarmWithStakedValue = {
        ...farm,
        tokenAmount: new BigNumber(0),
        token2Amount: new BigNumber(0),
        totalToken2Value: new BigNumber(0),
        tokenPriceInToken2: new BigNumber(0),
        poolWeight: new BigNumber(0),
        usdValue: new BigNumber(0),
        luaPrice
      }
      const newFarmRows = [...farmRows]
      if (newFarmRows[newFarmRows.length - 1].length === 3) {
        newFarmRows.push([farmWithStakedValue])
      } else {
        newFarmRows[newFarmRows.length - 1].push(farmWithStakedValue)
      }
      return newFarmRows
    },
    [[]]
  )

  return (
    <StyledCards>
      {!!rows[0].length ? (
        rows.map((farmRow, i) => (
          <StyledRow key={i}>
            {farmRow.map((farm, j) => (
              <React.Fragment key={j}>
                <FarmCard farm={farm} />
                {(j === 0 || j === 1) && <StyledSpacer />}
              </React.Fragment>
            ))}
          </StyledRow>
        ))
      ) : (
        <StyledLoadingWrapper>
          <Loader />
        </StyledLoadingWrapper>
      )}
    </StyledCards>
  )
}

interface FarmCardProps {
  farm: FarmWithStakedValue
}

const FarmCard: React.FC<FarmCardProps> = ({ farm }) => {
  const fakeData = {
    id: 1,
    newReward: new BigNumber(1231321212131),
    poolWeight: new BigNumber(20),
    luaPrice: new BigNumber(1231321212131),
    usdValue: new BigNumber(1231321212131),
    multiplier: 40
  }

  const { chainId } = useWeb3React()
  const isRopsten = IsRopsten(chainId)
  const ID = isRopsten ? 3 : 1

  return (
    <StyledCardWrapper>
      <CardWrap>
        <div>
          <StyledContent>
            <div style={{ display: 'flex', background: 'linear-gradient(180deg, #FFEFEF 48.7%, #F8F8F8 100%)' }}>
              <div>
                <StyledTitle>{farm.name}</StyledTitle>
                <StyledMultiplier> {fakeData.multiplier}X</StyledMultiplier>
              </div>
              <div style={{ marginLeft: '10px' }}>
                <img src={IconLP} alt="" height="40" />
              </div>
            </div>
            <br />
            <StyledInsight>
              <span>Earn</span>
              <span>
                <b>SONE</b>
              </span>
            </StyledInsight>
            <StyledInsight>
              <span>APY</span>
              <span style={{ fontWeight: 'bold', color: '#3FAAB0' }}>
                <img src={IconAPY} alt="" height={12} />
                {fakeData.newReward && fakeData.poolWeight && fakeData.luaPrice && fakeData.usdValue
                  ? `${parseFloat(
                      fakeData.luaPrice
                        .times(NUMBER_BLOCKS_PER_YEAR[ID])
                        .times(fakeData.newReward.div(10 ** 18))
                        .div(fakeData.usdValue)
                        .div(10 ** 8)
                        .times(100)
                        .toFixed(2)
                    ).toLocaleString('en-US')}%`
                  : '~'}
              </span>
            </StyledInsight>
            <StyledInsight>
              <span>Total liquidity</span>
              <span>
                {fakeData.usdValue && (
                  <>
                    <b>${parseFloat(fakeData.usdValue.toFixed(2)).toLocaleString('en-US')}</b>
                  </>
                )}
              </span>
            </StyledInsight>
            <NavLink
              to={`/staking/${fakeData.id}`}
              style={{
                background: 'linear-gradient(90deg, #F05359 27.06%, #F58287 111.99%)',
                borderRadius: '52px',
                color: 'white',
                width: '230px',
                height: '40px',
                lineHeight: '40px',
                textAlign: 'center',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              Select
            </NavLink>
          </StyledContent>
        </div>
      </CardWrap>
    </StyledCardWrapper>
  )
}

const CardWrap = styled.div`
  background-color: ${props => props.theme.bg1};
`

const StyledCards = styled.div`
  width: 1200px;
  @media (max-width: 768px) {
    width: 100%;
  }
`

const StyledLoadingWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
`

const StyledRow = styled.div`
  display: flex;
  margin-bottom: 10px;
  flex-flow: row wrap;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`

const StyledCardWrapper = styled.div`
  display: flex;
  width: calc((1200px - 10px * 2) / 3);
  position: relative;
  overflow: hidden;
  border-radius: 12px;
`

const StyledTitle = styled.h4`
  font-size: 26px;
  line-height: 30px;
  font-weight: bold;
  margin: 10px 0 0;
  padding: 0;
`

const StyledContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`

const StyledSpacer = styled.div`
  height: 10px;
  width: 10px;
`

const StyledInsight = styled.div`
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  border-radius: 8px;
  background: transparent;
  width: 100%;
  line-height: 25px;
  font-size: 13px;
  border: 0px solid #e6dcd5;
  text-align: center;
`

const StyledMultiplier = styled.div`
  border: 2px solid #3faab0;
  border-radius: 19px;
  display: inline;
  color: #3faab0;
  padding: 5px 14px;
`

export default FarmCards
