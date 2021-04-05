import Numeral from 'numeral'

export const getFormatNumber = (num: number, digits: number): string => {
  if (num === Number.POSITIVE_INFINITY) return '∞ '
  return Numeral(num)
    .format(`0,0.[${'0'.repeat(digits)}]a`)
    .toLocaleUpperCase()
}
