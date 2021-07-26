import React from 'react'
import { Redirect } from 'react-router'
import { useTranslation } from 'react-i18next'

import { useActiveWeb3React } from '../../hooks'
import useAccountIsReferrer from '../../hooks/useAccountIsReferrer'
import { useIsReferralWorksOnCurrentNetwork } from '../../state/referral/hooks'

import MyBalance from './MyBalance'
import MyLiquidity from './MyLiquidity'
import MyStaking from './MyStaking'
import Referral from './Referral'
import { MyAccountWrapper, PageTitleMobileOnly, Sections } from './components'

export default function MyAccount() {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()

  const accountIsReferrer = useAccountIsReferrer()
  const isReferralWorksOnCurrentNetwork = useIsReferralWorksOnCurrentNetwork()

  if (account) {
    return (
      <MyAccountWrapper>
        <PageTitleMobileOnly>{t('My Account')}</PageTitleMobileOnly>
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
