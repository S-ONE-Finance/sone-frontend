import { createAction } from '@reduxjs/toolkit'

export const updateReferral = createAction<{ id: number; code: string }>('referral/updateReferral')
