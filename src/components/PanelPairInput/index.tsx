/**
 * This panel serves for staking and unstake pages.
 */

import React from 'react'
import { useTranslation } from 'react-i18next'
import { RowBetween } from '../Row'
import { Input as NumericalInput } from '../NumericalInput'
import { useActiveWeb3React } from '../../hooks'
import { TextPanelLabel, TextPanelLabelAccent } from 'theme'
import { Container, InputRow, LabelRow, RowBalance, StyledBalanceMax } from '../PanelCurrencyInput'
import styled from 'styled-components'
import LiquidityProviderTokenLogo from '../LiquidityProviderTokenLogo'
import { useGuideStepManager } from '../../state/user/hooks'
import useTheme from 'hooks/useTheme'

const PanelPairLabelRow = styled(LabelRow)`
  padding: 18px 30px 0 30px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 19px 15px 0 15px;
  `};
`

export const PanelPairInputRow = styled(InputRow)`
  padding: 14px 30px 0;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 15px 15px 0;
  `};

  > * + * + * {
    margin-left: 0.625rem;
  }
`

const BackgroundColor = styled.div`
  height: 120px;
  width: 100%;
  border-radius: 32px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    height: 95px;
    border-radius: 25px;
  `};
`

interface PanelPairInputProps {
  value: string
  onUserInput: (value: string) => void
  balance?: string
  onMax: () => void
  label: string
  customBalanceText: string
  address0?: string
  address1?: string
  decimal?: number
}

export default function PanelPairInput({
  value,
  onUserInput,
  balance,
  onMax,
  label,
  customBalanceText,
  address0,
  address1,
  decimal
}: PanelPairInputProps) {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const [guideStep] = useGuideStepManager()
  const theme = useTheme()

  const balanceDisplay = Number(guideStep.step) > 1 ? '123,456.789' : balance !== undefined ? balance : '--'

  return (
    <Container>
      <BackgroundColor style={{ backgroundColor: Number(guideStep.step) === 2 ? theme.bg2Sone : 'transparent' }}>
        <PanelPairLabelRow>
          <RowBetween align="center">
            <TextPanelLabel>{label}</TextPanelLabel>
            {(account || Number(guideStep.step) > 1) && (
              <RowBalance onClick={onMax} gap="0.25rem">
                <LiquidityProviderTokenLogo
                  address0={address0}
                  address1={address1}
                  size={22}
                  sizeMobile={14}
                  main={false}
                  style={{ marginRight: '0.25rem' }}
                />
                <TextPanelLabel>{customBalanceText}</TextPanelLabel>
                <TextPanelLabelAccent>{balanceDisplay}</TextPanelLabelAccent>
              </RowBalance>
            )}
          </RowBetween>
        </PanelPairLabelRow>
        <PanelPairInputRow>
          <NumericalInput
            className="token-amount-input"
            value={value}
            onUserInput={val => {
              onUserInput(val)
            }}
            decimal={decimal}
          />
          {(account || Number(guideStep.step) > 1) && <StyledBalanceMax onClick={onMax}>{t('max')}</StyledBalanceMax>}
        </PanelPairInputRow>
      </BackgroundColor>
    </Container>
  )
}
