import React from 'react'
import MyBalance from './MyBalance'
import MyLiquidity from './MyLiquidity'
import Referral from './Referral'
import { useActiveWeb3React } from '../../hooks'
import { Redirect } from 'react-router'
import { MyAccountWrapper, Sections, PageTitle } from './components'

export default function MyAccount() {
  const { account } = useActiveWeb3React()

  if (account) {
    return (
      <MyAccountWrapper>
        <PageTitle>My Account</PageTitle>
        <Sections>
          <MyBalance />
          <MyLiquidity />
          <Referral />
        </Sections>
      </MyAccountWrapper>
    )
  }

  return <Redirect to={{ pathname: '/swap' }} />
}
