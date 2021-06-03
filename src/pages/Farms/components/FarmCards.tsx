import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { CountdownRenderProps } from 'react-countdown'
import styled, { keyframes } from 'styled-components'

import Loader from '../../../components/Loader'
import { Farm } from '../../../contexts/Farms'
import useAllStakedValue from '../../../hooks/farms/useAllStakedValue'
import useFarms from '../../../hooks/farms/useFarms'
import useLuaPrice from '../../../hooks/farms/useLuaPrice'
import usePoolActive from '../../../hooks/farms/usePoolActive'
import useSushi from '../../../hooks/farms/useSushi'
import { START_NEW_POOL_AT } from '../../../sushi/lib/constants'
import { NUMBER_BLOCKS_PER_YEAR } from '../../../config'
import { getNewRewardPerBlock } from '../../../sushi/utils'
import { IsRopsten } from '../../../utils'
import { NavLink } from 'react-router-dom'
import IconAPY from '../../../assets/images/icon_apy.svg'
import IconLP from '../../../assets/images/icon_lp.svg'


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
  const stakedValue = useAllStakedValue()
  const luaPrice = useLuaPrice()

  const rows = farms.reduce<FarmWithStakedValue[][]>(
    (farmRows, farm, i) => {
      const farmWithStakedValue: FarmWithStakedValue = {
        ...farm,
        tokenAmount: (stakedValue[i] || {}).tokenAmount || new BigNumber(0),
        token2Amount: (stakedValue[i] || {}).token2Amount || new BigNumber(0),
        totalToken2Value: (stakedValue[i] || {}).totalToken2Value || new BigNumber(0),
        tokenPriceInToken2: (stakedValue[i] || {}).tokenPriceInToken2 || new BigNumber(0),
        poolWeight: (stakedValue[i] || {}).poolWeight || new BigNumber(0),
        usdValue: (stakedValue[i] || {}).usdValue || new BigNumber(0),
        luaPrice
      }
      console.log('farms', farmWithStakedValue)
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
          <Loader/>
        </StyledLoadingWrapper>
      )}
    </StyledCards>
  )
}

interface FarmCardProps {
  farm: FarmWithStakedValue
}

const FarmCard: React.FC<FarmCardProps> = ({ farm }) => {
  const { chainId } = useWeb3React()
  const isRopsten = IsRopsten(chainId)
  const ID = isRopsten ? 3 : 1
  const poolActive = usePoolActive(farm.pid)

  const sushi = useSushi()
  // const block = useBlockNumber()
  const [newReward, setNewRewad] = useState<BigNumber>()
  useEffect(() => {
    async function fetchData() {
      const supply = await getNewRewardPerBlock(sushi, farm.pid + 1, chainId)
      setNewRewad(supply)
    }
    if (sushi && poolActive) {
      fetchData()
    }
  }, [sushi, setNewRewad, poolActive, chainId, farm.pid])

  const renderer = (countdownProps: CountdownRenderProps) => {
    let { days, hours, minutes, seconds } = countdownProps
    const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes
    hours = days * 24 + hours
    const paddedHours = hours < 10 ? `0${hours}` : hours
    return (
      <span style={{ width: '100%' }}>
        {paddedHours}:{paddedMinutes}:{paddedSeconds}
      </span>
    )
  }

  const startTime = START_NEW_POOL_AT
  return (
    <StyledCardWrapper>
      {/* {farm.tokenSymbol === 'LUA' && <StyledCardAccent />} */}
      <CardWrap>
        <div>
          <StyledContent>
            <StyledTopIcon>
              {farm.isHot && <StyledHotIcon>NO REWARD</StyledHotIcon>}
              {farm.isNew && <StyledNewIcon>THIS WEEK</StyledNewIcon>}
            </StyledTopIcon>
            <div style={{ display: 'flex', background: 'linear-gradient(180deg, #FFEFEF 48.7%, #F8F8F8 100%)' }}>
              <div>
                <StyledTitle>{farm.name}</StyledTitle>
                <StyledMultiplier>40X</StyledMultiplier>
              </div>
              <div style={{ marginLeft: '10px'}}>
                <img src={IconLP} alt="" height="40" />
              </div>
            </div>
           
            <br />
            {!isRopsten ? (
              <StyledInsight>
                <span>Earn</span>
                <span><b>SONE</b></span>
              </StyledInsight>
              ): ''
            }
            {!farm.isHot && (
              <>
                <StyledInsight>
                  <span>APY</span>
                  <span style={{ fontWeight: 'bold', color: '#3FAAB0' }}>
                    <img src={IconAPY} alt="" height={12}/>
                    {newReward && farm.poolWeight && farm.luaPrice && farm.usdValue
                      ? `${parseFloat(farm.luaPrice
                            .times(NUMBER_BLOCKS_PER_YEAR[ID])
                            .times(newReward.div(10 ** 18))
                            .div(farm.usdValue)
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
                    {farm.usdValue && (
                      <>
                        <b>${parseFloat(farm.usdValue.toFixed(2)).toLocaleString('en-US')}</b>
                      </>
                    )}
                  </span>
                </StyledInsight>
              </>
            )}
            {/* <Button disabled={!(poolActive)} text={poolActive ? 'Select' : undefined} to={`/farming/${farm.id}`}> */}
             <NavLink to={`/farming/${farm.id}`} style={{
                background: 'linear-gradient(90deg, #F05359 27.06%, #F58287 111.99%)',
                borderRadius: '52px',
                color: 'white',
                width: '230px',
                height: '40px',
                lineHeight: '40px',
                textAlign: 'center',
                textDecoration: 'none',
                fontWeight: 'bold'
             }}>
              Select
              {/* {!poolActive && <Countdown date={new Date(startTime * 1000)} renderer={renderer} />} */}
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
const RainbowLight = keyframes`
  
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
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
const StyledTopIcon = styled.div`
  // position: relative;
`

const StyledHotIcon = styled.div`
  position: absolute;
  background-color: gray;
  padding: 8px 40px 8px;
  top: 12px;
  left: -40px;
  font-weight: bold;
  -webkit-transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  transform: rotate(-45deg);
  color: #fff;
  font-size: 9px;
`
const StyledNewIcon = styled.div`
  position: absolute;
  padding: 8px 40px 8px;
  top: 12px;
  left: -40px;
  background-color: ${props => props.theme.primary1};
  font-weight: bold;
  -webkit-transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  transform: rotate(-45deg);
  color: #fff;
  font-size: 9px;
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
  border: 2px solid #3FAAB0;
  border-radius: 19px;
  display: inline;
  color: #3FAAB0;
  padding: 5px 14px;
`

export default FarmCards
