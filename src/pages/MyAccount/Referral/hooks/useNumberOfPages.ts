import useReferrerInformation from './useReferrerInformation'

export default function useNumberOfPages(limit: number): number {
  const referrerInformation = useReferrerInformation()
  const { totalFriend } = referrerInformation || {}
  return totalFriend ? Math.ceil(totalFriend / limit) : 0
}
