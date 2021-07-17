import { UserInfo } from 'hooks/masterfarmer/interfaces'
import useMyAccountStaked from 'hooks/masterfarmer/useMyAccountStaked'
import React from 'react'
import { Link } from 'react-router-dom'
import { MyStakeItem } from './MyStakeItem'

export default function MyStaking() {
  const myAccountStaked: UserInfo[] = useMyAccountStaked()

  return (
    <div>
      <Link to={`/staking`}>Stake</Link>
      <div>NET APY: {14.79}%</div>
      <hr />
      {myAccountStaked.map((item, key) => {
        return <MyStakeItem key={key} userInfor={item} />
      })}
    </div>
  )
}
