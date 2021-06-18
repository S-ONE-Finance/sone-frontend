import { Pair, WETH } from '@s-one-finance/sdk-core'
import { AutoColumn } from 'components/Column'
import PanelAddLiquidityOneTokenModeOutput from 'components/PanelAddLiquidityOneTokenModeOutput'
import PanelCurrencyInput, { SelectOrToggle } from 'components/PanelCurrencyInput'
import PanelSelectPair from 'components/PanelSelectPair'
import { AutoRow } from 'components/Row'
import { IconWrapper } from 'components/swap/styleds'
import TransactionConfirmationModal, { ConfirmationModalContent } from 'components/TransactionConfirmationModal'
import { PairState, usePair } from 'data/Reserves'
import { useActiveWeb3React } from 'hooks'
import { useCurrency } from 'hooks/Tokens'
import useAddLiquidityOneTokenHandler from 'hooks/useAddLiquidityOneTokenHandler'
import useTheme from 'hooks/useTheme'
import useToggle from 'hooks/useToggle'
import { useIsUpToExtraSmall } from 'hooks/useWindowSize'
import React, { useCallback, useEffect, useState } from 'react'
import { ArrowDown } from 'react-feather'
import { useHistory } from 'react-router-dom'
import { useDerivedMintSimpleInfo, useMintSimpleActionHandlers, useMintSimpleState } from 'state/mintSimple/hooks'
import { TransactionType } from 'state/transactions/types'
import { currencyId } from 'utils/currencyId'
import { unwrappedToken } from 'utils/wrappedCurrency'
import ButtonGrouping from './ButtonGrouping'
import ModalFooter from './ModalFooter'
import ModalHeader from './ModalHeader'
import TransactionDetails from './TransactionDetails'

type ModeOneTokenProps = {
  currencyIdA: string | undefined
  currencyIdB: string | undefined
}

export default function ModeOneToken({ currencyIdA, currencyIdB }: ModeOneTokenProps) {
  const theme = useTheme()
  const isUpToExtraSmall = useIsUpToExtraSmall()

  const { chainId } = useActiveWeb3React()

  const history = useHistory()

  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // Clicked confirm.
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

  const {
    maxAmount,
    token0ParsedAmount,
    token1ParsedAmount,
    noLiquidity,
    price,
    poolTokenPercentage
  } = useDerivedMintSimpleInfo(selectedPairState, selectedPair, selectedCurrency ?? undefined)

  const pendingText = `Supplying ${token0ParsedAmount?.toSignificant(6)} ${
    selectedPair?.token0?.symbol
  } and ${token1ParsedAmount?.toSignificant(6)} ${selectedPair?.token0?.symbol}`

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldInput('')
    }
    setTxHash('')
  }, [onFieldInput, txHash])

  const onAdd = useAddLiquidityOneTokenHandler({
    selectedPairState,
    selectedPair,
    selectedCurrency: selectedCurrency ?? undefined,
    setAttemptingTxn,
    setTxHash
  })

  return (
    <>
      <TransactionConfirmationModal
        isOpen={showConfirm}
        onDismiss={handleDismissConfirmation}
        attemptingTxn={attemptingTxn}
        hash={txHash}
        content={() => (
          <ConfirmationModalContent
            title="Confirm Add Liquidity"
            onDismiss={handleDismissConfirmation}
            topContent={() =>
              ModalHeader({
                token0ParsedAmount,
                token1ParsedAmount,
                token0: selectedPair?.token0,
                token1: selectedPair?.token1
              })
            }
            bottomContent={() => (
              <ModalFooter
                price={price}
                token0={selectedPair?.token0}
                token1={selectedPair?.token1}
                noLiquidity={noLiquidity}
                token0ParsedAmount={token0ParsedAmount}
                token1ParsedAmount={token1ParsedAmount}
                onAdd={onAdd}
                poolTokenPercentage={poolTokenPercentage}
              />
            )}
            transactionType={TransactionType.ADD}
          />
        )}
        pendingText={pendingText}
        currencyToAdd={selectedPair?.liquidityToken}
      />
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
      <ButtonGrouping
        selectedPairState={selectedPairState}
        selectedPair={selectedPair}
        selectedCurrency={selectedCurrency ?? undefined}
        setAttemptingTxn={setAttemptingTxn}
        setTxHash={setTxHash}
        setShowConfirm={setShowConfirm}
      />
      <TransactionDetails
        selectedPairState={selectedPairState}
        selectedPair={selectedPair}
        selectedCurrency={selectedCurrency ?? undefined}
      />
    </>
  )
}
