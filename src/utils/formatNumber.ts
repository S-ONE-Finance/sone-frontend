import Numeral from 'numeral'
import BigNumber from 'bignumber.js'

export const getFormattedNumber = (num: number, digits: number): string => {
  if (num === Number.POSITIVE_INFINITY) return '∞ '
  return Numeral(num)
    .format(`0,0.[${'0'.repeat(digits)}]a`)
    .toLocaleUpperCase()
}

export function getNumberCommas(x: number | string) {
  const parts = x.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

export function getFixedNumberCommas(num: number) {
  let res = ''
  if (num > 1000000) return getFormattedNumber(num, 1)
  else if (num > 1000) res = num.toFixed(0)
  else if (num > 100) res = num.toFixed(1)
  else if (num > 10) res = num.toFixed(2)
  else if (num > 1) res = num.toFixed(3)
  return getNumberCommas(res)
}

/**
 * Chia cho decimals để ra đúng giá trị hiển thị của nó.
 * @param balance
 * @param decimals
 */
export const getBalanceNumber = (balance: string, decimals = 18) => {
  return new BigNumber(balance).dividedBy(new BigNumber(10).pow(decimals)).toNumber()
}

export const getBalanceStringCommas = (balance: string, decimals = 18) => {
  const val = getBalanceNumber(balance, decimals)
  return getNumberCommas(val)
}

export const getFixedBalanceStringCommas = (balance: string, decimals = 18) => {
  const val = getBalanceNumber(balance, decimals)
  return getFixedNumberCommas(val)
}

export const reduceFractionDigit = (number = '', digitAmount = 0) =>
  Number(number).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: digitAmount
  })
