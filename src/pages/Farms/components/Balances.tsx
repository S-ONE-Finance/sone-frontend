import BigNumber from 'bignumber.js'
import React, { memo, useEffect, useState } from 'react'
import CountUp from 'react-countup'
import styled from 'styled-components'

import { useWeb3React } from '@web3-react/core'

import Value from '../../../components/Value'
import useAllEarnings from '../../../hooks/farms/useAllEarnings'
import useTokenBalance from '../../../hooks/farms/useTokenBalance'
import useSushi from '../../../hooks/farms/useSushi'
import { getSushiAddress } from '../../../sushi/utils'
import { getBalanceNumber } from '../../../sushi/format/formatBalance'
import Lua from '../../../assets/images/lua-icon.svg'
import Luas from '../../../assets/images/luas-icon.svg'
import useLuaTotalSupply from '../../../hooks/farms/useLuaTotalSupply'
import useLuaCirculatingSupply from '../../../hooks/farms/useLuaCirculatingSupply'
import { IsRopsten } from '../../../utils'

const PendingRewards: React.FC = () => {
  const [start, setStart] = useState(0)
  const [end, setEnd] = useState(0)
  const [scale, setScale] = useState(1)

  const allEarnings = useAllEarnings()
  let sumEarning = 0
  for (const earning of allEarnings) {
    sumEarning += new BigNumber(earning).div(new BigNumber(10).pow(18)).toNumber()
  }

  useEffect(() => {
    setStart(end)
    setEnd(sumEarning)
  }, [sumEarning])

  return (
    <span
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'right bottom',
        transition: 'transform 0.5s',
        display: 'inline-block'
      }}
    >
      <CountUp
        start={start}
        end={end}
        decimals={end < 0 ? 4 : end > 1e5 ? 0 : 3}
        duration={1}
        onStart={() => {
          setScale(1.25)
          setTimeout(() => setScale(1), 600)
        }}
        separator=","
      />
    </span>
  )
}

const Balances = memo(() => {
  const totalSupply = useLuaTotalSupply()
  const circulatingSupply = useLuaCirculatingSupply()
  const sushi = useSushi()
  const sushiBalance = useTokenBalance(getSushiAddress(sushi))
  const { chainId, account } = useWeb3React()
  const isRopsten = IsRopsten(chainId)
  return (
    <StyledWrapper>
      {!isRopsten ? (
        <>
          <div>
            <div>
              <StyledBalances>
                <StyledBalance>
                  {/* <SushiIcon /> */}
                  <img src={Lua} alt="LUA Balance" />
                  <div style={{ flex: 1 }}>
                    <div>Your Available LUA Balance</div>
                    <Value value={!!account ? getBalanceNumber(sushiBalance) : 'Locked'} />
                  </div>
                </StyledBalance>
              </StyledBalances>
            </div>
            <Footnote>
              Pending harvest
              <FootnoteValue>
                <PendingRewards /> LUA
              </FootnoteValue>
            </Footnote>
          </div>
          <div>
            <div>
              <StyledBalance>
                <img src={Luas} alt="Total LUA Supply" />
                  <div style={{ flex: 1 }}>
                    <div>LUA Circulating Supply</div>
                    <Value value={circulatingSupply ? getBalanceNumber(circulatingSupply) : '~'} />
                  </div>
              </StyledBalance>
            </div>
              <Footnote>          
                {!isRopsten ? (
                  <>
                    Total Supply
                    <FootnoteValue>
                      {totalSupply ? `${parseFloat(getBalanceNumber(totalSupply).toFixed(2)).toLocaleString('en-US')} LUA` : '~'}
                    </FootnoteValue>
                  </>
                  ) : ' on TomoChain Network'
                }
              </Footnote>
          </div>
        </>) : (
          <CustomCard>
            <div>
              <StyledBalances>
                <StyledBalance>
                  <img src={Lua} alt="LUA Balance" />
                  <div style={{ flex: 1 }}>
                    <div>Your Available LUA Balance</div>
                    <Value value={!!account ? getBalanceNumber(sushiBalance) : 'Locked'} />
                  </div>
                </StyledBalance>
              </StyledBalances>
            </div>
            <Footnote>
              Pending harvest
              <FootnoteValue>
                <PendingRewards /> LUA
              </FootnoteValue>
            </Footnote>
          </CustomCard>
        )
      }
    </StyledWrapper>
  )
})

const CustomCard = styled.div`
  background: ${props => props.theme.bg1};
  border-radius: 12px;
  overflow: hidden;
  display: inline-block;
  margin: 0 auto;
`
const Footnote = styled.div`
  font-size: 14px;
  padding: 14px 20px;
  color: ${props => props.theme.text2};
  background-color: ${props => props.theme.bg3};
`
const FootnoteValue = styled.div`
  font-family: 'Nunito Sans', sans-serif;
  float: right;
  color: ${props => props.theme.white};
`

const StyledWrapper = styled.div`
  align-items: center;
  display: flex;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: stretch;
  }
`

const StyledBalances = styled.div`
  display: flex;
`

const StyledBalance = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
`

export default Balances
