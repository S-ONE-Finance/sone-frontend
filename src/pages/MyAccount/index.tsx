import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  useIsReferralWorksOnCurrentNetwork,
  useParseReferralCodeInformationByAddress
} from '../../state/referral/hooks'

import MyBalance from './MyBalance'
import MyLiquidity from './MyLiquidity'
import MyStaking from './MyStaking'
import Referral from './Referral'
import { MyAccountWrapper, PageTitleMobileOnly, Sections } from './components'

export default function MyAccount() {
  const { t } = useTranslation()

  const parseReferralCodeInformationByAddress = useParseReferralCodeInformationByAddress()
  const showReferral = !!parseReferralCodeInformationByAddress
  const isReferralWorksOnCurrentNetwork = useIsReferralWorksOnCurrentNetwork()

  return (
    <MyAccountWrapper>
      <PageTitleMobileOnly>{t('my_account')}</PageTitleMobileOnly>
      <Sections>
        <MyBalance />
        <MyLiquidity />
        <MyStaking />
        {isReferralWorksOnCurrentNetwork && showReferral && <Referral />}
      </Sections>
    </MyAccountWrapper>
  )
}
