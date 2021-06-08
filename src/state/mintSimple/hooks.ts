import { useSelector } from 'react-redux'

import { AppDispatch, AppState } from '../index'

export function useMintSimpleState(): AppState['mintSimple'] {
  return useSelector<AppState, AppState['mintSimple']>(state => state.mintSimple)
}
