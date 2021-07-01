import { useCallback, useState } from 'react'
import axios from 'axios'
import useReferrerInformation from './useReferrerInformation'
import { ADMIN_BACKEND_BASE_URL } from '../../../../constants'
import { FETCH_REFERRAL_DATA_INTERVAL } from '../index'

export default function useRequestRewardHandler(): [boolean, () => Promise<void>] {
  const { id: referralId, pendingAmount: amount, isRequestRewardPending } = useReferrerInformation() || {}
  const [clicked, setClicked] = useState(false)

  const handler = useCallback(async () => {
    if (
      referralId === undefined ||
      amount === undefined ||
      isRequestRewardPending === undefined ||
      isRequestRewardPending === true
    )
      return

    const url = `${ADMIN_BACKEND_BASE_URL}/payment-requests`

    axios
      .post(url, {
        referralId,
        amount
      })
      .then(() => {
        setClicked(true)
        setTimeout(() => setClicked(false), FETCH_REFERRAL_DATA_INTERVAL)
      })
      .catch(err => {
        if (err.response) {
          const message =
            err?.response?.data?.message?.length && err?.response.data.message.length[0]?.errorDetail?.IsNotValid
          throw new Error(message)
        }
      })
  }, [referralId, amount, isRequestRewardPending])

  return [clicked, handler]
}
