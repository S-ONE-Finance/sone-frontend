import { Pair, WETH } from '@s-one-finance/sdk-core'
import { useTranslation } from 'react-i18next'
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
import useToggle from 'hooks/useToggle'
import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDerivedMintSimpleInfo, useMintSimpleActionHandlers, useMintSimpleState } from 'state/mintSimple/hooks'
import { TransactionType } from 'state/transactions/types'
import { currencyId } from 'utils/currencyId'
import { unwrappedToken } from 'utils/wrappedCurrency'
import ButtonGrouping from './ButtonGrouping'
import ModalFooter from './ModalFooter'
import ModalHeader from './ModalHeader'
import TransactionDetails from './TransactionDetails'
import { useGetPairFromSubgraphAndParse } from '../../../graphql/hooks'
import { StyledArrowDown } from '../../../theme'
import { useGuideStepManager } from '../../../state/user/hooks'
import { OneStep4 } from '../../../components/lib/mark/components'

type ModeOneTokenProps = {
  currencyIdA: string | undefined
  currencyIdB: string | undefined
}

export default function ModeOneToken({ currencyIdA, currencyIdB }: ModeOneTokenProps) {
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()
  const [guideStep] = useGuideStepManager()

  const history = useHistory()

  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // Clicked confirm.
  const [txHash, setTxHash] = useState<string>('')

  const { typedValue } = useMintSimpleState()
  const { onFieldInput } = useMintSimpleActionHandlers()

  useEffect(() => {
    onFieldInput('')
  }, [onFieldInput, currencyIdA, currencyIdB])

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
  const theOtherCurrency = isSelectCurrencyA ? currencyB : currencyA

  // Parse WETH sang ETH, khi select pair sẽ là chọn đồng ETH.
  // Đồng nghĩa với việc không có use-case add liquidity one token mode với token WETH.
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
    selectedTokenParsedAmount,
    theOtherTokenParsedAmount,
    noLiquidity,
    price,
    poolTokenPercentage
  } = useDerivedMintSimpleInfo(selectedPairState, selectedPair, selectedCurrency ?? undefined)

  const pendingText = `Adding ${selectedTokenParsedAmount?.toSignificant(6)} ${
    selectedPair?.token0?.symbol
  } and ${theOtherTokenParsedAmount?.toSignificant(6)} ${selectedPair?.token0?.symbol}`

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
    theOtherCurrency: theOtherCurrency ?? undefined,
    setAttemptingTxn,
    setTxHash
  })

  const [isLoading, allPairs] = useGetPairFromSubgraphAndParse()

  return (
    <>
      <TransactionConfirmationModal
        isOpen={showConfirm}
        onDismiss={handleDismissConfirmation}
        attemptingTxn={attemptingTxn}
        hash={txHash}
        content={() => (
          <ConfirmationModalContent
            title={t('confirm_add_liquidity')}
            onDismiss={handleDismissConfirmation}
            topContent={() =>
              ModalHeader({
                selectedTokenParsedAmount,
                theOtherTokenParsedAmount,
                selectedToken: selectedTokenParsedAmount?.token,
                theOtherToken: theOtherTokenParsedAmount?.token
              })
            }
            bottomContent={() => (
              <ModalFooter
                price={price}
                selectedToken={selectedTokenParsedAmount?.token}
                theOtherToken={theOtherTokenParsedAmount?.token}
                noLiquidity={noLiquidity}
                onAdd={onAdd}
                poolTokenPercentage={poolTokenPercentage}
              />
            )}
            transactionType={TransactionType.ADD_ONE_TOKEN}
          />
        )}
        pendingText={pendingText}
        currencyToAdd={selectedPair?.liquidityToken}
      />
      <AutoColumn gap="md">
        <PanelSelectPair
          selectedPair={selectedPair}
          onPairSelect={handlePairSelect}
          isLoading={isLoading}
          allPairs={allPairs}
        />
        {(isPairExistAndNotNull || Number(guideStep.step) > 4) && (
          <AutoColumn>
            <OneStep4>
              <PanelCurrencyInput
                id="add-liquidity-simple-input-tokena"
                label={t('from')}
                value={Number(guideStep.step) > 5 ? '3.14159' : typedValue}
                onUserInput={onFieldInput}
                showMaxButton
                onMax={() => {
                  onFieldInput(maxAmount?.toExact() ?? '')
                }}
                currency={selectedCurrency}
                isCurrencySelectOrToggle={SelectOrToggle.TOGGLE}
                onCurrencyToggle={onCurrencyToggle}
              />
            </OneStep4>

            {selectedTokenParsedAmount && theOtherTokenParsedAmount && (
              <>
                <AutoRow justify="center">
                  <IconWrapper clickable={false}>
                    <StyledArrowDown />
                  </IconWrapper>
                </AutoRow>
                <PanelAddLiquidityOneTokenModeOutput
                  selectedTokenParsedAmount={selectedTokenParsedAmount}
                  theOtherTokenParsedAmount={theOtherTokenParsedAmount}
                />
              </>
            )}
          </AutoColumn>
        )}
      </AutoColumn>
      <ButtonGrouping
        selectedPairState={selectedPairState}
        selectedPair={selectedPair}
        selectedCurrency={selectedCurrency ?? undefined}
        setShowConfirm={setShowConfirm}
        onAdd={onAdd}
      />
      <TransactionDetails
        selectedPairState={selectedPairState}
        selectedPair={selectedPair}
        selectedCurrency={selectedCurrency ?? undefined}
      />
    </>
  )
}
