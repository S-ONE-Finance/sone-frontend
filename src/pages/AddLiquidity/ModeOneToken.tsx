import React, { useEffect, useState } from 'react'
import PanelSelectPair from 'components/PanelSelectPair'
import { useCurrency, useToken } from 'hooks/Tokens'
import { INIT_CODE_HASH, Currency, Pair, TokenAmount, WETH } from '@s-one-finance/sdk-core'
import { PairState, usePair } from 'data/Reserves'
import { useHistory } from 'react-router-dom'
import { unwrappedToken, wrappedCurrency } from 'utils/wrappedCurrency'
import { currencyId } from 'utils/currencyId'
import { useActiveWeb3React } from 'hooks'
import PanelCurrencyInput, { SelectOrToggle } from 'components/PanelCurrencyInput'
import { AutoColumn } from 'components/Column'
import { useDerivedMintSimpleInfo, useMintSimpleActionHandlers, useMintSimpleState } from 'state/mintSimple/hooks'
import useToggle from 'hooks/useToggle'
import PanelAddLiquidityOneTokenModeOutput from 'components/PanelAddLiquidityOneTokenModeOutput'
import { useIsUpToExtraSmall } from 'hooks/useWindowSize'
import useTheme from 'hooks/useTheme'
import { ArrowDown } from 'react-feather'
import { AutoRow } from 'components/Row'
import { IconWrapper } from 'components/swap/styleds'
import { tryParseAmount } from 'state/swap/hooks'

type ModeOneTokenProps = {
  currencyIdA: string | undefined
  currencyIdB: string | undefined
}

export default function ModeOneToken({ currencyIdA, currencyIdB }: ModeOneTokenProps) {
  const theme = useTheme()
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const { chainId } = useActiveWeb3React()
  const history = useHistory()

  // TODO: Chưa xử lý selectedPairState là NOT_EXISTS hoặc INVALID.
  // useEffect(() => {
  //   if (selectedPairState === PairState.NOT_EXISTS) {
  //     throw new Error('Pair not exist')
  //   } else if (selectedPairState === PairState.INVALID) {
  //     throw new Error('Pair invalid')
  //   }
  // }, [selectedPairState])

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

  const { typedValue } = useMintSimpleState()

  const { onFieldInput } = useMintSimpleActionHandlers()

  const { maxAmount, token0MintAmount, token1MintAmount } = useDerivedMintSimpleInfo(
    selectedPairState,
    selectedPair,
    selectedCurrency
  )

  console.log('token0MintAmount', token0MintAmount?.currency.symbol, token0MintAmount?.toExact())
  console.log('token1MintAmount', token1MintAmount?.currency.symbol, token1MintAmount?.toExact())

  return (
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

          {token0MintAmount && token1MintAmount && (
            <>
              <AutoRow justify="center">
                <IconWrapper clickable={false}>
                  <ArrowDown size={isUpToExtraSmall ? '14' : '22'} color={theme.text1Sone} />
                </IconWrapper>
              </AutoRow>
              <PanelAddLiquidityOneTokenModeOutput
                token0MintAmount={token0MintAmount}
                token1MintAmount={token1MintAmount}
              />
            </>
          )}
        </>
      )}
    </AutoColumn>
  )
}
