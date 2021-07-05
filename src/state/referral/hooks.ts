import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import { useCallback } from 'react'
import { updateReferralId } from './actions'

export function useReferralIdManager(): [string | undefined, (referralId: string) => void] {
  const referralId = useSelector<AppState, AppState['referral']['referralId']>(state => state.referral.referralId)

  const dispatch = useDispatch<AppDispatch>()
  const updateReferralIdCallback = useCallback(
    (referralId: string) => {
      dispatch(updateReferralId({ referralId }))
    },
    [dispatch]
  )

  return [referralId, updateReferralIdCallback]
}
