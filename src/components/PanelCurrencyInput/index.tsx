import { Currency, Pair } from '@s-one-finance/sdk-core'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import CurrencyLogo from '../CurrencyLogo'
import CurrencyLogoDouble from '../CurrencyLogoDouble'
import Row, { RowBetween } from '../Row'
import { Input as NumericalInput } from '../NumericalInput'
import { useActiveWeb3React } from '../../hooks'
import { TextPanelLabel, CurrencySelect, StyledTokenName, StyledDropDown } from 'theme'

export const InputRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: 17px 30px 0;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 15px 15px 0;
  `};
`

export const LabelRow = styled.div`
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

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 19px 15px 0 15px;
  `};
`

export const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const InputPanel = styled.div``

export const Container = styled.div<{ height?: string; height_mobile?: string }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  z-index: 1;
  height: ${({ height }) => height ?? '120px'};
  width: 100%;
  border-radius: 32px;
  background-color: ${({ theme }) => theme.bgPanels};
  border: ${({ theme }) => `1px solid ${theme.border2Sone}`};

  ${({ theme, height_mobile }) => theme.mediaWidth.upToExtraSmall`
    height: ${height_mobile ?? '95px'};
    border-radius: 25px;
  `};
`

export const StyledBalanceMax = styled.button`
  height: 41px;
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
    height: 23px;
    width: 48px;
    font-size: 13px;
  `};
`

const ButtonReceiveWETH = styled(StyledBalanceMax)`
  width: fit-content;
  padding: 0 15px;
  margin: 0;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin: 0;
    width: fit-content;
  `};
`

export const RowBalance = styled(Row)`
  width: fit-content;
  cursor: pointer;
`

export const TextSmaller = styled(TextPanelLabel)`
  line-height: normal;
  font-size: 13px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    line-height: unset;
  `};
`

export enum SelectOrToggle {
  SELECT = 'SELECT',
  TOGGLE = 'TOGGLE'
}

interface PanelCurrencyInputProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  showMaxButton: boolean
  label?: string
  isCurrencySelectOrToggle?: SelectOrToggle
  onCurrencySelect?: (currency: Currency) => void
  onCurrencyToggle?: () => void
  showCurrencySelect?: boolean
  currency?: Currency | null
  disableCurrencyChange?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
  customBalanceText?: string
  showReceiveWETH?: boolean
  onReceiveWETHToggle?: () => void
}

export default function PanelCurrencyInput({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  label = 'Input',
  isCurrencySelectOrToggle = SelectOrToggle.SELECT,
  onCurrencySelect,
  onCurrencyToggle,
  showCurrencySelect = true,
  currency,
  disableCurrencyChange = false,
  hideBalance = false,
  pair = null, // used for double token logo
  otherCurrency,
  id,
  showCommonBases,
  customBalanceText,
  showReceiveWETH = false,
  onReceiveWETHToggle
}: PanelCurrencyInputProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  return (
    <InputPanel id={id}>
      <Container>
        <LabelRow>
          <RowBetween align={'flex-end'}>
            <TextPanelLabel>{label}</TextPanelLabel>
            {account && (
              <RowBalance onClick={onMax}>
                <TextPanelLabel>
                  {/* BUG: https://gitlab.vnext.vn/bhswap/bhswap-front-end/sone-front-end/issues/16 */}
                  {!hideBalance && !!currency && selectedCurrencyBalance
                    ? (customBalanceText ?? '') + selectedCurrencyBalance?.toSignificant(6)
                    : ''}
                </TextPanelLabel>
                {!pair && currency && currency.symbol && <TextSmaller>&nbsp;{currency.symbol}</TextSmaller>}
              </RowBalance>
            )}
          </RowBetween>
        </LabelRow>
        <InputRow>
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
          {showCurrencySelect && (
            <CurrencySelect
              selected={!!currency}
              className="open-currency-select-button"
              onClick={() => {
                if (!disableCurrencyChange) {
                  if (isCurrencySelectOrToggle === SelectOrToggle.SELECT) {
                    setModalOpen(true)
                  } else if (isCurrencySelectOrToggle === SelectOrToggle.TOGGLE && onCurrencyToggle !== undefined) {
                    onCurrencyToggle()
                  }
                }
              }}
            >
              <Aligner>
                {pair ? (
                  <CurrencyLogoDouble currency0={pair?.token0} currency1={pair?.token1} size={22} margin={true} />
                ) : currency ? (
                  <CurrencyLogo currency={currency} size={'23px'} sizeMobile={'15px'} />
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
                      : currency?.symbol) || 'Select Token'}
                  </StyledTokenName>
                )}
                {!disableCurrencyChange && <StyledDropDown selected={!!currency} />}
              </Aligner>
            </CurrencySelect>
          )}
          {showReceiveWETH && (
            <ButtonReceiveWETH onClick={onReceiveWETHToggle}>
              {currency === Currency.ETHER ? 'Receive WETH' : 'Receive ETH'}
            </ButtonReceiveWETH>
          )}
        </InputRow>
      </Container>
      {!disableCurrencyChange && onCurrencySelect && (
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
