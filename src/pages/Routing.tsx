import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import Swap from './Swap'
import { OpenClaimAddressModalAndRedirectToSwap, RedirectPathToSwapOnly, RedirectToSwap } from './Swap/redirects'

import AddLiquidity from './AddLiquidity'
import { RedirectDuplicateTokenIds, RedirectOldAddLiquidityPathStructure } from './AddLiquidity/redirects'

import Farms from './Farms'
import Farm from './Farm'
import Stake from './Stake'

import MyAccountPage from './MyAccount'
import WithdrawLiquidity from './WithdrawLiquidity'
import { RedirectOldRemoveLiquidityPathStructure } from './WithdrawLiquidity/redirects'
import Unstake from './Unstake'

import PoolFinder from './PoolFinder'
import Vote from './Vote'
import VotePage from './Vote/VotePage'
import Earn from './Earn'
import Manage from './Earn/Manage'

import { useActiveWeb3React } from '../hooks'

function AuthorizedRoute({ path, component }: any) {
  const { account } = useActiveWeb3React()

  if (account) {
    return <Route exact strict path={path} component={component} />
  }

  return <Redirect to={{ pathname: '/swap' }} />
}

export default function Routing() {
  return (
    <Switch>
      <Route exact strict path="/swap" component={Swap} />
      <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
      <Route exact path="/add" component={AddLiquidity} />
      <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
      <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
      <Route exact strict path="/staking" component={Farms} />
      <Route exact strict path="/staking/:farmId" component={Farm} />
      <Route exact strict path="/staking-ui/:farmId" component={Stake} />
      <AuthorizedRoute exact strict path="/my-account" component={MyAccountPage} />
      <AuthorizedRoute
        exact
        strict
        path="/my-account/withdraw/:tokens"
        component={RedirectOldRemoveLiquidityPathStructure}
      />
      <AuthorizedRoute
        exact
        strict
        path="/my-account/withdraw/:currencyIdA/:currencyIdB"
        component={WithdrawLiquidity}
      />
      <AuthorizedRoute exact strict path="/my-account/unstake/:farmId" component={Unstake} />
      {/* Component PoolFinder để import Pool, hiện tại trong requirements của sone chưa có use-case này. */}
      <Route exact strict path="/find" component={PoolFinder} />
      {/* Nhưng route dưới đây là của uni, trong sone không có, nhưng nên giữ lại. */}
      <Route exact strict path="/claim" component={OpenClaimAddressModalAndRedirectToSwap} />
      <Route exact strict path="/vote" component={Vote} />
      <Route exact strict path="/vote/:id" component={VotePage} />
      <Route exact strict path="/uni" component={Earn} />
      <Route exact strict path="/uni/:currencyIdA/:currencyIdB" component={Manage} />
      <Route component={RedirectPathToSwapOnly} />
    </Switch>
  )
}
