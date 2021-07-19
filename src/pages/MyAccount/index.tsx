import React from 'react'
import MyBalance from './MyBalance'
import MyLiquidity from './MyLiquidity'
import MyStaking from './MyStaking'
import Referral from './Referral'
import { useActiveWeb3React } from '../../hooks'
import { Redirect } from 'react-router'
import { MyAccountWrapper, Sections, PageTitle } from './components'
import useAccountIsReferrer from '../../hooks/useAccountIsReferrer'
import { useIsReferralWorksOnCurrentNetwork } from '../../state/referral/hooks'

export default function MyAccount() {
  const { account } = useActiveWeb3React()

  const accountIsReferrer = useAccountIsReferrer()
  const isReferralWorksOnCurrentNetwork = useIsReferralWorksOnCurrentNetwork()

  if (account) {
    return (
      <MyAccountWrapper>
        <PageTitle>My Account</PageTitle>
        <Sections>
          <MyBalance />
          <MyLiquidity />
          <MyStaking />
          {isReferralWorksOnCurrentNetwork && accountIsReferrer && <Referral />}
        </Sections>
      </MyAccountWrapper>
    )
  }

  return <Redirect to={{ pathname: '/swap' }} />
}
