import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import { Currency, JSBI, Pair, Percent, WETH } from '@s-one-finance/sdk-core'
import { BIPS_BASE } from '../constants'
import { PairState } from 'data/Reserves'
import React, { useCallback } from 'react'
import { useDerivedMintSimpleInfo } from 'state/mintSimple/hooks'
import { unwrappedToken, wrappedCurrency } from 'utils/wrappedCurrency'
import { useActiveWeb3React } from '.'
import { useTransactionAdder } from '../state/transactions/hooks'
import { TransactionType } from '../state/transactions/types'
import { useUserSlippageTolerance } from '../state/user/hooks'
import { calculateGasMargin, calculateSlippageAmount, getRouterContract } from '../utils'
import { useTradeExactIn } from './Trades'
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

  const { parsedAmount, token0ParsedAmount, token1ParsedAmount } = useDerivedMintSimpleInfo(
    selectedPairState,
    selectedPair,
    selectedCurrency
  )

  const deadline = useTransactionDeadline()
  const [allowedSlippage] = useUserSlippageTolerance()

  const addTransaction = useTransactionAdder()

  const { token0, token1 } = selectedPair || {}
  const wrappedSelectedCurrency = wrappedCurrency(selectedCurrency, chainId)

  const token0IsSelected = wrappedSelectedCurrency && token0 && wrappedSelectedCurrency.equals(token0) ? true : false
  const selectedToken = token0IsSelected ? token0 : token1
  const theOtherToken = token0IsSelected ? token1 : token0

  // Lấy data bên swap.
  const trade = useTradeExactIn(
    token0IsSelected ? token0ParsedAmount : token1ParsedAmount,
    token0IsSelected ? token1 && unwrappedToken(token1) : token0 && unwrappedToken(token0)
  )

  const allowedSlippagePercent = new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE)
  // amountIn = lượng currency người dùng nhập, để dạng raw string.
  const amountIn = parsedAmount?.raw.toString()
  const amountOut: string | undefined = trade
    ? trade.minimumAmountOut(allowedSlippagePercent).raw.toString()
    : undefined

  const handler = useCallback(async () => {
    if (!chainId || !library || !account) return
    const router = getRouterContract(chainId, library, account)

    if (
      !token0ParsedAmount ||
      !token1ParsedAmount ||
      !selectedCurrency ||
      !selectedPair ||
      !deadline ||
      !selectedToken ||
      !theOtherToken ||
      !token0 ||
      !token1 ||
      !amountIn ||
      !amountOut
    ) {
      return
    }

    const token0MinAmount = calculateSlippageAmount(token0ParsedAmount, allowedSlippage)[0]
    const token1MinAmount = calculateSlippageAmount(token1ParsedAmount, allowedSlippage)[0]

    let estimate,
      method: (...args: any) => Promise<TransactionResponse>,
      args: Array<string | string[] | number>,
      value: BigNumber | null

    if (WETH[chainId].equals(selectedToken)) {
      // If user select ETHER.
      estimate = router.estimateGas.addLiquidityOneTokenETHExactETH
      method = router.addLiquidityOneTokenETHExactETH
      // amountTokenMin, amountETHMin, amountOutTokenMin, path, to, deadline
      args = [
        token0IsSelected ? token1MinAmount.toString() : token0MinAmount.toString(),
        token0IsSelected ? token0MinAmount.toString() : token1MinAmount.toString(),
        amountOut,
        [token0IsSelected ? token0.address : token1.address, token0IsSelected ? token1.address : token0.address],
        account,
        deadline.toHexString()
      ]
      value = BigNumber.from(amountIn)
    } else if (WETH[chainId].equals(theOtherToken)) {
      // If user select a token, and the other currency is ETHER.
      estimate = router.estimateGas.addLiquidityOneTokenETHExactToken
      method = router.addLiquidityOneTokenETHExactToken
      // amountIn, amountTokenMin, amountETHMin, amountOutETHMin, path, to, deadline
      args = [
        amountIn,
        token0IsSelected ? token0MinAmount.toString() : token1MinAmount.toString(),
        token0IsSelected ? token1MinAmount.toString() : token0MinAmount.toString(),
        amountOut,
        [token0IsSelected ? token0.address : token1.address, token0IsSelected ? token1.address : token0.address],
        account,
        deadline.toHexString()
      ]
      value = null
    } else {
      // If pair no contains ETHER, which means user select one of two tokens.
      estimate = router.estimateGas.addLiquidityOneToken
      method = router.addLiquidityOneToken
      // amountIn, amountAMin, amountBMin, amountOutMin, path, to, deadline
      // FIXME: vẫn đang bị oẳng ở đây.
      args = [
        amountIn,
        token0MinAmount.toString(),
        token1MinAmount.toString(),
        // token0IsSelected ? token0MinAmount.toString() : token1MinAmount.toString(),
        // token0IsSelected ? token1MinAmount.toString() : token0MinAmount.toString(),
        // AB ở đây sort theo address.
        // token0.address.localeCompare(token1.address) < 0 ? token0MinAmount.toString() : token1MinAmount.toString(),
        // token0.address.localeCompare(token1.address) < 0 ? token1MinAmount.toString() : token0MinAmount.toString(),
        // token0IsSelected ? token1MinAmount.toString() : token0MinAmount.toString(),
        // token0IsSelected ? token0MinAmount.toString() : token1MinAmount.toString(),
        amountOut,
        // [token0IsSelected ? token0.address : token1.address, token0IsSelected ? token1.address : token0.address],
        [token1.address, token0.address],
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
              // FIXME: giá trị phải là token0MinAmount token1MinAmount và phải đúng thứ tự.
              type: TransactionType.ADD,
              token0Amount: token0ParsedAmount?.toSignificant(3),
              token0Symbol: token0?.symbol,
              token1Amount: token1ParsedAmount?.toSignificant(3),
              token1Symbol: token1?.symbol
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
    selectedToken,
    setAttemptingTxn,
    setTxHash,
    theOtherToken,
    token0,
    token0IsSelected,
    token0ParsedAmount,
    token1,
    token1ParsedAmount
  ])

  return handler
}
