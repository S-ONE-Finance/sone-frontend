import { useSoneContract } from 'hooks/useContract'
import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Contract } from '@ethersproject/contracts'
import { BigNumber } from 'ethers'
import { useTranslation } from 'react-i18next'
interface BalanceProps {
  circulatingSupplyValue: number
}

const Balances: FC<BalanceProps> = ({ circulatingSupplyValue }) => {
  const { t } = useTranslation()
  const [totalSupply, setTotalSupply] = useState<BigNumber>()

  const soneContract: Contract | null = useSoneContract()

  useEffect(() => {
    ;(async () => {
      const balanceData: BigNumber = await soneContract?.totalSupply()
      const balance = balanceData?.div(BigNumber.from(10).pow(18))
      setTotalSupply(balance)
    })()
  }, [soneContract])

  return (
    <>
      <StyledWrapper>
        <StyledItem>
          {t('sone_circulating_supply')} <span>&nbsp;{circulatingSupplyValue} SONE</span>
        </StyledItem>
        <StyledSticky />
        <StyledItem>
          {t('total_supply')} <span>&nbsp;{totalSupply?.toString()} SONE</span>
        </StyledItem>
      </StyledWrapper>
    </>
  )
}

const StyledItem = styled.div`
  display: flex;
  align-items: baseline;
  margin-bottom: 15px;
  color: ${({ theme }) => theme.text4Sone};
  & > span {
    font-size: 20px;
    font-weight: 700;
    color: ${({ theme }) => theme.text6Sone};
  }
  @media (min-width: 1200px) {
    padding: 0 10px;
    & > span {
      font-size: 30px;
    }
  }
`
const StyledWrapper = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: #767676;
  ${StyledItem}:nth-child (1) {
    margin-bottom: 15px;
  }
  @media (min-width: 1200px) {
    display: flex;
    justify-content: center;
    font-size: 20px;
  }
`

const StyledSticky = styled.div`
  border-left: 3px solid ${({ theme }) => theme.text10Sone};
  height: 35px;
  display: none;
  @media (min-width: 1200px) {
    display: inline-block;
  }
`

export default Balances
