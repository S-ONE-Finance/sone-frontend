import { useActiveWeb3React } from './index'
import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { ADMIN_BACKEND_BASE_URL } from '../constants/urls'

interface Response {
  data:
    | {
        id: number
        code: string
      }
    | undefined
  statusCode: number
  time: string
}

export default function useAccountIsReferrer(): boolean {
  const { account } = useActiveWeb3React()
  const [isReferrer, setIsReferrer] = useState<boolean>(false)

  const fetchData = useCallback(async () => {
    if (!account) return

    const url = `${ADMIN_BACKEND_BASE_URL}/referral-manager/get-code/address/${account}`
    const { data } = await axios.get<Response>(url)
    if (data.statusCode === 200) {
      setIsReferrer(!!data.data)
    } else {
      throw new Error('Error in useAccountIsReferrer.')
    }
  }, [account])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return isReferrer
}
