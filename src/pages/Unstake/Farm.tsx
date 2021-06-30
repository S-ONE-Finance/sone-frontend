import React, { useState, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { useWalletModalToggle } from '../../state/application/hooks'
import PageHeader from '../../components/PageHeader'
import useFarm from '../../hooks/farms/useFarm'
import { getContract } from '../../sushi/format/erc20'
import Information from './components/Information'
import Unstake from './components/Unstake'
import IconLP from '../../assets/images/icon_lp.svg'
import StakeBackground from '../../assets/images/stake_background.svg'
import { useActiveWeb3React } from 'hooks'

const Farm: React.FC = () => {
  const { farmId } = useParams() as any
  const [val, setVal] = useState('')

  const { pid, lpToken, lpTokenAddress, tokenSymbol, token2Symbol, name } = useFarm(+farmId) || {
    pid: 0,
    lpToken: '',
    lpTokenAddress: '',
    symbolShort: '',
    tokenSymbol: '',
    token2Symbol: '',
    name: ''
  }
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const toggleWalletModal = useWalletModalToggle()
  const { account } = useActiveWeb3React()
  const { library: ethereum } = useWeb3React()
  const lpContract = useMemo(() => {
    const e_provider = ethereum && ethereum.provider ? ethereum.provider : null
    return getContract(e_provider as any, lpTokenAddress)
  }, [ethereum, lpTokenAddress])

  return (
    <>
      <PageHeader icon={IconLP} title={name} />
      <StyledFarm>
        <img src={StakeBackground} alt="" />
        <span>
          <StyledHeading>Unstake</StyledHeading>
          <div>Content here</div>
        </span>
        {account && (
          <StyledCardsWrapper>
            <StyledCardWrapper>
              <Unstake
                lpContract={lpContract}
                pid={pid}
                tokenName={lpToken.toUpperCase()}
                tokenSymbol={tokenSymbol}
                token2Symbol={token2Symbol}
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
          <Information pid={pid} lpTokenAddress={lpTokenAddress} val={val} />
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
    padding 0 15px;
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

export default Farm
