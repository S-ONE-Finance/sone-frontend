import { Currency, Pair } from '@s-one-finance/sdk-core'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import Row, { RowBetween } from '../Row'
import { Input as NumericalInput } from '../NumericalInput'
import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg'
import { useActiveWeb3React } from '../../hooks'

const InputRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: 17px 30px 0;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 15px 15px 0;
  `};
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

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    height: 23px;
    font-size: 13px;
    padding: 0 10px;
  `};
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

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 19px 15px 0 15px;
  `};
`

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const StyledDropDown = styled(DropDown)<{ selected: boolean }>`
  height: 35%;

  path {
    stroke: ${({ theme }) => theme.textBlack};
    stroke-width: 1.5px;
  }
`

const InputPanel = styled.div``

const Container = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  z-index: 1;
  height: 120px;
  width: 100%;
  border-radius: 32px;
  background-color: ${({ theme }) => theme.bgPanels};
  border: ${({ theme }) => `1px solid ${theme.border2Sone}`};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    height: 95px;
    border-radius: 25px;
  `};
`

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? 'margin: 0 0.5rem 0 0.5rem;' : 'margin: 0 0.5rem 0 0;')}
  font-size: 16px;
  font-weight: 500;

  ${({ theme, active }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;
    ${active ? 'margin: 0 0.25rem 0 0.25rem;' : 'margin: 0 0.25rem 0 0;'}
  `};
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
    height: 23px;
    width: 48px;
    font-size: 13px;
  `};
`

const RowBalance = styled(Row)`
  width: fit-content;
  cursor: pointer;
`

const TextLabel = styled.div`
  color: ${({ theme }) => theme.text8Sone};
  font-size: 16px;
  font-weight: 500;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;
  `};
`

const TextSmaller = styled(TextLabel)`
  line-height: normal;
  font-size: 13px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    line-height: unset;
  `};
`

interface PanelCurrencyInputProps {
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
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
  customBalanceText?: string
}

export default function PanelCurrencyInput({
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
  otherCurrency,
  id,
  showCommonBases,
  customBalanceText
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
            <TextLabel>{label}</TextLabel>
            {account && (
              <RowBalance onClick={onMax}>
                <TextLabel>
                  {!hideBalance && !!currency && selectedCurrencyBalance
                    ? (customBalanceText ?? '') + selectedCurrencyBalance?.toSignificant(6)
                    : ''}
                </TextLabel>
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
                // TODO: Chưa responsive ở đây.
                <DoubleCurrencyLogo currency0={pair?.token0} currency1={pair?.token1} size={22} margin={true} />
              ) : currency ? (
                <CurrencyLogo currency={currency} size={'22px'} sizeMobile={'15px'} />
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
