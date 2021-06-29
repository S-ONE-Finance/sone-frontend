import React from 'react'
import Index from './MyBalance'
import MyLiquidity from './MyLiquidity'
import { useActiveWeb3React } from '../../hooks'
import { Redirect } from 'react-router'
import { MyAccountWrapper, PageTitle, Sections } from './index.styled'

export default function MyAccount() {
  const { account } = useActiveWeb3React()

  if (account) {
    return (
      <MyAccountWrapper>
        <PageTitle>My Account</PageTitle>
        <Sections>
          <Index />
          <MyLiquidity />
        </Sections>
      </MyAccountWrapper>
    )
  }

  return <Redirect to={{ pathname: '/swap' }} />
}
