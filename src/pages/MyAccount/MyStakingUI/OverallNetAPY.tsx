import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

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

export default function OverallNetAPY() {
  const { t } = useTranslation()
  return (
    <StakingBackground>
      <AbsoluteCenter>
        <NetAPYField>{t('NET APY')}</NetAPYField>
        <NetAPYValue>88.88%</NetAPYValue>
      </AbsoluteCenter>
    </StakingBackground>
  )
}
