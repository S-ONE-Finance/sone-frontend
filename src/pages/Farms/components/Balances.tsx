import React, { memo } from 'react'
import styled from 'styled-components'
import Value from '../../../components/Value'
import { getBalanceNumber } from '../../../sushi/format/formatBalance'
import useLuaTotalSupply from '../../../hooks/farms/useLuaTotalSupply'
import useLuaCirculatingSupply from '../../../hooks/farms/useLuaCirculatingSupply'

const Balances = memo(() => {
  const totalSupply = useLuaTotalSupply()
  const circulatingSupply = useLuaCirculatingSupply()
  return (
    <StyledWrapper>
        <>
          <div>
            <div>
              <div>
                  <div>
                    <StyledCirculating>CRS Circulating Supply</StyledCirculating>
                    <Value value={circulatingSupply ? getBalanceNumber(circulatingSupply) : '~'} />
                    
                    <StyledCirculating style={{ borderLeft: '1px solid black' }}>Total Supply</StyledCirculating>
                    <Value value={totalSupply ? `${parseFloat(getBalanceNumber(totalSupply).toFixed(2)).toLocaleString('en-US')} LUA` : '~'} />
                  </div>
              </div>
            </div>
          </div>
        </>
    </StyledWrapper>
  )
})


const StyledWrapper = styled.div`
  align-items: center;
  display: flex;
  text-align: center;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: stretch;
  }
`

const StyledCirculating = styled.span`
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
  color: #767676;
  margin-right: 10px;
`

export default Balances
