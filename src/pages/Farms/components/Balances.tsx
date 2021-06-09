import React, { memo } from 'react'
import styled from 'styled-components'
import Value from '../../../components/Value'

const Balances = memo(() => {
  const fakeData = {
    circulatingSupply: 323233,
    totalSupply: 2131321
  }
  return (
    <StyledWrapper>
        <>
          <div>
            <div>
              <div>
                  <div>
                    <StyledCirculating>CRS Circulating Supply</StyledCirculating>
                    <Value value={fakeData.circulatingSupply} />
                    <StyledCirculating style={{ borderLeft: '1px solid black' }}>Total Supply</StyledCirculating>
                    <Value value={fakeData.totalSupply} />
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
