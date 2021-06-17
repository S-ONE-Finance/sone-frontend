import { Pair, WETH } from '@s-one-finance/sdk-core'
import { AutoColumn } from 'components/Column'
import PanelAddLiquidityOneTokenModeOutput from 'components/PanelAddLiquidityOneTokenModeOutput'
import PanelCurrencyInput, { SelectOrToggle } from 'components/PanelCurrencyInput'
import PanelSelectPair from 'components/PanelSelectPair'
import { AutoRow } from 'components/Row'
import { IconWrapper } from 'components/swap/styleds'
import { PairState, usePair } from 'data/Reserves'
import { useActiveWeb3React } from 'hooks'
import { useCurrency } from 'hooks/Tokens'
import useTheme from 'hooks/useTheme'
import useToggle from 'hooks/useToggle'
import { useIsUpToExtraSmall } from 'hooks/useWindowSize'
import React, { useEffect, useState } from 'react'
import { ArrowDown } from 'react-feather'
import { useHistory } from 'react-router-dom'
import { useDerivedMintSimpleInfo, useMintSimpleActionHandlers, useMintSimpleState } from 'state/mintSimple/hooks'
import { currencyId } from 'utils/currencyId'
import { unwrappedToken } from 'utils/wrappedCurrency'
import ButtonGroupping from './ButtonGrouping'

type ModeOneTokenProps = {
  currencyIdA: string | undefined
  currencyIdB: string | undefined
}

export default function ModeOneToken({ currencyIdA, currencyIdB }: ModeOneTokenProps) {
  const theme = useTheme()
  const isUpToExtraSmall = useIsUpToExtraSmall()

  const { chainId } = useActiveWeb3React()

  const history = useHistory()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // Clicked confirm.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [txHash, setTxHash] = useState<string>('')

  const { typedValue } = useMintSimpleState()
  const { onFieldInput } = useMintSimpleActionHandlers()

  useEffect(() => {
    if (currencyIdA === undefined || currencyIdB === undefined) {
      onFieldInput('')
    }
  }, [onFieldInput, currencyIdA, currencyIdB])

  // TODO: Chưa xử lý selectedPairState là NOT_EXISTS hoặc INVALID.

  // Đang chọn WETH mà switch sang one token mode thì đổi url thành eth.
  useEffect(() => {
    if (chainId) {
      if (currencyIdA === WETH[chainId].address) history.push(`/add/ETH/${currencyIdB}`)
      else if (currencyIdB === WETH[chainId].address) history.push(`/add/${currencyIdA}/ETH`)
    }
  }, [chainId, currencyIdA, currencyIdB, history])

  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)
  const pair = usePair(currencyA ?? undefined, currencyB ?? undefined)

  const [selectedPairState, selectedPair] = pair
  const isPairExistAndNotNull = selectedPairState === PairState.EXISTS && selectedPair !== null

  const [isSelectCurrencyA, onCurrencyToggle] = useToggle()
  const selectedCurrency = isSelectCurrencyA ? currencyA : currencyB

  // Chỉ select được ETH, ko cho select WETH
  const handlePairSelect = (pair: Pair) => {
    const { token0, token1 } = pair
    const currency0 = unwrappedToken(token0)
    const currency1 = unwrappedToken(token1)
    const currencyId0 = currencyId(currency0)
    const currencyId1 = currencyId(currency1)
    history.push(`/add/${currencyId0}/${currencyId1}`)
  }

  const { maxAmount, token0ParsedAmount, token1ParsedAmount } = useDerivedMintSimpleInfo(
    selectedPairState,
    selectedPair,
    selectedCurrency ?? undefined
  )

  console.log('token0ParsedAmount', token0ParsedAmount?.currency.symbol, token0ParsedAmount?.toExact())
  console.log('token1ParsedAmount', token1ParsedAmount?.currency.symbol, token1ParsedAmount?.toExact())

  return (
    <>
      <AutoColumn gap="20px">
        <PanelSelectPair selectedPair={selectedPair} onPairSelect={handlePairSelect} />
        {isPairExistAndNotNull && (
          <>
            <PanelCurrencyInput
              id="add-liquidity-simple-input-tokena"
              label="From"
              value={typedValue}
              onUserInput={onFieldInput}
              showMaxButton
              onMax={() => {
                onFieldInput(maxAmount?.toExact() ?? '')
              }}
              currency={selectedCurrency}
              isCurrencySelectOrToggle={SelectOrToggle.TOGGLE}
              onCurrencyToggle={onCurrencyToggle}
            />

            {token0ParsedAmount && token1ParsedAmount && (
              <>
                <AutoRow justify="center">
                  <IconWrapper clickable={false}>
                    <ArrowDown size={isUpToExtraSmall ? '14' : '22'} color={theme.text1Sone} />
                  </IconWrapper>
                </AutoRow>
                <PanelAddLiquidityOneTokenModeOutput
                  token0ParsedAmount={token0ParsedAmount}
                  token1ParsedAmount={token1ParsedAmount}
                />
              </>
            )}
          </>
        )}
      </AutoColumn>
      <ButtonGroupping
        selectedPairState={selectedPairState}
        selectedPair={selectedPair}
        selectedCurrency={selectedCurrency ?? undefined}
        setAttemptingTxn={setAttemptingTxn}
        setTxHash={setTxHash}
        setShowConfirm={setShowConfirm}
      />
    </>
  )
}
