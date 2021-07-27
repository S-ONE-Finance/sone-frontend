/**
 * This panel serves for staking and unstake pages.
 */

import React from 'react'
import { useTranslation } from 'react-i18next'
import { RowBetween } from '../Row'
import { Input as NumericalInput } from '../NumericalInput'
import { useActiveWeb3React } from '../../hooks'
import { TextPanelLabel, TextPanelLabelAccent } from 'theme'
import { Container, InputPanel, InputRow, LabelRow, RowBalance, StyledBalanceMax } from '../PanelCurrencyInput'
import { numberWithCommas } from '../../subgraph/utils/formatter'
import CurrencyLogo from '../CurrencyLogo'

interface PanelPairInputProps {
  value: string
  onUserInput: (value: string) => void
  balance?: number
  onMax: () => void
  label: string
  customBalanceText: string
}

export default function PanelPairInput({
  value,
  onUserInput,
  balance,
  onMax,
  label,
  customBalanceText
}: PanelPairInputProps) {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()

  return (
    <InputPanel>
      <Container>
        <LabelRow>
          <RowBetween align={'flex-end'}>
            <TextPanelLabel>{label}</TextPanelLabel>
            {account && (
              <RowBalance onClick={onMax} gap="0.25rem">
                <CurrencyLogo address="SONE" size="22px" style={{ marginRight: '0.35rem' }} />
                <TextPanelLabel>{customBalanceText}</TextPanelLabel>
                <TextPanelLabelAccent>{balance !== undefined ? numberWithCommas(balance) : '--'}</TextPanelLabelAccent>
              </RowBalance>
            )}
          </RowBetween>
        </LabelRow>
        <InputRow>
          <NumericalInput
            className="token-amount-input"
            value={value}
            onUserInput={val => {
              onUserInput(val)
            }}
          />
          {account && <StyledBalanceMax onClick={onMax}>{t('max')}</StyledBalanceMax>}
        </InputRow>
      </Container>
    </InputPanel>
  )
}
