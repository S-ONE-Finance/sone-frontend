import React from 'react'
import { calculateGasMargin, calculateSlippageAmount, getRouterContract } from '../utils'
import { Field } from '../state/mint/actions'
import { TransactionResponse } from '@ethersproject/providers'
import { BigNumber } from '@ethersproject/bignumber'
import { Currency, ETHER } from '@s-one-finance/sdk-core'
import { wrappedCurrency } from '../utils/wrappedCurrency'
import { TransactionType } from '../state/transactions/types'
import ReactGA from 'react-ga'
import { useCallback } from 'react'
import { useActiveWeb3React } from '.'
import { useUserSlippageTolerance } from '../state/user/hooks'
import { useDerivedMintInfo } from '../state/mint/hooks'
import useTransactionDeadline from './useTransactionDeadline'
import { useTransactionAdder } from '../state/transactions/hooks'

type UseAddLiquidityTwoTokensHandlerProps = {
  currencyA: Currency | undefined
  currencyB: Currency | undefined
  setAttemptingTxn: React.Dispatch<React.SetStateAction<boolean>>
  setTxHash: React.Dispatch<React.SetStateAction<string>>
}

export default function useAddLiquidityTwoTokensHandler({
  currencyA,
  currencyB,
  setAttemptingTxn,
  setTxHash
}: UseAddLiquidityTwoTokensHandlerProps) {
  const { account, chainId, library } = useActiveWeb3React()

  const { currencies, parsedAmounts, noLiquidity } = useDerivedMintInfo(currencyA, currencyB)

  const deadline = useTransactionDeadline()
  const [allowedSlippage] = useUserSlippageTolerance()

  const addTransaction = useTransactionAdder()

  const handler = useCallback(async () => {
    if (!chainId || !library || !account) return
    const router = getRouterContract(chainId, library, account)

    const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts
    if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB || !deadline) {
      return
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? 0 : allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? 0 : allowedSlippage)[0]
    }

    let estimate,
      method: (...args: any) => Promise<TransactionResponse>,
      args: Array<string | string[] | number>,
      value: BigNumber | null

    if (currencyA === ETHER || currencyB === ETHER) {
      const tokenBIsETH = currencyB === ETHER
      estimate = router.estimateGas.addLiquidityETH
      method = router.addLiquidityETH
      args = [
        wrappedCurrency(tokenBIsETH ? currencyA : currencyB, chainId)?.address ?? '', // token
        (tokenBIsETH ? parsedAmountA : parsedAmountB).raw.toString(), // token desired
        amountsMin[tokenBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(), // token min
        amountsMin[tokenBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(), // eth min
        account,
        deadline.toHexString()
      ]
      value = BigNumber.from((tokenBIsETH ? parsedAmountB : parsedAmountA).raw.toString())
    } else {
      estimate = router.estimateGas.addLiquidity
      method = router.addLiquidity
      args = [
        wrappedCurrency(currencyA, chainId)?.address ?? '',
        wrappedCurrency(currencyB, chainId)?.address ?? '',
        parsedAmountA.raw.toString(),
        parsedAmountB.raw.toString(),
        amountsMin[Field.CURRENCY_A].toString(),
        amountsMin[Field.CURRENCY_B].toString(),
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
              type: TransactionType.ADD_TWO_TOKENS,
              token0Amount: parsedAmounts[Field.CURRENCY_A]?.toSignificant(3),
              token0Symbol: currencies[Field.CURRENCY_A]?.symbol,
              token1Amount: parsedAmounts[Field.CURRENCY_B]?.toSignificant(3),
              token1Symbol: currencies[Field.CURRENCY_B]?.symbol
            }
          })

          setTxHash(response.hash)

          ReactGA.event({
            category: 'Liquidity',
            action: 'Add',
            label: [currencies[Field.CURRENCY_A]?.symbol, currencies[Field.CURRENCY_B]?.symbol].join('/')
          })
        })
      )
      .catch(error => {
        setAttemptingTxn(false)
        // we only care if the error is something _other_ than the user rejected the tx
        if (error?.code !== 4001) {
          console.error(error)
        }
      })
  }, [
    account,
    addTransaction,
    allowedSlippage,
    chainId,
    currencies,
    currencyA,
    currencyB,
    deadline,
    library,
    noLiquidity,
    parsedAmounts,
    setAttemptingTxn,
    setTxHash
  ])

  return handler
}
