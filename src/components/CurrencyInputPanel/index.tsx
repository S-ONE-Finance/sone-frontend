import { Currency, Pair } from '@s-one-finance/sdk-core'
import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import Row, { RowBetween } from '../Row'
import { TYPE } from '../../theme'
import { Input as NumericalInput } from '../NumericalInput'
import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg'

import { useActiveWeb3React } from '../../hooks'
import { useTranslation } from 'react-i18next'
import useTheme from '../../hooks/useTheme'

const InputRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: 17px 30px 22px 30px;
`

const CurrencySelect = styled.button<{ selected: boolean }>`
  align-items: center;
  height: 40px;
  font-size: 20px;
  font-weight: 500;
  background-color: ${({ theme }) => theme.white};
  color: ${({ theme }) => theme.textBlack};
  border-radius: 51px;
  box-shadow: ${({ selected }) => (selected ? 'none' : '0px 6px 10px rgba(0, 0, 0, 0.075)')};
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 0 12px;

  :hover {
    background-color: ${({ theme }) => darken(0.2, theme.white)};
  }
`

const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.text1};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 21px 30px 0 30px;

  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.text2)};
  }
`

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const StyledDropDown = styled(DropDown)<{ selected: boolean }>`
  margin: 0 0.25rem 0 0.5rem;
  height: 35%;

  path {
    stroke: ${({ theme }) => theme.textBlack};
    stroke-width: 1.5px;
  }
`

const InputPanel = styled.div``

const Container = styled.div<{ hideInput: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  z-index: 1;
  height: 120px;
  width: 100%;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '32px')};
  background-color: ${({ theme }) => theme.bgInputPanel};
  border: ${({ theme }) => `1px solid ${theme.border2Sone}`};
`

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? 'margin: 0 0.25rem 0 0.5rem;' : 'margin: 0 0.25rem 0 0.25rem;')}
  font-size: 16px;
  font-weight: 500;
`

const StyledBalanceMax = styled.button`
  height: 40px;
  width: 105px;
  background-color: ${({ theme }) => theme.white};
  border-radius: 51px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-right: 10px;
  color: ${({ theme }) => theme.textBlack};
  border: 0 none;

  :hover {
    background-color: ${({ theme }) => darken(0.2, theme.white)};
  }

  :focus {
    outline: none;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 0.5rem;
  `};
`

const RowBalance = styled(Row)`
  width: fit-content;
  cursor: pointer;
`

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  showMaxButton: boolean
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
  customBalanceText?: string
}

export default function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  label = 'Input',
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  otherCurrency,
  id,
  showCommonBases,
  customBalanceText
}: CurrencyInputPanelProps) {
  const { t } = useTranslation()

  const [modalOpen, setModalOpen] = useState(false)
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const theme = useTheme()

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  return (
    <InputPanel id={id}>
      <Container hideInput={hideInput}>
        {!hideInput && (
          <LabelRow>
            <RowBetween align={'flex-end'}>
              <TYPE.body color={theme.text8Sone} fontWeight={500} fontSize={16}>
                {label}
              </TYPE.body>
              {account && (
                <RowBalance onClick={onMax}>
                  <TYPE.body color={theme.text8Sone} fontWeight={500} fontSize={16}>
                    {!hideBalance && !!currency && selectedCurrencyBalance
                      ? (customBalanceText ?? '') + selectedCurrencyBalance?.toSignificant(6)
                      : ''}
                  </TYPE.body>
                  {!pair && currency && currency.symbol && (
                    <TYPE.body color={theme.text8Sone} fontWeight={500} fontSize={13} lineHeight={'normal'}>
                      &nbsp;{currency.symbol}
                    </TYPE.body>
                  )}
                </RowBalance>
              )}
            </RowBetween>
          </LabelRow>
        )}
        <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}}>
          {!hideInput && (
            <>
              <NumericalInput
                className="token-amount-input"
                value={value}
                onUserInput={val => {
                  onUserInput(val)
                }}
              />
              {account && currency && showMaxButton && label !== 'To' && (
                <StyledBalanceMax onClick={onMax}>MAX</StyledBalanceMax>
              )}
            </>
          )}
          <CurrencySelect
            selected={!!currency}
            className="open-currency-select-button"
            onClick={() => {
              if (!disableCurrencySelect) {
                setModalOpen(true)
              }
            }}
          >
            <Aligner>
              {pair ? (
                <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={22} margin={true} />
              ) : currency ? (
                <CurrencyLogo currency={currency} size={'22px'} />
              ) : null}
              {pair ? (
                <StyledTokenName className="pair-name-container">
                  {pair?.token0.symbol}:{pair?.token1.symbol}
                </StyledTokenName>
              ) : (
                <StyledTokenName className="token-symbol-container" active={Boolean(currency && currency.symbol)}>
                  {(currency && currency.symbol && currency.symbol.length > 20
                    ? currency.symbol.slice(0, 4) +
                      '...' +
                      currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                    : currency?.symbol) || t('select-token')}
                </StyledTokenName>
              )}
              {!disableCurrencySelect && <StyledDropDown selected={!!currency} />}
            </Aligner>
          </CurrencySelect>
        </InputRow>
      </Container>
      {!disableCurrencySelect && onCurrencySelect && (
        <CurrencySearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
          showCommonBases={showCommonBases}
        />
      )}
    </InputPanel>
  )
}
