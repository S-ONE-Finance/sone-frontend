import { useActiveWeb3React } from './index'
import { useCallback } from 'react'
import { ADMIN_BACKEND_BASE_URL } from '../constants/urls'
import axios from 'axios'
import { useReferral } from '../state/referral/hooks'

export default function useSwapReferralCallback() {
  const { account } = useActiveWeb3React()
  const { id: referralId } = useReferral()

  return useCallback(
    (txHash: string) => {
      if (referralId === undefined || typeof account !== 'string') return

      const url = `${ADMIN_BACKEND_BASE_URL}/friends`
      const today = new Date().toISOString().substr(0, 10)
      const options = {
        referralId,
        address: account,
        transaction: txHash,
        date: today,
        // TODO: Tính toán rewardAmount, đơn vị là SONE.
        // Ví dụ swap 1 ETH sang DAI. 1 ETH = 3100 SONE --> rewardAmount = 0.025% * 3100
        rewardAmount: 100
      }

      axios.post(url, options)
    },
    [account, referralId]
  )
}
