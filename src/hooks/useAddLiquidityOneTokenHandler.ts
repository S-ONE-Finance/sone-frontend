import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import { Currency, ETHER, JSBI, Pair, Percent } from '@s-one-finance/sdk-core'
import { PairState } from 'data/Reserves'
import React, { useCallback } from 'react'
import { useDerivedMintSimpleInfo } from 'state/mintSimple/hooks'
import { TransactionType } from 'state/transactions/types'
import { useActiveWeb3React } from '.'
import { BIPS_BASE } from '../constants'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useUserSlippageTolerance } from '../state/user/hooks'
import { calculateGasMargin, calculateSlippageAmount, getRouterContract } from '../utils'
import { useTradeExactIn } from './Trades'
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

  const { userInputParsedAmount, selectedTokenParsedAmount, theOtherTokenParsedAmount } = useDerivedMintSimpleInfo(
    selectedPairState,
    selectedPair,
    selectedCurrency
  )

  const deadline = useTransactionDeadline()
  const [allowedSlippage] = useUserSlippageTolerance()

  const addTransaction = useTransactionAdder()

  // Lấy data bên swap.
  const trade = useTradeExactIn(selectedTokenParsedAmount, theOtherCurrency)

  const allowedSlippagePercent = new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE)
  // amountIn = lượng currency người dùng nhập, để dạng raw string.
  const amountIn = userInputParsedAmount?.raw.toString()
  const amountOut: string | undefined = trade
    ? trade.minimumAmountOut(allowedSlippagePercent).raw.toString()
    : undefined

  const handler = useCallback(async () => {
    if (!chainId || !library || !account) return
    const router = getRouterContract(chainId, library, account)

    if (
      !selectedTokenParsedAmount ||
      !theOtherTokenParsedAmount ||
      !selectedCurrency ||
      !selectedPair ||
      !deadline ||
      !amountIn ||
      !amountOut
    ) {
      return
    }

    const selectedTokenMinAmount = calculateSlippageAmount(selectedTokenParsedAmount, allowedSlippage)[0]
    const theOtherTokenMinAmount = calculateSlippageAmount(theOtherTokenParsedAmount, allowedSlippage)[0]

    let estimate,
      method: (...args: any) => Promise<TransactionResponse>,
      args: Array<string | string[] | number>,
      value: BigNumber | null

    if (ETHER === selectedCurrency) {
      // If user select ETHER.
      estimate = router.estimateGas.addLiquidityOneTokenETHExactETH
      method = router.addLiquidityOneTokenETHExactETH
      // amountTokenMin, amountETHMin, amountOutTokenMin, path, to, deadline
      args = [
        theOtherTokenMinAmount.toString(),
        selectedTokenMinAmount.toString(),
        amountOut,
        [selectedTokenParsedAmount.token.address, theOtherTokenParsedAmount.token.address],
        account,
        deadline.toHexString()
      ]
      value = BigNumber.from(amountIn)
    } else if (ETHER === theOtherCurrency) {
      // If user select a token, and the other currency is ETHER.
      estimate = router.estimateGas.addLiquidityOneTokenETHExactToken
      method = router.addLiquidityOneTokenETHExactToken
      // amountIn, amountTokenMin, amountETHMin, amountOutETHMin, path, to, deadline
      args = [
        amountIn,
        selectedTokenMinAmount.toString(),
        theOtherTokenMinAmount.toString(),
        amountOut,
        [selectedTokenParsedAmount.token.address, theOtherTokenParsedAmount.token.address],
        account,
        deadline.toHexString()
      ]
      value = null
    } else {
      // If pair no contains ETHER, which means user select one of two tokens.
      estimate = router.estimateGas.addLiquidityOneToken
      method = router.addLiquidityOneToken
      // amountIn, amountAMin, amountBMin, amountOutMin, path, to, deadline
      // FIXME: vẫn đang bị oẳng ở đây do args sai.
      args = [
        amountIn,
        selectedTokenMinAmount.toString(),
        theOtherTokenMinAmount.toString(),
        amountOut,
        [selectedTokenParsedAmount.token.address, theOtherTokenParsedAmount.token.address],
        account,
        deadline.toHexString()
      ]
      console.log('args', args)
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
              token0Amount: selectedTokenParsedAmount.toSignificant(3),
              token0Symbol: selectedTokenParsedAmount.token.symbol,
              token1Amount: theOtherTokenParsedAmount.toSignificant(3),
              token1Symbol: theOtherTokenParsedAmount.token.symbol
            }
          })

          setTxHash(response.hash)

          // TODO: Xoá bỏ bọn ReactGA này sau khi confirm với team và khách.
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
    amountIn,
    amountOut,
    chainId,
    deadline,
    library,
    selectedCurrency,
    selectedPair,
    selectedTokenParsedAmount,
    setAttemptingTxn,
    setTxHash,
    theOtherCurrency,
    theOtherTokenParsedAmount
  ])

  return handler
}
