import React, { memo, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import useMyAccountStaked from '../../../hooks/masterfarmer/useMyAccountStaked'
import { UserInfoSone } from '@s-one-finance/sdk-core'

const StakingBackground = styled.div`
  width: 100%;
  min-height: 317px;
  overflow-x: hidden;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url(${({ theme }) => theme.bgMyStaking});
  background-size: cover;
  position: relative;
  border-bottom: 1px solid ${({ theme }) => theme.text6Sone};
  border-radius: 15px 15px 0 0;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    min-height: 257px;
    background-image: url(${({ theme }) => theme.bgMyStakingUpToExtraSmall});
  `}
`

const AbsoluteCenter = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const NetAPYField = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.text13Sone};
`

const NetAPYValue = styled.div`
  font-size: 40px;
  font-weight: 700;
  color: ${({ theme }) => theme.text5Sone};
  margin-top: 0.25em;
`

const OverallNetAPY = memo(function OverallNetAPY() {
  const { t } = useTranslation()
  const [, myAccountStaked] = useMyAccountStaked()
  const [netApy, setNetApy] = useState(0)

  useEffect(() => {
    let totalSoneHarvestUSD = 0
    let totalLPStakeUSD = 0
    myAccountStaked.forEach((user: UserInfoSone) => {
      totalSoneHarvestUSD += Number(user.soneHarvestedUSD)
      totalLPStakeUSD += (Number(user.amount) / 1e18) * Number(user.pool?.LPTokenPrice)
    })
    if (totalLPStakeUSD) {
      setNetApy(totalSoneHarvestUSD / totalLPStakeUSD)
    }
  }, [myAccountStaked])

  const netApyRender = useMemo(() => (netApy < 10 ? netApy.toFixed(3) : netApy.toFixed(2)) + '%', [netApy])

  return (
    <StakingBackground>
      <AbsoluteCenter>
        <NetAPYField>{t('net_apy')}</NetAPYField>
        <NetAPYValue>{netApyRender}</NetAPYValue>
      </AbsoluteCenter>
    </StakingBackground>
  )
})

export default OverallNetAPY
