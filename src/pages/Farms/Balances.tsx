import { useSoneContract } from 'hooks/useContract'
import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Contract } from '@ethersproject/contracts'
import { BigNumber } from 'ethers'
import { useTranslation } from 'react-i18next'
import { pxToRem } from '../../utils/PxToRem'
import { formatSONE } from '../../utils/formatNumber'

interface BalanceProps {
  circulatingSupplyValue: string
}

const Balances: FC<BalanceProps> = ({ circulatingSupplyValue }) => {
  const { t } = useTranslation()
  const [totalSupply, setTotalSupply] = useState<string>()

  const soneContract: Contract | null = useSoneContract()

  useEffect(() => {
    ;(async () => {
      if (soneContract) {
        const balanceDataRaw: BigNumber = await soneContract?.totalSupply()
        const balanceData = formatSONE(balanceDataRaw.toString(), true, false)
        setTotalSupply(balanceData)
      }
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
          {t('total_supply')} <span>&nbsp;{totalSupply} SONE</span>
        </StyledItem>
      </StyledWrapper>
    </>
  )
}

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  color: #767676;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: block;
    text-align: left;
  `}
`

const StyledItem = styled.div`
  margin-bottom: 0px;
  padding: 0 ${pxToRem(10)};
  font-size: ${pxToRem(20)};
  color: ${({ theme }) => theme.text4Sone};
  & > span {
    font-size: ${pxToRem(30)};
    font-weight: 700;
    color: ${({ theme }) => theme.text6Sone};
    ${({ theme }) => theme.mediaWidth.upToMedium`
      font-size: ${pxToRem(20)}
    `}
  }

  &:nth-child(1) {
    ${({ theme }) => theme.mediaWidth.upToMedium`
      margin-bottom: ${pxToRem(15)};
    `}
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: flex;
    align-items: baseline;
    justify-content: left;
    padding: 0;
    font-size: ${pxToRem(13)};
  `}
`

const StyledSticky = styled.div`
  border-left: ${pxToRem(3)} solid ${({ theme }) => theme.text10Sone};
  height: ${pxToRem(35)};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `}
`

export default Balances
