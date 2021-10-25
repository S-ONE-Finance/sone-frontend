import { useSoneContract } from 'hooks/useContract'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Contract } from '@ethersproject/contracts'
import { BigNumber } from 'ethers'
import { useTranslation } from 'react-i18next'
import { pxToRem } from '../../utils/PxToRem'
import { formatSONE } from '../../utils/formatNumber'
import { DEFAULT_CHAIN_ID, SONE_MASTER_FARMER } from '../../constants/'
import { ChainId } from '@s-one-finance/sdk-core'
import { useActiveWeb3React } from '../../hooks'

const Balances = () => {
  const { t } = useTranslation()
  const [totalSupply, setTotalSupply] = useState<string>()
  const [circulatingSupply, setCirculatingSupply] = useState<string>()
  const { chainId, account } = useActiveWeb3React()

  const soneContract: Contract | null = useSoneContract()

  useEffect(() => {
    ;(async () => {
      if (soneContract) {
        const balanceDataRaw: BigNumber = await soneContract?.totalSupply()
        const balanceData = formatSONE(balanceDataRaw.toString(), true, false)
        setTotalSupply(balanceData)

        const masterFarmerAddress = SONE_MASTER_FARMER[account && chainId ? chainId : (DEFAULT_CHAIN_ID as ChainId)]
        const circulatingSupplyDataRaw: BigNumber = await soneContract?.circulatingSupply()
        const balanceLockInFarmer: BigNumber = await soneContract?.balanceOf(masterFarmerAddress)
        const circulatingSupplyData = formatSONE(
          circulatingSupplyDataRaw.sub(balanceLockInFarmer).toString(),
          true,
          false
        )
        setCirculatingSupply(circulatingSupplyData)
      }
    })()
  }, [account, chainId, soneContract])

  return (
    <>
      <StyledWrapper>
        <StyledItem>
          {t('sone_circulating_supply')} <span>&nbsp;{circulatingSupply} SONE</span>
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
