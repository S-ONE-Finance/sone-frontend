/**
 * gets the amount difference plus the % change in change itself (second order change)
 * now - before1 = before1 - before2
 * for example: Khoảng thời gian từ now - 24h = từ 24h - 48h
 * @param {*} valueNow
 * @param {*} valueBefore1
 * @param {*} valueBefore2
 */
export const get2PeriodPercentChange = (valueNow: number, valueBefore1: number, valueBefore2: number) => {
  const currentChange = valueNow - valueBefore1
  const previousChange = valueBefore1 - valueBefore2

  if (currentChange === 0 && previousChange === 0) {
    return [0, 0]
  }

  const adjustedPercentChange = ((currentChange - previousChange) / previousChange) * 100

  return [currentChange, adjustedPercentChange]
}

/**
 * get standard percent change between two values
 * @param {*} valueNow
 * @param {*} valueBefore
 */
export const getPercentChange = (valueNow: number, valueBefore: number) => {
  if (Object.is(valueNow, NaN) || Object.is(valueBefore, NaN)) {
    return 0
  }
  if (!valueBefore) {
    return 0
  }
  return ((valueNow - valueBefore) / valueBefore) * 100
}
