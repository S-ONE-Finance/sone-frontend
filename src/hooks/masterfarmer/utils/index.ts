import BigNumber from 'bignumber.js'
import { numberWithCommas } from '../../../subgraph/utils/formatter'

export const getBalanceNumber = (balance: string, decimals = 18) => {
  const displayBalance = new BigNumber(balance).dividedBy(new BigNumber(10).pow(decimals))
  return displayBalance.toNumber()
}

export const getDisplayBalance = (balance: BigNumber, decimals = 18) => {
  const displayBalance = balance.dividedBy(new BigNumber(10).pow(decimals))
  if (displayBalance.lt(1)) {
    return displayBalance.toPrecision(4)
  } else {
    return displayBalance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
}

export const getFullDisplayBalance = (balance: string, decimals = 18) => {
  return new BigNumber(balance).dividedBy(new BigNumber(10).pow(decimals)).toString()
}

export const getFullDisplayBalanceWithComma = (balance: string, decimals = 18) => {
  const val = getBalanceNumber(balance, decimals)
  return numberWithCommas(val)
}
