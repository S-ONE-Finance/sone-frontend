import { useTransactionAdder } from '../state/transactions/hooks'
import { Field } from '../state/burn/actions'
import { calculateGasMargin, calculateSlippageAmount, getRouterContract } from '../utils'
import { Currency, ETHER } from '@s-one-finance/sdk-core'
import { ApprovalState, useApproveCallback } from './useApproveCallback'
import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import ReactGA from 'react-ga'
import React, { useCallback, useMemo } from 'react'
import { useActiveWeb3React } from './index'
import useTransactionDeadline from './useTransactionDeadline'
import { useDerivedBurnInfo } from '../state/burn/hooks'
import { useUserSlippageTolerance } from '../state/user/hooks'
import { wrappedCurrency } from '../utils/wrappedCurrency'
import { ROUTER_ADDRESS } from '../constants'
import { TransactionType } from '../state/transactions/types'

export default function useWithdrawLiquidityCallback({
  currencyA,
  currencyB,
  signatureData,
  setAttemptingTxn,
  setTxHash
}: {
  currencyA?: Currency
  currencyB?: Currency
  signatureData: { v: number; r: string; s: string; deadline: number } | null
  setAttemptingTxn: React.Dispatch<React.SetStateAction<boolean>>
  setTxHash: React.Dispatch<React.SetStateAction<string>>
}) {
  const { account, chainId = 1, library } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const deadline = useTransactionDeadline()
  const [allowedSlippage] = useUserSlippageTolerance()
  const { parsedAmounts } = useDerivedBurnInfo(currencyA, currencyB)
  const [tokenA, tokenB] = useMemo(() => [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)], [
    currencyA,
    currencyB,
    chainId
  ])
  const [approval] = useApproveCallback(parsedAmounts[Field.LIQUIDITY], ROUTER_ADDRESS[chainId])

  return useCallback(async () => {
    if (!chainId || !library || !account || !deadline) throw new Error('missing dependencies')
    const { [Field.CURRENCY_A]: currencyAmountA, [Field.CURRENCY_B]: currencyAmountB } = parsedAmounts
    if (!currencyAmountA || !currencyAmountB) {
      throw new Error('missing currency amounts')
    }
    const router = getRouterContract(chainId, library, account)

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(currencyAmountA, allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(currencyAmountB, allowedSlippage)[0]
    }

    if (!currencyA || !currencyB) throw new Error('missing tokens')
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
    if (!liquidityAmount) throw new Error('missing liquidity amount')

    const currencyBIsETH = currencyB === ETHER
    const oneCurrencyIsETH = currencyA === ETHER || currencyBIsETH

    if (!tokenA || !tokenB) throw new Error('could not wrap')

    let methodNames: string[], args: Array<string | string[] | number | boolean>
    // we have approval, use normal remove liquidity
    if (approval === ApprovalState.APPROVED) {
      // removeLiquidityETH
      if (oneCurrencyIsETH) {
        methodNames = ['removeLiquidityETH', 'removeLiquidityETHSupportingFeeOnTransferTokens']
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
          account,
          deadline.toHexString()
        ]
      }
      // removeLiquidity
      else {
        methodNames = ['removeLiquidity']
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          deadline.toHexString()
        ]
      }
    }
    // we have a signature, use permit versions of remove liquidity
    else if (signatureData !== null) {
      // removeLiquidityETHWithPermit
      if (oneCurrencyIsETH) {
        methodNames = ['removeLiquidityETHWithPermit', 'removeLiquidityETHWithPermitSupportingFeeOnTransferTokens']
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s
        ]
      }
      // removeLiquidityETHWithPermit
      else {
        methodNames = ['removeLiquidityWithPermit']
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s
        ]
      }
    } else {
      throw new Error('Attempting to confirm without approval or a signature. Please contact support.')
    }

    const safeGasEstimates: (BigNumber | undefined)[] = await Promise.all(
      methodNames.map(methodName =>
        router.estimateGas[methodName](...args)
          .then(calculateGasMargin)
          .catch(error => {
            console.error(`estimateGas failed`, methodName, args, error)
            return undefined
          })
      )
    )

    const indexOfSuccessfulEstimation = safeGasEstimates.findIndex(safeGasEstimate =>
      BigNumber.isBigNumber(safeGasEstimate)
    )

    // all estimations failed...
    if (indexOfSuccessfulEstimation === -1) {
      console.error('This transaction would fail. Please contact support.')
    } else {
      const methodName = methodNames[indexOfSuccessfulEstimation]
      const safeGasEstimate = safeGasEstimates[indexOfSuccessfulEstimation]

      setAttemptingTxn(true)
      await router[methodName](...args, {
        gasLimit: safeGasEstimate
      })
        .then((response: TransactionResponse) => {
          setAttemptingTxn(false)

          addTransaction(response, {
            summary: {
              type: TransactionType.WITHDRAW,
              currencyAAmount: parsedAmounts[Field.CURRENCY_A]?.toSignificant(3),
              currencyASymbol: currencyA?.symbol,
              currencyBAmount: parsedAmounts[Field.CURRENCY_B]?.toSignificant(3),
              currencyBSymbol: currencyB?.symbol
            }
          })

          setTxHash(response.hash)

          ReactGA.event({
            category: 'Liquidity',
            action: 'Remove',
            label: [currencyA?.symbol, currencyB?.symbol].join('/')
          })
        })
        .catch((error: Error) => {
          setAttemptingTxn(false)
          // we only care if the error is something _other_ than the user rejected the tx
          console.error(error)
        })
    }
  }, [
    account,
    addTransaction,
    allowedSlippage,
    approval,
    chainId,
    currencyA,
    currencyB,
    deadline,
    library,
    parsedAmounts,
    setAttemptingTxn,
    setTxHash,
    signatureData,
    tokenA,
    tokenB
  ])
}
