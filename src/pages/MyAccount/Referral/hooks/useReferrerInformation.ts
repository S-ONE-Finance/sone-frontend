import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { ADMIN_BACKEND_BASE_URL } from '../../../../constants'
import { useActiveWeb3React } from '../../../../hooks'
import { FETCH_REFERRAL_DATA_INTERVAL } from '../index'

export interface Referrer {
  id: number
  code: string // ReferralID là cái này.
  name: string
  address: string
  status: 'Enable' | 'Disable'
  totalPaidReward: number
  totalRewardAmount: number
  pendingAmount: number
  totalFriend: number
  isRequestRewardPending: boolean
}

interface Response {
  data: Referrer
  statusCode: number
  time: string
}

export default function useReferrerInformation() {
  const { account } = useActiveWeb3React()
  const [result, setResult] = useState<Referrer>()

  const fetchData = useCallback(async () => {
    if (!account) return

    const url = `${ADMIN_BACKEND_BASE_URL}/referral-manager/my-account/${account}`
    const { data } = await axios.get<Response>(url)
    if (data.statusCode === 200) {
      setResult(data.data)
    } else {
      throw new Error('Cannot get useReferrerInformation.')
    }
  }, [account])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, FETCH_REFERRAL_DATA_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchData])

  return result
}
