import React, { useCallback } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import { Currency, ETHER, Pair } from '@s-one-finance/sdk-core'

import { PairState } from 'data/Reserves'
import { useDerivedMintSimpleInfo } from 'state/mintSimple/hooks'
import { TransactionType } from 'state/transactions/types'
import { useActiveWeb3React } from '.'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useUserSlippageTolerance } from '../state/user/hooks'
import { calculateGasMargin, getRouterContract } from '../utils'
import useTransactionDeadline from './useTransactionDeadline'

type UseAddLiquidityOneTokenHandlerProps = {
  selectedPairState: PairState
  selectedPair: Pair | null
  selectedCurrency: Currency | undefined
  theOtherCurrency: Currency | undefined
  setAttemptingTxn: React.Dispatch<React.SetStateAction<boolean>>
  setTxHash: React.Dispatch<React.SetStateAction<string>>
}

export default function useAddLiquidityOneTokenHandler({
  selectedPairState,
  selectedPair,
  selectedCurrency,
  theOtherCurrency,
  setAttemptingTxn,
  setTxHash
}: UseAddLiquidityOneTokenHandlerProps) {
  const { account, chainId, library } = useActiveWeb3React()

  const {
    selectedTokenUserInputAmount,
    selectedTokenParsedAmount,
    theOtherTokenParsedAmount
  } = useDerivedMintSimpleInfo(selectedPairState, selectedPair, selectedCurrency)

  const deadline = useTransactionDeadline()
  const [allowedSlippage] = useUserSlippageTolerance()

  const addTransaction = useTransactionAdder()

  const handler = useCallback(async () => {
    if (
      !chainId ||
      !library ||
      !account ||
      !selectedTokenParsedAmount ||
      !selectedPair ||
      !theOtherTokenParsedAmount ||
      !deadline ||
      !selectedTokenUserInputAmount
    )
      return

    const router = getRouterContract(chainId, library, account)
    const [
      selectedTokenUserInputAmountJSBI,
      selectedTokenMinAmountJSBI,
      theOtherTokenMinAmountJSBI,
      theOtherTokenMinOutputAmountJSBI
    ] = selectedPair.getAmountsAddOneToken(selectedTokenUserInputAmount, allowedSlippage)

    let estimate,
      method: (...args: any) => Promise<TransactionResponse>,
      args: Array<string | string[] | number>,
      value: BigNumber | null

    if (ETHER === selectedCurrency) {
      /**
       * If user select ETHER.
       */
      estimate = router.estimateGas.addLiquidityOneTokenETHExactETH
      method = router.addLiquidityOneTokenETHExactETH
      // args = [amountTokenMin, amountETHMin, amountOutTokenMin, path, to, deadline]
      args = [
        theOtherTokenMinAmountJSBI.toString(),
        selectedTokenMinAmountJSBI.toString(),
        theOtherTokenMinOutputAmountJSBI.toString(),
        [selectedTokenParsedAmount.token.address, theOtherTokenParsedAmount.token.address],
        account,
        deadline.toHexString()
      ]
      value = BigNumber.from(selectedTokenUserInputAmount.raw.toString())
    } else if (ETHER === theOtherCurrency) {
      /**
       * If user select a token, and the other currency is ETHER.
       */
      estimate = router.estimateGas.addLiquidityOneTokenETHExactToken
      method = router.addLiquidityOneTokenETHExactToken
      // args = [amountIn, amountTokenMin, amountETHMin, amountOutETHMin, path, to, deadline]
      args = [
        selectedTokenUserInputAmountJSBI.toString(),
        selectedTokenMinAmountJSBI.toString(),
        theOtherTokenMinAmountJSBI.toString(),
        theOtherTokenMinOutputAmountJSBI.toString(),
        [selectedTokenParsedAmount.token.address, theOtherTokenParsedAmount.token.address],
        account,
        deadline.toHexString()
      ]
      value = null
    } else {
      /**
       * If pair no contains ETHER, which means user select one of two tokens.
       */

      /**
       * Let this comment here for debugging in the future:
       *
       * Pair: SONE - DAI
       *
       * I. "amountIn = 20 SONE" -> 2 phần:
       * Phần 1: "0.5*amountIn = 10 SONE" -> [swap("amountOutMin = "2.2216 DAI")] -> "amountOut = 2.24406 DAI"
       * Phần 2: ("0.5*amountIn = 10 SONE", "amountOut = 2.24406 DAI") -> [add("amountAMin = 9.9 SONE", "amountBMin = 2.1994 DAI")] -> add successfully when:
       *  - TH1: (0.5*amountIn, amountBMin <= X <= amountOut) ===> X < 2.1994 DAI
       *  - TH2: (amountAMin <= X <= 0.5*amountIn, amountOut)
       *
       * II. "amountIn = 2 DAI" -> 2 phần:
       * Phần 1: "0.5*amountIn = 1 DAI" -> [swap("amountOutMin = "42946.4 SONE")] -> "amountOut = 43380.2 SONE"
       * Phần 2: ("0.5*amountIn = 1 DAI", "amountOut = 43380.2 SONE") -> [add("amountAMin = 42516.9 SONE", "amountBMin = 0.99 DAI")]
       */
      estimate = router.estimateGas.addLiquidityOneToken
      method = router.addLiquidityOneToken
      // args = [amountIn, amountAMin, amountBMin, amountOutMin, path, to, deadline]
      args = [
        selectedTokenUserInputAmountJSBI.toString(),
        selectedTokenMinAmountJSBI.toString(),
        theOtherTokenMinAmountJSBI.toString(),
        theOtherTokenMinOutputAmountJSBI.toString(),
        [selectedTokenParsedAmount.token.address, theOtherTokenParsedAmount.token.address],
        account,
        deadline.toHexString()
      ]
      value = null
    }

    setAttemptingTxn(true)
    await estimate(...args, value ? { value } : {})
      .then(estimatedGasLimit =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit)
        }).then(response => {
          setAttemptingTxn(false)

          addTransaction(response, {
            summary: {
              type: TransactionType.ADD_ONE_TOKEN,
              userInputAmount: selectedTokenUserInputAmount?.toSignificant(6),
              userInputSymbol: selectedTokenUserInputAmount?.currency.symbol
            }
          })

          setTxHash(response.hash)
        })
      )
      .catch(error => {
        setAttemptingTxn(false)
        // we only care if the error is something other than the user rejected the tx
        if (error?.code !== 4001) {
          console.error(error)
        }
      })
  }, [
    account,
    addTransaction,
    allowedSlippage,
    chainId,
    deadline,
    library,
    selectedCurrency,
    selectedPair,
    selectedTokenParsedAmount,
    setAttemptingTxn,
    setTxHash,
    theOtherCurrency,
    theOtherTokenParsedAmount,
    selectedTokenUserInputAmount
  ])

  return handler
}
