import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export default function getTimestampsForChanges() {
  const utcCurrentTime = dayjs()
  const t1Day = utcCurrentTime
    .subtract(1, 'day')
    .startOf('minute')
    .unix()
  const t2Day = utcCurrentTime
    .subtract(2, 'day')
    .startOf('minute')
    .unix()
  const tWeek = utcCurrentTime
    .subtract(1, 'week')
    .startOf('minute')
    .unix()
  const t2Week = utcCurrentTime
    .subtract(2, 'week')
    .startOf('minute')
    .unix()
  return [t1Day, t2Day, tWeek, t2Week]
}
