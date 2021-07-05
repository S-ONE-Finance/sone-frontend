import { createAction } from '@reduxjs/toolkit'

export const updateReferralId = createAction<{ referralId: string }>('referral/updateReferralId')
