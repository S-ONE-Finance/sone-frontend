import { useActiveWeb3React } from './index'
import { Currency, Token } from '@s-one-finance/sdk-core'
import { SONE } from '../constants'

export default function useCurrencyIsSone(currency?: Currency): boolean {
  const { chainId } = useActiveWeb3React()

  if (currency instanceof Token) {
    if (currency.chainId !== chainId) {
      throw new Error(`The chainId of passed currency is different from wallet chainId.`)
    }
    return currency.equals(SONE[chainId])
  }

  // Passed currency is ETH or undefined, not SONE.
  return false
}
