import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { Farm } from 'hooks/masterfarmer/interfaces'
import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import IconAPY from '../../../assets/images/icon_apy.svg'
import IconLP from '../../../assets/images/icon_lp.svg'
import Loader from '../../../components/Loader'
import { NUMBER_BLOCKS_PER_YEAR } from '../../../config'
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

const FarmCards: React.FC<{ farms: Farm[] | undefined }> = ({ farms }) => {
  // const [farms] = useFarms()
  // TODO_STAKING: remove fake data
  const luaPrice = new BigNumber(10)

  const rows = farms?.reduce<FarmWithStakedValue[][]>(
    (farmRows, farm, i) => {
      // TODO_STAKING: remove fake data
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
      // const newFarmRows = [...farmRows]
      // if (newFarmRows[newFarmRows.length - 1].length === 3) {
      //   newFarmRows.push([farmWithStakedValue])
      // } else {
      //   newFarmRows[newFarmRows.length - 1].push(farmWithStakedValue)
      // }
      return [...farmRows, farmWithStakedValue]
    },
    [[]]
  )
  console.log(rows)

  return (
    <StyledCards>
      {rows && !!rows[0].length ? (
        rows.map((farmRow, i) => (
          <div key={i}>
            {farmRow.map((farm, j) => (
              <React.Fragment key={j}>
                <FarmCard farm={farm} />
                {(j === 0 || j === 1) && <StyledSpacer />}
              </React.Fragment>
            ))}
          </div>
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
  // TODO_STAKING: remove fake data
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
    <>
      {/* <CardWrap> */}
      <div>
        <StyledContent>
          <StyledCardHeader>
            <div>
              <StyledTitle>{farm.symbol}</StyledTitle>
              <StyledMultiplier> {farm.multiplier}X</StyledMultiplier>
            </div>
            <div style={{ marginLeft: '10px' }}>
              <img src={IconLP} alt="" height="84" width="84" />
            </div>
          </StyledCardHeader>
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
              {`${farm.roiPerYear * 100}%`}
            </span>
          </StyledInsight>
          <StyledInsight>
            <span>Total liquidity</span>
            <span>
              {fakeData.usdValue && (
                <>
                  <b>${farm.balanceUSD}</b>
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
      {/* </CardWrap> */}
    </>
  )
}

const CardWrap = styled.div`
  background-color: ${props => props.theme.bg1};
`

const StyledCards = styled.div`
  display: grid;
  column-gap: 50px;
  row-gap: 50px;
  grid-template-columns: 1fr 1fr 1fr;
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
  // display: flex;
  margin-bottom: 2000px;
  // flex-flow: row wrap;
  // @media (max-width: 768px) {
  //   width: 100%;
  //   flex-flow: column nowrap;
  //   align-items: center;
  // }
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

const StyledCardHeader = styled.div`
  display: flex;
  justify-content: center;
  padding: 23px 32px;
  background: linear-gradient(180deg, #ffefef 48.7%, #f8f8f8 100%);
  width: 100%;
  border-top-left-radius: 32px
  border-top-right-radius: 32px
`

export default FarmCards
