import { Currency, currencyEquals, ETHER, WETH } from '@s-one-finance/sdk-core'
import { useMemo } from 'react'
import { tryParseAmount } from '../state/swap/hooks'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useCurrencyBalance } from '../state/wallet/hooks'
import { useActiveWeb3React } from './index'
import { useWETHContract } from './useContract'
import { useTranslation } from 'react-i18next'

export enum WrapType {
  NOT_APPLICABLE,
  WRAP,
  UNWRAP
}

const NOT_APPLICABLE = { wrapType: WrapType.NOT_APPLICABLE }
/**
 * Given the selected input and output currency, return a wrap callback
 * @param inputCurrency the selected input currency
 * @param outputCurrency the selected output currency
 * @param typedValue the user input value
 */
export default function useWrapCallback(
  inputCurrency: Currency | undefined,
  outputCurrency: Currency | undefined,
  typedValue: string | undefined
): { wrapType: WrapType; execute?: undefined | (() => Promise<boolean>); inputError?: string } {
  const { t } = useTranslation()
  const { chainId, account } = useActiveWeb3React()
  const wethContract = useWETHContract()
  const balance = useCurrencyBalance(account ?? undefined, inputCurrency)
  // we can always parse the amount typed as the input currency, since wrapping is 1:1
  const inputAmount = useMemo(() => tryParseAmount(typedValue, inputCurrency), [inputCurrency, typedValue])
  const addTransaction = useTransactionAdder()

  return useMemo(() => {
    if (!wethContract || !chainId || !inputCurrency || !outputCurrency) return NOT_APPLICABLE

    const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount)

    if (inputCurrency === ETHER && currencyEquals(WETH[chainId], outputCurrency)) {
      return {
        wrapType: WrapType.WRAP,
        execute:
          sufficientBalance && inputAmount
            ? async () => {
                try {
                  const txReceipt = await wethContract.deposit({ value: `0x${inputAmount.raw.toString(16)}` })
                  addTransaction(txReceipt, { summary: `Wrap ${inputAmount.toSignificant(6)} ETH to WETH` })
                  return true
                } catch (error) {
                  console.error('Could not deposit', error)
                  return false
                }
              }
            : undefined,
        inputError:
          inputAmount === undefined
            ? t('enter_an_amount')
            : sufficientBalance
            ? undefined
            : t('insufficient_eth_balance', { symbol: 'ETH' })
      }
    } else if (currencyEquals(WETH[chainId], inputCurrency) && outputCurrency === ETHER) {
      return {
        wrapType: WrapType.UNWRAP,
        execute:
          sufficientBalance && inputAmount
            ? async () => {
                try {
                  const txReceipt = await wethContract.withdraw(`0x${inputAmount.raw.toString(16)}`)
                  addTransaction(txReceipt, { summary: `Unwrap ${inputAmount.toSignificant(6)} WETH to ETH` })
                  return true
                } catch (error) {
                  console.error('Could not withdraw', error)
                  return false
                }
              }
            : undefined,
        inputError:
          inputAmount === undefined
            ? t('enter_an_amount')
            : sufficientBalance
            ? undefined
            : t('insufficient_eth_balance', { symbol: 'WETH' })
      }
    } else {
      return NOT_APPLICABLE
    }
  }, [t, wethContract, chainId, inputCurrency, outputCurrency, inputAmount, balance, addTransaction])
}
