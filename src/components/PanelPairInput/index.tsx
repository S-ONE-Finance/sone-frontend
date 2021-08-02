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
import { getNumberCommas } from '../../subgraph/utils/formatter'
import styled from 'styled-components'
import LiquidityProviderTokenLogo from '../LiquidityProviderTokenLogo'

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

interface PanelPairInputProps {
  value: string
  onUserInput: (value: string) => void
  balance?: number
  onMax: () => void
  label: string
  customBalanceText: string
  address0?: string
  address1?: string
}

export default function PanelPairInput({
  value,
  onUserInput,
  balance,
  onMax,
  label,
  customBalanceText,
  address0,
  address1
}: PanelPairInputProps) {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()

  return (
    <Container>
      <PanelPairLabelRow>
        <RowBetween align="center">
          <TextPanelLabel>{label}</TextPanelLabel>
          {account && (
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
              <TextPanelLabelAccent>{balance !== undefined ? getNumberCommas(balance) : '--'}</TextPanelLabelAccent>
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
        />
        {account && <StyledBalanceMax onClick={onMax}>{t('max')}</StyledBalanceMax>}
      </PanelPairInputRow>
    </Container>
  )
}
