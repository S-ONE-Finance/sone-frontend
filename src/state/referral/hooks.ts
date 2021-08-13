import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import { updateReferral } from './actions'
import useParsedQueryString from '../../hooks/useParsedQueryString'
import { useMemo } from 'react'
import { ADMIN_BACKEND_BASE_URL } from '../../constants/urls'
import axios from 'axios'
import { useActiveWeb3React } from '../../hooks'
import { useQuery } from 'react-query'

interface AccountIsReferrerResponse {
  data:
    | {
        id: number
        code: string
      }
    | undefined
  statusCode: number
  time: string
}

export function useAccountIsReferrer(): boolean {
  const { account } = useActiveWeb3React()

  const url = useMemo(() => `${ADMIN_BACKEND_BASE_URL}/referral-manager/get-code/address/${account}`, [account])
  const { data } = useQuery('useAccountIsReferrer', () =>
    axios
      .get<AccountIsReferrerResponse>(url)
      .then(data => data.data)
      .catch(() => {
        throw new Error('Error in useAccountIsReferrer.')
      })
  )
  return Boolean(data?.data)
}

interface GetReferralIdByCodeResponse {
  data:
    | {
        id: number
        address: string
      }
    | undefined
  statusCode: number
  time: string
}

/**
 * Watch url query string and update referralId state (if any).
 * What user see: referralId = 1A2B3C4D.
 * What system see: referral: {id, code} = {1, "1A2B3C4D"}.
 */
export function useReferral() {
  const queryString = useParsedQueryString()
  const referralCodeInQueryString = queryString['referral-id']

  const dispatch = useDispatch<AppDispatch>()
  const referralInStore = useSelector<AppState, AppState['referral']>(state => state.referral)

  const url = `${ADMIN_BACKEND_BASE_URL}/referral-manager/get-address/code/${referralCodeInQueryString}`
  const shouldQueryRun = Boolean(referralCodeInQueryString && referralCodeInQueryString !== referralInStore.code)
  useQuery(
    ['useReferral', referralCodeInQueryString],
    () =>
      axios
        .get<GetReferralIdByCodeResponse>(url)
        .then(data => {
          if (data.data.data?.id && referralCodeInQueryString) {
            dispatch(
              updateReferral({
                id: data.data.data.id,
                code: referralCodeInQueryString.toString()
              })
            )
          } else {
            dispatch(
              updateReferral({
                id: undefined,
                code: undefined
              })
            )
            throw new Error(`${referralCodeInQueryString} might not a valid referral id.`)
          }
          return data.data
        })
        .catch(() => {
          throw new Error(`${referralCodeInQueryString} might not a valid referral id.`)
        }),
    { enabled: shouldQueryRun }
  )

  return referralInStore
}

interface IsAccountReferredResponse {
  data: boolean
  statusCode: number
  time: string
}

export function useIsAccountReferred(): boolean {
  const { account } = useActiveWeb3React()

  const url = `${ADMIN_BACKEND_BASE_URL}/friends-manager/is-address-referred/${account}`
  const { data: isAccountReferred } = useQuery('useIsAccountReferred', () =>
    axios
      .get<IsAccountReferredResponse>(url)
      .then(data => data.data.data)
      .catch(() => {
        throw new Error('Error in useIsAccountReferred.')
      })
  )

  return useMemo(() => (isAccountReferred === undefined ? true : isAccountReferred), [isAccountReferred])
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
