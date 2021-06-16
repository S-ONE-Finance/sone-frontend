import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import { Currency, Pair, WETH } from '@s-one-finance/sdk-core'
import { PairState } from 'data/Reserves'
import React, { useCallback } from 'react'
import { useDerivedMintSimpleInfo } from 'state/mintSimple/hooks'
import { useActiveWeb3React } from '.'
import { useTransactionAdder } from '../state/transactions/hooks'
import { TransactionType } from '../state/transactions/types'
import { useUserSlippageTolerance } from '../state/user/hooks'
import { calculateGasMargin, calculateSlippageAmount, getRouterContract } from '../utils'
import useTransactionDeadline from './useTransactionDeadline'

type UseAddLiquidityOneTokenHandlerProps = {
  selectedPairState: PairState
  selectedPair: Pair | null
  selectedCurrency?: Currency
  setAttemptingTxn: React.Dispatch<React.SetStateAction<boolean>>
  setTxHash: React.Dispatch<React.SetStateAction<string>>
}

export default function useAddLiquidityOneTokenHandler({
  selectedPairState,
  selectedPair,
  selectedCurrency,
  setAttemptingTxn,
  setTxHash
}: UseAddLiquidityOneTokenHandlerProps) {
  const { account, chainId, library } = useActiveWeb3React()

  const { token0ParsedAmount, token1ParsedAmount } = useDerivedMintSimpleInfo(
    selectedPairState,
    selectedPair,
    selectedCurrency
  )

  const deadline = useTransactionDeadline()
  const [allowedSlippage] = useUserSlippageTolerance()

  const addTransaction = useTransactionAdder()

  const handler = useCallback(async () => {
    if (!chainId || !library || !account) return
    const router = getRouterContract(chainId, library, account)

    if (!token0ParsedAmount || !token1ParsedAmount || !selectedCurrency || !selectedPair || !deadline) {
      return
    }

    // Code Smart Contract uses abbre AB instead of 01
    const token0MinAmount = calculateSlippageAmount(token0ParsedAmount, allowedSlippage)[0]
    const token1MinAmount = calculateSlippageAmount(token1ParsedAmount, allowedSlippage)[0]

    let estimate,
      method: (...args: any) => Promise<TransactionResponse>,
      args: Array<string | string[] | number>,
      value: BigNumber | null

    const { token0, token1 } = selectedPair

    if (WETH[chainId].equals(token0) || WETH[chainId].equals(token1)) {
      const token0IsWETH = WETH[chainId].equals(token0)
      estimate = router.estimateGas.addLiquidityETH // TODO: addLiquidityETH2token
      method = router.addLiquidityETH // TODO: addLiquidityETH2token
      args = [
        token0IsWETH ? token1.address : token0.address, // token
        (token0IsWETH ? token1ParsedAmount : token0ParsedAmount).raw.toString(), // token desired
        (token0IsWETH ? token1MinAmount : token0MinAmount).toString(), // token min
        (token0IsWETH ? token0MinAmount : token1MinAmount).toString(), // eth min
        account,
        deadline.toHexString()
      ]
      value = BigNumber.from((token0IsWETH ? token0ParsedAmount : token1ParsedAmount).raw.toString())
    } else {
      estimate = router.estimateGas.addLiquidity
      method = router.addLiquidity
      args = [
        token0.address,
        token1.address,
        token0ParsedAmount.raw.toString(),
        token1ParsedAmount.raw.toString(),
        token0MinAmount.toString(),
        token1MinAmount.toString(),
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
              type: TransactionType.ADD,
              token0Amount: token0ParsedAmount?.toSignificant(3),
              token0Symbol: token0?.symbol,
              token1Amount: token1ParsedAmount?.toSignificant(3),
              token1Symbol: token1?.symbol
            }
          })

          setTxHash(response.hash)

          // TODO: Remove this sau khi confirm voi team la bo Google Analytics
          // ReactGA.event({
          //   category: 'Liquidity',
          //   action: 'Add',
          //   label: [currencies[Field.CURRENCY_A]?.symbol, currencies[Field.CURRENCY_B]?.symbol].join('/')
          // })
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
    deadline,
    library,
    selectedCurrency,
    selectedPair,
    setAttemptingTxn,
    setTxHash,
    token0ParsedAmount,
    token1ParsedAmount
  ])

  return handler
}
