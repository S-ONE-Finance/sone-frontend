import React, { useState, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { useWalletModalToggle } from '../../state/application/hooks'
import  provider  from 'web3'
import PageHeader from '../../components/PageHeader'
import useFarm from '../../hooks/farms/useFarm'
import { getContract } from '../../sushi/format/erc20'
import Apy from './components/Apy'
import Stake from './components/Stake'
import IconLP from '../../assets/images/icon_lp.svg'
import StakeBackground from '../../assets/images/stake_background.svg'

const Farm: React.FC = () => {
  const { farmId } = useParams() as any
  const [val, setVal] = useState('')
  
  const {
    pid,
    lpToken,
    lpTokenAddress,
    // tokenAddress,
    tokenSymbol,
    token2Symbol,
    // earnToken,
    name,
    icon,
    icon2,
    description,
    symbolShort,
    protocal,
    iconProtocal,
    pairLink,
    addLiquidityLink
  } = useFarm(farmId) 
  || {
    pid: 0,
    lpToken: '',
    lpTokenAddress: '',
    symbolShort: '',
    tokenSymbol: '',
    token2Symbol: '',
    tokenAddress: '',
    earnToken: '',
    name: '',
    icon: '',
    symbol: '',
    protocal: '',
    iconProtocal: '',
    pairLink: '',
    addLiquidityLink: ''
  }
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const toggleWalletModal = useWalletModalToggle()

  const { account, library: ethereum } = useWeb3React()
  // const [onPresentWalletProviderModal] = useModal(<WalletProviderModal />)
  const lpContract = useMemo(() => {
    const e_provider = ethereum && ethereum.provider ? ethereum.provider : null
    return getContract(e_provider as provider, lpTokenAddress)
  }, [ethereum, lpTokenAddress])

  return (
    <>
      <PageHeader
        icon={IconLP}
        title={name}
      />
      <StyledFarm>
        <img src={StakeBackground} alt=""/>
        <span>
          <StyledHeading>Stake</StyledHeading>
          <div>Content here</div>
        </span>
        {account && (
          <StyledCardsWrapper>
            <StyledCardWrapper>
              <Stake
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
              <button
                onClick={toggleWalletModal} // onPresentWalletProviderModal
              >
                🔓 Unlock Wallet To Continue
              </button>
              {/* <Button
                variant="secondary"
                onClick={toggleWalletModal} // onPresentWalletProviderModal
                text="🔓 Unlock Wallet To Continue"
              /> */}
            </div>
          </StyledCardsWrapper>
        )}
        <StyledApyWrap>
          <Apy
            pid={pid}
            lpTokenAddress={lpTokenAddress}
            val={val}
          />
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

const StyledInfo = styled.h3`
  color: ${props => props.theme.text2};
  font-size: 16px;
  font-weight: 400;
  margin: 0;
  padding: 0;
  text-align: center;
  @media (max-width: 767px) {
    text-align: left;
    br {
      display: none;
    }
  }
`

const StyledHeading = styled.h2`
  color: black;
  opacity: 0.5;
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 20px;
`

const StyledInfoLP = styled.div`
  display: flex;
  padding: 15px 10px;
  background: #00ff5d0f;
  border-radius: 12px;
`

export default Farm
