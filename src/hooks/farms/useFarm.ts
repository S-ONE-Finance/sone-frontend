import { useContext } from 'react'
import { Context as FarmsContext, Farm } from '../../contexts/Farms'

const useFarm = (pid: number): Farm | undefined => {
  const { farms } = useContext(FarmsContext)
  const farm = farms.find(farm => farm.pid === pid)
  return farm
}

export default useFarm
