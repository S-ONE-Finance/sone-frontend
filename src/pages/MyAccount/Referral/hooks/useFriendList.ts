import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { ADMIN_BACKEND_BASE_URL } from '../../../../constants'
import { useActiveWeb3React } from '../../../../hooks'
import { FETCH_REFERRAL_DATA_INTERVAL } from '../index'

export interface Friend {
  id: number
  address: string
  date: Date // Date ở đây là cái ngày trong transaction receipt.
  rewardAmount: number // Số lượng SONE trả cho referrer = 0.05% khối lượng swap.
  transaction: string // Transaction Hash.
}

interface Response {
  data: {
    friends: Array<Friend>
    totalCount: number
  }
  statusCode: number
  time: string
}

export default function useFriendList(limit: number, page: number) {
  const { account } = useActiveWeb3React()
  const [result, setResult] = useState<Array<Friend>>([])

  const fetchData = useCallback(async () => {
    if (!account) return

    // Get all friend list, pagination with page number.
    const url = `${ADMIN_BACKEND_BASE_URL}/friends-manager?page=${page}&limit=${limit}&referralAddress=${account}&fromDate=2000-01-01&toDate=9999-12-31`
    const { data } = await axios.get<Response>(url)
    if (data.statusCode === 200) {
      setResult(data.data.friends)
    } else {
      throw new Error('Cannot get useFriendList.')
    }
  }, [account, limit, page])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, FETCH_REFERRAL_DATA_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchData])

  return result
}
