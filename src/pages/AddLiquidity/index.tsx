import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components'
import AppBodyTitleDescriptionSettings from '../../components/AppBodyTitleDescriptionSettings'
import { TransactionType } from '../../state/transactions/types'
import { AddLiquidityModeEnum } from '../../state/user/actions'
import { useAddLiquidityModeManager } from '../../state/user/hooks'
import { AppBody, StyledPadding } from 'theme/components'
import ModeOneToken from './ModeOneTokens'
import ModeToggle from './ModeToggle'
import ModeTwoTokens from './ModeTwoTokens'
import TabSwapLiquidity from '../../components/TabSwapLiquidity'
import WeeklyRanking from '../../components/WeeklyRanking'
import BrandIdentitySoneForMobile from '../../components/BrandIdentitySoneForMobile'
import { OpenGuide } from '../../components/lib/mark/components'
import { useGuideStepManager } from '../../state/user/hooks'
import { TowStep1 } from '../../components/lib/mark/components'

export const ButtonWrapper = styled.div<{ hasTrade?: boolean }>`
  margin: ${({ hasTrade }) => (hasTrade ? '17.5px 0' : '2.1875rem 0 0 0')};

  ${({ theme, hasTrade }) => theme.mediaWidth.upToExtraSmall`
    margin: ${hasTrade ? '17.5px 0' : '20px 0 0 0'};
  `}
`

export default function AddLiquidity({
  match: {
    params: { currencyIdA, currencyIdB }
  }
}: RouteComponentProps<{ currencyIdA?: string; currencyIdB?: string }>) {
  const [addLiquidityMode] = useAddLiquidityModeManager()
  const [guideStep] = useGuideStepManager()

  if (
    guideStep.screen === 'liquidity' &&
    Number(guideStep.step) > 4 &&
    addLiquidityMode === AddLiquidityModeEnum.OneToken
  ) {
    currencyIdA = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
    currencyIdB = 'ETH'
  }

  if (
    guideStep.screen === 'liquidity' &&
    Number(guideStep.step) > 2 &&
    addLiquidityMode === AddLiquidityModeEnum.TwoToken
  ) {
    currencyIdA = 'ETH'
    currencyIdB = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
  }

  return (
    <>
      <BrandIdentitySoneForMobile />
      <TabSwapLiquidity />
      <TowStep1>
        <AppBody>
          {/* transactionType chỗ này chỉ để lấy ra vector, để ADD_ONE_TOKEN hay ADD_TWO_TOKENS đều giống nhau. */}
          <AppBodyTitleDescriptionSettings transactionType={TransactionType.ADD_ONE_TOKEN} />
          <ModeToggle />
          <StyledPadding>
            {addLiquidityMode === AddLiquidityModeEnum.OneToken ? (
              <ModeOneToken currencyIdA={currencyIdA} currencyIdB={currencyIdB} />
            ) : (
              <ModeTwoTokens currencyIdA={currencyIdA} currencyIdB={currencyIdB} />
            )}
          </StyledPadding>
        </AppBody>
      </TowStep1>

      <WeeklyRanking />
      <OpenGuide screen="liquidity" />
    </>
  )
}
