import React from 'react'
import styled from 'styled-components'

import AddLiquidity from '../../../assets/images/add_liquid.svg'
import Stake from '../../../assets/images/stake.svg'
import GetReward from '../../../assets/images/get_reward.svg'

const StakingHeader = () => {
  return (
    <>
      <StyledHeading>
        ONLY 3 STEPS TO EARN <span style={{ color: '#F05359' }}>SONE</span>
      </StyledHeading>
      <StyledItems>
        <StyledItem>
          <div style={{ display: 'flex' }}>
            <img src={AddLiquidity} alt="" style={{ margin: '0 auto' }} />
          </div>
          <StyledItemBody>
            <StyledItemTitle>01</StyledItemTitle>
            <StyledContent>
              <StyledTitle>Add Liquidity</StyledTitle>
              <StyledDescription>Explain how to add liquidity.</StyledDescription>
            </StyledContent>
          </StyledItemBody>
        </StyledItem>
        <StyledItem>
          <div style={{ display: 'flex' }}>
            <img src={Stake} alt="" style={{ margin: '0 auto' }} />
          </div>
          <StyledItemBody>
            <StyledItemTitle>02</StyledItemTitle>
            <StyledContent>
              <StyledTitle>Staking</StyledTitle>
              <StyledDescription>Explain how to stake here.</StyledDescription>
            </StyledContent>
          </StyledItemBody>
        </StyledItem>
        <StyledItem>
          <div style={{ display: 'flex' }}>
            <img src={GetReward} alt="" style={{ margin: '0 auto' }} />
          </div>
          <StyledItemBody>
            <StyledItemTitle>03</StyledItemTitle>
            <StyledContent>
              <StyledTitle>Get Your Rewards</StyledTitle>
              <StyledDescription>Get your rewards after the steps.</StyledDescription>
            </StyledContent>
          </StyledItemBody>
        </StyledItem>
      </StyledItems>
    </>
  )
}

const StyledHeading = styled.div`
  font-weight: bold;
  font-size: 60px;
  line-height: 70px;
  margin-top: 78px;
  margin-bottom: 90px;
`

const StyledItems = styled.div`
  width: 90%;
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  @media (max-width: 768px) {
    font-size: 13px;
  }
`
const StyledItemBody = styled.div`
  display: flex;
`

const StyledItem = styled.div`
  // display: flex;
  // justify-content: center;
`
const StyledItemTitle = styled.div`
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
  color: #e1e1e1;
  float: left;
  font-weight: bold;
  font-size: 130px;
`

const StyledContent = styled.div`
  width: 400px;
  height: 150px;
  padding-top: 20px;
  float: left;
  margin-left: 10px;
`

const StyledTitle = styled.div`
  font-weight: bold;
  font-size: 40px;
  line-height: 47px;
`

const StyledDescription = styled.div`
  font-size: 20px;
  color: #767676;
`

export default StakingHeader
