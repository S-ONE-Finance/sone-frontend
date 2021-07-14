import { useSoneContract } from 'hooks/useContract'
import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Contract } from '@ethersproject/contracts'
import { BigNumber } from 'ethers'
interface BalanceProps {
  circulatingSupplyValue: number
}

const Balances: FC<BalanceProps> = ({ circulatingSupplyValue }) => {
  const [totalSupply, setTotalSupply] = useState<BigNumber>()

  const soneContract: Contract | null = useSoneContract()
  useEffect(() => {
    ;(async () => {
      const balanceData: BigNumber = await soneContract?.totalSupply()
      const balance = balanceData.div(BigNumber.from(10).pow(18))
      setTotalSupply(balance)
    })()
  }, [])

  return (
    <StyledWrapper>
      <>
        <div>
          <div>
            <div>
              <div>
                <StyledCirculating>CRS Circulating Supply</StyledCirculating>
                <span>{circulatingSupplyValue}</span>
                <StyledCirculating style={{ borderLeft: '1px solid black' }}>Total Supply</StyledCirculating>
                <span>{totalSupply?.toString()}</span>
              </div>
            </div>
          </div>
        </div>
      </>
    </StyledWrapper>
  )
}

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
