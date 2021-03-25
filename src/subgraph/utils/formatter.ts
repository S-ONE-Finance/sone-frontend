import Numeral from 'numeral'

export const getFormatNumber = (num: number, digits: number): string => {
  return Numeral(num).format(`0,0.[${'0'.repeat(digits)}]`)
}
