import React, { useState, useRef } from 'react'
import styled from 'styled-components'

import QuestionHelper from '../QuestionHelper'
import Row, { RowBetween, RowFixed } from '../Row'
import { SectionWrapper, SectionHeading, ResponsiveAutoColumn } from '../Settings'
import { ReactComponent as SlippageIcon } from '../../assets/svg/slippage_icon.svg'
import { ReactComponent as DeadlineIcon } from '../../assets/svg/deadline_icon.svg'
import { useTranslation } from 'react-i18next'

enum SlippageError {
  InvalidInput = 'InvalidInput',
  RiskyLow = 'RiskyLow',
  RiskyHigh = 'RiskyHigh'
}

enum DeadlineError {
  InvalidInput = 'InvalidInput'
}

const FancyButton = styled.button`
  color: ${({ theme }) => theme.black};
  align-items: center;
  width: 65px;
  height: 39px;
  border-radius: 10px;
  font-size: 1rem;
  min-width: 3.5rem;
  border: 1px solid ${({ theme }) => theme.bg3};
  outline: none;
  background-color: ${({ theme }) => theme.bg5Sone};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 56px;
    height: 35px;
  `};
`

const Option = styled(FancyButton)<{ active: boolean }>`
  margin-right: 26px;
  background-color: ${({ active, theme }) => active && theme.red1Sone};
  color: ${({ active, theme }) => active && theme.white};
  font-weight: ${({ active }) => (active ? '700' : '500')};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 11px;
  `};

  :hover {
    cursor: pointer;
  }
`

const Input = styled.input`
  background-color: transparent;
  font-size: 16px;
  font-weight: 500;
  outline: none;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  color: ${({ theme, color }) => (color === 'red' ? theme.red1 : theme.black)};
`

const OptionCustom = styled(FancyButton)<{ active?: boolean; warning?: boolean }>`
  height: 39px;
  position: relative;
  padding: 0 0.75rem;
  flex: 1;
  width: 129px;
  max-width: 129px;

  input {
    width: 100%;
    height: 100%;
    border: 0;
    border-radius: 2rem;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    height: 35px;
    width: 129px;
  `};
`

const MediumText = styled.span`
  font-weight: 500;
`

const StyledSlippageIcon = styled(SlippageIcon)`
  margin-right: 4px;

  path {
    fill: ${({ theme }) => theme.text1};
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 21px;
    height: 16px;
  `};
`

const StyledDeadlineIcon = styled(DeadlineIcon)`
  margin-right: 7px;

  path {
    fill: ${({ theme }) => theme.text1};
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 19px;
    height: 18px;
  `};
`

export interface SlippageTabsProps {
  rawSlippage: number
  setRawSlippage: (rawSlippage: number) => void
  deadline: number
  setDeadline: (deadline: number) => void
}

export default function SlippageTabs({ rawSlippage, setRawSlippage, deadline, setDeadline }: SlippageTabsProps) {
  const { t } = useTranslation()

  const inputRef = useRef<HTMLInputElement>()

  const [slippageInput, setSlippageInput] = useState('')
  const [deadlineInput, setDeadlineInput] = useState('')

  const slippageInputIsValid =
    slippageInput === '' || (rawSlippage / 100).toFixed(2) === Number.parseFloat(slippageInput).toFixed(2)
  const deadlineInputIsValid = deadlineInput === '' || (deadline / 60).toString() === deadlineInput

  let slippageError: SlippageError | undefined
  if (slippageInput !== '' && !slippageInputIsValid) {
    slippageError = SlippageError.InvalidInput
  } else if (slippageInputIsValid && rawSlippage < 50) {
    slippageError = SlippageError.RiskyLow
  } else if (slippageInputIsValid && rawSlippage > 500) {
    slippageError = SlippageError.RiskyHigh
  } else {
    slippageError = undefined
  }

  let deadlineError: DeadlineError | undefined
  if (deadlineInput !== '' && !deadlineInputIsValid) {
    deadlineError = DeadlineError.InvalidInput
  } else {
    deadlineError = undefined
  }

  function parseCustomSlippage(value: string) {
    setSlippageInput(value)

    try {
      const valueAsIntFromRoundedFloat = Number.parseInt((Number.parseFloat(value) * 100).toString())
      if (!Number.isNaN(valueAsIntFromRoundedFloat) && valueAsIntFromRoundedFloat < 5000) {
        setRawSlippage(valueAsIntFromRoundedFloat)
      }
    } catch {}
  }

  function parseCustomDeadline(value: string) {
    setDeadlineInput(value)

    try {
      const valueAsInt: number = Number.parseInt(value) * 60
      if (!Number.isNaN(valueAsInt) && valueAsInt > 0) {
        setDeadline(valueAsInt)
      }
    } catch {}
  }

  return (
    <SectionWrapper>
      <ResponsiveAutoColumn>
        <RowFixed>
          <StyledSlippageIcon />
          <SectionHeading>{t('slippage-tolerance')}</SectionHeading>
          <QuestionHelper text={t('question-helper-slippage-tolerance')} />
        </RowFixed>
        <Row>
          <Option
            onClick={() => {
              setSlippageInput('')
              setRawSlippage(10)
            }}
            active={rawSlippage === 10}
          >
            0.1%
          </Option>
          <Option
            onClick={() => {
              setSlippageInput('')
              setRawSlippage(50)
            }}
            active={rawSlippage === 50}
          >
            0.5%
          </Option>
          <Option
            onClick={() => {
              setSlippageInput('')
              setRawSlippage(100)
            }}
            active={rawSlippage === 100}
          >
            1%
          </Option>
          <OptionCustom active={![10, 50, 100].includes(rawSlippage)} warning={!slippageInputIsValid} tabIndex={-1}>
            <RowBetween>
              {/* https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451 */}
              <Input
                ref={inputRef as any}
                placeholder={(rawSlippage / 100).toFixed(2)}
                value={slippageInput}
                onBlur={() => {
                  parseCustomSlippage((rawSlippage / 100).toFixed(2))
                }}
                onChange={e => parseCustomSlippage(e.target.value)}
                color={!slippageInputIsValid ? 'red' : ''}
              />
              <MediumText>%</MediumText>
            </RowBetween>
          </OptionCustom>
        </Row>
        {!!slippageError && (
          <RowBetween
            style={{
              fontSize: '14px',
              paddingTop: '7px',
              color: slippageError === SlippageError.InvalidInput ? 'red' : '#F3841E'
            }}
          >
            {slippageError === SlippageError.InvalidInput
              ? t('enter-a-valid-slippage-percentage')
              : slippageError === SlippageError.RiskyLow
              ? t('your-transaction-may-fail')
              : t('your-transaction-may-be-frontrun')}
          </RowBetween>
        )}
      </ResponsiveAutoColumn>

      <ResponsiveAutoColumn>
        <RowFixed>
          <StyledDeadlineIcon />
          <SectionHeading>{t('transaction-deadline')}</SectionHeading>
          <QuestionHelper text={t('question-helper-transaction-deadline')} />
        </RowFixed>
        <RowFixed>
          <OptionCustom tabIndex={-1}>
            <RowBetween>
              <Input
                color={!!deadlineError ? 'red' : undefined}
                onBlur={() => {
                  parseCustomDeadline((deadline / 60).toString())
                }}
                placeholder={(deadline / 60).toString()}
                value={deadlineInput}
                onChange={e => parseCustomDeadline(e.target.value)}
              />
              <MediumText>{t('minutes')}</MediumText>
            </RowBetween>
          </OptionCustom>
        </RowFixed>
      </ResponsiveAutoColumn>
    </SectionWrapper>
  )
}
