import { createReducer } from '@reduxjs/toolkit'
import { typeInput } from './actions'

export interface MintSimpleState {
  readonly typedValue: string
}

const initialState: MintSimpleState = {
  typedValue: ''
}

export default createReducer<MintSimpleState>(initialState, builder =>
  builder.addCase(typeInput, (state, { payload: { typedValue } }) => {
    return {
      ...state,
      typedValue
    }
  })
)
