import axios from 'axios'
import { ADMIN_BACKEND_BASE_URL } from '../../../../constants/urls'
import { useActiveWeb3React } from '../../../../hooks'
import { useQuery } from 'react-query'
import { useLastTruthy } from '../../../../hooks/useLast'

export interface Friend {
  id: number
  address: string
  updatedAt: string
  rewardAmount: number // Số lượng SONE trả cho referrer = 0.05% khối lượng swap.
  transaction: string // Transaction Hash.
}

interface GetFriendListResponse {
  data: {
    friends: Array<Friend>
    totalCount: number
  }
  statusCode: number
  time: string
}

export default function useFriendList(limit: number, page: number): Friend[] {
  const { account } = useActiveWeb3React()
  const url = `${ADMIN_BACKEND_BASE_URL}/friends-manager?page=${page}&limit=${limit}&referralAddress=${account}&fromDate=2000-01-01&toDate=9999-12-31`
  const { data } = useQuery(['useFriendList', limit, page], () =>
    axios
      .get<GetFriendListResponse>(url)
      .then(data => data.data)
      .catch(() => {
        throw new Error('Cannot get useFriendList.')
      })
  )

  const lastTruthyData = useLastTruthy(data?.data.friends)
  return lastTruthyData ?? []
}
