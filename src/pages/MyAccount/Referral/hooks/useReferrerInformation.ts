import axios from 'axios'
import { ADMIN_BACKEND_BASE_URL } from '../../../../constants/urls'
import { useActiveWeb3React } from '../../../../hooks'
import { useQuery } from 'react-query'

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

interface GetReferrerInformationResponse {
  data: Referrer
  statusCode: number
  time: string
}

export default function useReferrerInformation(): Referrer | undefined {
  const { account } = useActiveWeb3React()
  const url = `${ADMIN_BACKEND_BASE_URL}/referral-manager/my-account/${account}`
  const { data } = useQuery('useReferrerInformation', () =>
    axios
      .get<GetReferrerInformationResponse>(url)
      .then(data => data.data)
      .catch(() => {
        throw new Error('Cannot get useReferrerInformation.')
      })
  )

  return data?.data
}
