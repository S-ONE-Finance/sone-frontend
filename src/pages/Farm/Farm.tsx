import { useActiveWeb3React } from 'hooks'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import IconLP from '../../assets/images/icon_lp.svg'
import StakeBackground from '../../assets/images/stake_background.svg'
import PageHeader from '../../components/PageHeader'
import useFarm from '../../hooks/masterfarmer/useFarm'
import { useWalletModalToggle } from '../../state/application/hooks'
import Apy from './components/Apy'
import Stake from './components/Stake'
import { Farm } from '@s-one-finance/sdk-core/'

const FarmDetail: React.FC = () => {
  const { farmId } = useParams() as any
  const [val, setVal] = useState('')

  const farm: Farm | undefined = useFarm('' + farmId)

  const { pairAddress, symbol } = farm || {
    pairAddress: '',
    symbol: ''
  }

  const toggleWalletModal = useWalletModalToggle()
  const { account } = useActiveWeb3React()

  return (
    <>
      <PageHeader icon={IconLP} title={symbol} />
      <StyledFarm>
        <img src={StakeBackground} alt="" />
        <span>
          <StyledHeading>Stake</StyledHeading>
          <div>Content here</div>
        </span>
        {account && (
          <StyledCardsWrapper>
            <StyledCardWrapper>
              <Stake
                pairAddress={pairAddress}
                pid={Number(farmId)}
                symbol={symbol.toUpperCase()}
                val={val}
                setVal={setVal}
              />
            </StyledCardWrapper>
          </StyledCardsWrapper>
        )}
        {!account && (
          <StyledCardsWrapper>
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                flex: 1,
                justifyContent: 'center'
              }}
            >
              <button onClick={toggleWalletModal}>Unlock Wallet To Continue</button>
            </div>
          </StyledCardsWrapper>
        )}
        <StyledApyWrap>
          <Apy val={val} farm={farm} />
        </StyledApyWrap>
      </StyledFarm>
    </>
  )
}

const StyledApyWrap = styled.div`
  width: 600px;
  @media (max-width: 767px) {
    width: 100%;
  }
`
const StyledFarm = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 767px) {
    padding: 0 15px;
  }
`

const StyledCardsWrapper = styled.div`
  display: flex;
  width: 600px;
  @media (max-width: 767px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 767px) {
    width: 80%;
  }
`

const StyledHeading = styled.h2`
  color: black;
  opacity: 0.5;
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 20px;
`

export default FarmDetail
