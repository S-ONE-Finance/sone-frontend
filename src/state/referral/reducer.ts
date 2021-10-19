import { createReducer } from '@reduxjs/toolkit'
import { clearReferral, updateReferral } from './actions'

export interface ReferralState {
  id?: number
  code?: string
  status?: string
}

export const initialState: ReferralState = {}

export default createReducer(initialState, builder =>
  builder
    .addCase(updateReferral, (state, action) => {
      state.id = action.payload.id
      state.code = action.payload.code
      state.status = action.payload.status
    })
    .addCase(clearReferral, (state, action) => {
      state.id = undefined
      state.code = undefined
      state.status = undefined
    })
)
