import Numeral from 'numeral'
import BigNumber from 'bignumber.js'
import { Fraction } from '@s-one-finance/sdk-core'

export const getFormattedNumber = (num: number | string, digits: number): string => {
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

export function getFixedNumberCommas(_num: string, fixedDigits = 18) {
  const num = new BigNumber(_num)
  let res = ''
  if (num.isGreaterThan(10000)) res = getFormattedNumber(num.toString(), 1)
  else if (num.isGreaterThan(1000)) res = num.toFixed(0)
  else if (num.isGreaterThan(100)) res = num.toFixed(1)
  else if (num.isGreaterThan(1)) res = num.toFixed(2)
  else if (num.isZero()) res = num.toFixed()
  else {
    res = num.toFixed(fixedDigits)
    while (res.charAt(res.length - 1) === '0') res = res.slice(0, -1)
    if (res.charAt(res.length - 1) === '.') res = res.slice(0, -1)
  }
  return getNumberCommas(res)
}

/**
 * Chia cho decimals để ra đúng giá trị hiển thị của nó.
 * @param balance
 * @param decimals
 */
export const getBalanceNumber = (balance: string, decimals = 18) => {
  const bn = new BigNumber(balance).decimalPlaces(18, 1).dividedBy(new BigNumber(10).pow(decimals))
  if (bn.eq(0)) return bn.toString()
  let res = bn.toFixed(18)
  while (res.charAt(res.length - 1) === '0') res = res.slice(0, -1)
  if (res.charAt(res.length - 1) === '.') res = res.slice(0, -1)
  return res
}

export const getBalanceStringCommas = (balance: string, decimals = 18) => {
  const val = getBalanceNumber(balance, decimals)
  return getNumberCommas(val)
}

export const reduceFractionDigit = (number = '', digitAmount = 0) =>
  Number(number).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: digitAmount
  })

export const plainNumber = (value: string): string => {
  return value.replace(/(-?)(\d*)\.?(\d*)e([+-]\d+)/, function(a, b, c, d, e) {
    return e < 0 ? b + '0.' + Array(1 - e - c.length).join('0') + c + d : b + c + d + Array(e - d.length + 1).join('0')
  })
}

export const formatSONE = (
  _amount: Fraction | string | undefined,
  withComma: boolean,
  isDividedFrom1e18: boolean
): string | undefined => {
  let amount: Fraction
  if (_amount === undefined) {
    return undefined
  } else if (typeof _amount === 'string') {
    amount = new Fraction(
      plainNumber(
        new BigNumber(_amount)
          .multipliedBy(isDividedFrom1e18 ? 1e18 : 1)
          .toFixed(0)
          .toString()
      ),
      (1e18).toString()
    )
  } else {
    amount = _amount
  }
  const res = amount.lessThan(new Fraction('1', '10000'))
    ? '0'
    : withComma
    ? getNumberCommas(amount.toSignificant(8))
    : amount.toSignificant(8)
  return res
}

/**
 * Làm tròn 2 chữ số sau dấu phẩy.
 * @param number
 * @param addComma
 */
export const formatTwoDigits = (number: Fraction, addComma = false) => {
  return number.lessThan('1') ? number.toSignificant(2) : number.toFixed(2, { groupSeparator: addComma ? ',' : '' })
}

/**
 * Làm tròn 2 chữ số sau dấu phẩy, nhân 1e100 cho chắc.
 * @param number
 * @param addComma
 * @param needDivide1e18
 */
export const formatTwoDigitsFromString = (number: string, addComma = false, needDivide1e18 = false) => {
  return formatTwoDigits(
    new Fraction(
      plainNumber(new BigNumber(number).multipliedBy((1e100).toString()).toString()),
      plainNumber((needDivide1e18 ? 1e100 * 1e18 : 1e100).toString())
    ),
    addComma
  )
}
