import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import { clearReferral, updateReferral } from './actions'
import useParsedQueryString from '../../hooks/useParsedQueryString'
import { useCallback, useMemo } from 'react'
import { ADMIN_BACKEND_BASE_URL } from '../../constants/urls'
import axios from 'axios'
import { useActiveWeb3React } from '../../hooks'
import { useQuery } from 'react-query'

export function useClearReferralCallback() {
  const dispatch = useDispatch<AppDispatch>()

  return useCallback(() => {
    dispatch(clearReferral())
  }, [dispatch])
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
          if (referralCodeInQueryString) {
            dispatch(
              updateReferral({
                id: data.data.data?.id ? data.data.data.id : undefined,
                code: referralCodeInQueryString.toString()
              })
            )
          }
          return data.data
        })
        .catch(() => {
          console.error(`${referralCodeInQueryString} is not a valid referral id.`)
        }),
    { enabled: shouldQueryRun }
  )

  return referralInStore
}

interface ParseReferralCodeByAddressResponse {
  data:
    | {
        id: number
        code: string
      }
    | undefined
  statusCode: number
  time: string
}

export function useParseReferralCodeInformationByAddress(): string | undefined {
  const { account } = useActiveWeb3React()

  const url = useMemo(() => `${ADMIN_BACKEND_BASE_URL}/referral-manager/get-code/address/${account}`, [account])
  const { data } = useQuery(
    ['useParseReferralCodeInformationByAddress', account],
    () =>
      axios
        .get<ParseReferralCodeByAddressResponse>(url)
        .then(data => data.data)
        .catch(() => {
          throw new Error('Error in useParseReferralCodeInformationByAddress.')
        }),
    { enabled: Boolean(account) }
  )

  return data?.data?.code
}

export function useAccountIsReferrerAndSavedReferralCodeIsOfThisAccount(): boolean {
  const { code } = useReferral()
  const parsedReferralCode = useParseReferralCodeInformationByAddress()

  if (parsedReferralCode === undefined || code === undefined) return false

  return Boolean(parsedReferralCode === code)
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
