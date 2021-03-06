/**
 * Extends from 'PanelCurrencyInput'.
 */

import { Token } from '@s-one-finance/sdk-core'
import React from 'react'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { RowBetween } from '../Row'
import { Input as NumericalInput } from '../NumericalInput'
import { useActiveWeb3React } from 'hooks'
import { TextPanelLabel } from 'theme'
import { Container, InputRow, LabelRow, RowBalance, TextSmaller } from '../PanelCurrencyInput'
import styled from 'styled-components'
import { darken } from 'polished'
import { Field } from 'state/burn/actions'
import { formatTwoDigits } from 'utils/formatNumber'
import { useTranslation } from 'react-i18next'

const ButtonPercentage = styled.button<{ width?: string; active: boolean }>`
  height: 41px;
  width: ${({ width }) => width ?? '72px'};
  background-color: ${({ theme, active }) => (active ? theme.red1Sone : theme.border3Sone)};
  border-radius: 51px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  color: ${({ theme, active }) => (active ? theme.white : theme.textBlack)};
  border: 0 none;

  :hover {
    background-color: ${({ theme, active }) => !active && darken(0.2, theme.white)};
  }

  :focus {
    outline: none;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 0.5rem;
    height: 23px;
    width: 48px;
    font-size: 13px;
  `};
`

const RowPercentage = styled(RowBetween)`
  padding: 17px 30px 0;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 15px 15px 0;
  `};
`

interface PanelLpTokenInputProps {
  value: string
  onUserInput: (field: Field, typedValue: string) => void
  label: string
  lpToken?: Token
  LPTokenName: string
  hideBalance?: boolean
  id: string
  customBalanceText?: string
  selectedPercentage: '25' | '50' | '75' | '100' | undefined
}

export default function PanelCurrencyInputAndSelectPercentage({
  value,
  onUserInput,
  label,
  lpToken,
  LPTokenName,
  hideBalance = false,
  id,
  customBalanceText,
  selectedPercentage
}: PanelLpTokenInputProps) {
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, lpToken ?? undefined)
  const { t } = useTranslation()

  return (
    <Container id={id} height="175px" height_mobile="132px">
      <LabelRow>
        <RowBetween align="center">
          <TextPanelLabel>{label}</TextPanelLabel>
          {account && (
            <RowBalance onClick={() => {}}>
              <TextPanelLabel>
                {!hideBalance && !!lpToken && selectedCurrencyBalance
                  ? (customBalanceText ?? '') + formatTwoDigits(selectedCurrencyBalance)
                  : ''}
              </TextPanelLabel>
              {lpToken && <TextSmaller>&nbsp;{LPTokenName}</TextSmaller>}
            </RowBalance>
          )}
        </RowBetween>
      </LabelRow>
      <InputRow>
        <NumericalInput
          className="token-amount-input"
          value={value}
          onUserInput={val => {
            onUserInput(Field.LIQUIDITY, val)
          }}
        />
      </InputRow>
      <RowPercentage>
        <ButtonPercentage
          active={selectedPercentage === '25'}
          onClick={() => {
            onUserInput(Field.LIQUIDITY_PERCENT, '25')
          }}
        >
          25%
        </ButtonPercentage>
        <ButtonPercentage
          active={selectedPercentage === '50'}
          onClick={() => {
            onUserInput(Field.LIQUIDITY_PERCENT, '50')
          }}
        >
          50%
        </ButtonPercentage>
        <ButtonPercentage
          active={selectedPercentage === '75'}
          onClick={() => {
            onUserInput(Field.LIQUIDITY_PERCENT, '75')
          }}
        >
          75%
        </ButtonPercentage>
        <ButtonPercentage
          active={selectedPercentage === '100'}
          width="105px"
          onClick={() => {
            onUserInput(Field.LIQUIDITY_PERCENT, '100')
          }}
        >
          {t('max')}
        </ButtonPercentage>
      </RowPercentage>
    </Container>
  )
}
