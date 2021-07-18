/**
 * Extends from 'PanelCurrencyInput'.
 */

import { Token } from '@s-one-finance/sdk-core'
import React from 'react'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { RowBetween } from '../Row'
import { Input as NumericalInput } from '../NumericalInput'
import { useActiveWeb3React } from '../../hooks'
import { TextPanelLabel } from 'theme'
import { Container, InputPanel, InputRow, LabelRow, RowBalance, TextSmaller } from '../PanelCurrencyInput'
import styled from 'styled-components'
import { darken } from 'polished'
import { Field } from '../../state/burn/actions'

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
  label?: string
  lpToken?: Token
  hideBalance?: boolean
  id: string
  customBalanceText?: string
  selectedPercentage: '25' | '50' | '75' | '100' | undefined
}

export default function PanelLpTokenInput({
  value,
  onUserInput,
  label = 'Input',
  lpToken,
  hideBalance = false,
  id,
  customBalanceText,
  selectedPercentage
}: PanelLpTokenInputProps) {
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, lpToken ?? undefined)

  return (
    <InputPanel id={id}>
      <Container height="175px" height_mobile="132px">
        <LabelRow>
          <RowBetween align={'flex-end'}>
            <TextPanelLabel>{label}</TextPanelLabel>
            {account && (
              // TODO: onClick
              <RowBalance onClick={() => {}}>
                <TextPanelLabel>
                  {!hideBalance && !!lpToken && selectedCurrencyBalance
                    ? (customBalanceText ?? '') + selectedCurrencyBalance?.toSignificant(6)
                    : ''}
                </TextPanelLabel>
                {lpToken && lpToken.symbol && <TextSmaller>&nbsp;{lpToken.symbol}</TextSmaller>}
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
            MAX
          </ButtonPercentage>
        </RowPercentage>
      </Container>
    </InputPanel>
  )
}
