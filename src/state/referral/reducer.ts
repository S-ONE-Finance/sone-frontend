import { createReducer } from '@reduxjs/toolkit'
import { updateReferralId } from './actions'

export interface ReferralState {
  referralId?: string
}

export const initialState: ReferralState = {
  referralId: undefined
}

export default createReducer(initialState, builder =>
  builder.addCase(updateReferralId, (state, action) => {
    state.referralId = action.payload.referralId
  })
)
