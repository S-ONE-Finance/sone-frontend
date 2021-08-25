import { useCallback, useState } from 'react'
import axios from 'axios'
import useReferrerInformation from './useReferrerInformation'
import { ADMIN_BACKEND_BASE_URL } from '../../../../constants/urls'

export default function useRequestReward(): [boolean, () => void] {
  const { id: referralId, pendingAmount: amount, isRequestRewardPending } = useReferrerInformation() || {}
  const [justClicked, setJustClicked] = useState(false)

  const handler = useCallback(() => {
    if (
      referralId === undefined ||
      amount === undefined ||
      isRequestRewardPending === undefined ||
      isRequestRewardPending === true
    ) {
      return
    }

    setJustClicked(true)

    const url = `${ADMIN_BACKEND_BASE_URL}/payment-requests`
    axios
      .post(url, {
        referralId
      })
      .then(() => {
        // TODO: Xử lý lại để không phụ thuộc vào setTimeout??
        setTimeout(() => setJustClicked(false), 15000)
      })
      .catch(err => {
        if (err.response) {
          const message =
            err?.response?.data?.message?.length && err?.response.data.message.length[0]?.errorDetail?.IsNotValid
          throw new Error(message)
        }
      })
  }, [referralId, amount, isRequestRewardPending])

  return [justClicked, handler]
}
