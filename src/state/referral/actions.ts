import { createAction } from '@reduxjs/toolkit'
import { ReferralState } from './reducer'

export const updateReferral = createAction<ReferralState>('referral/updateReferral')
