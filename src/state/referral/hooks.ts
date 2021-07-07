import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import { updateReferral } from './actions'
import useParsedQueryString from '../../hooks/useParsedQueryString'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ADMIN_BACKEND_BASE_URL } from '../../constants'
import axios from 'axios'
import { useActiveWeb3React } from '../../hooks'
import { FETCH_REFERRAL_DATA_INTERVAL } from '../../pages/MyAccount/Referral'

interface ValidateReferralIdResponse {
  data:
    | {
        id: number
        address: string
      }
    | undefined
  statusCode: number
  time: string
}

async function getReferralIdByCode(code: string): Promise<number | undefined> {
  const url = `${ADMIN_BACKEND_BASE_URL}/referral-manager/get-address/code/${code}`
  const { data } = await axios.get<ValidateReferralIdResponse>(url)
  if (data.statusCode === 200) {
    return data?.data?.id
  } else {
    throw new Error('Error in validateReferralId.')
  }
}

/**
 * Watch url query string and update referralId state (if any).
 * What user see: referralId = 1A2B3C4D.
 * What system see: referral: {id, code} = {1, "1A2B3C4D"}.
 */
export function useReferral() {
  const queryString = useParsedQueryString()
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (queryString['referral-id'] !== undefined) {
      const code = queryString['referral-id'].toString()
      getReferralIdByCode(code).then(referralId => {
        if (referralId !== undefined) {
          dispatch(updateReferral({ id: referralId, code }))
        } else {
          console.error(`Referral ID ${code} is not valid.`)
        }
      })
    }
  }, [dispatch, queryString])

  return useSelector<AppState, AppState['referral']>(state => state.referral)
}

interface IsAccountReferredResponse {
  data: boolean
  statusCode: number
  time: string
}

export function useIsAccountReferred(): boolean {
  const { account } = useActiveWeb3React()
  const [isAccountReferred, setIsAccountReferred] = useState(true)

  const fetchData = useCallback(async () => {
    const url = `${ADMIN_BACKEND_BASE_URL}/friends-manager/is-address-referred/${account}`
    const { data } = await axios.get<IsAccountReferredResponse>(url)
    if (data.statusCode === 200) {
      setIsAccountReferred(!!data.data)
    } else {
      throw new Error('Error in useIsAccountReferred.')
    }
  }, [account])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, FETCH_REFERRAL_DATA_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchData])

  return isAccountReferred
}

const REFERRAL_NETWORK = process.env.REACT_APP_REFERRAL_NETWORK

if (REFERRAL_NETWORK === undefined) {
  throw new Error(`REACT_APP_REFERRAL_NETWORK must be a defined environment variable.`)
}

export function useIsReferralWorksOnCurrentNetwork(): boolean {
  const { chainId } = useActiveWeb3React()

  return useMemo(() => {
    if (chainId?.toString() === REFERRAL_NETWORK) {
      return true
    } else {
      console.warn('Referral only work in network', REFERRAL_NETWORK)
      return false
    }
  }, [chainId])
}
