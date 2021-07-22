import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Swap from './Swap'
import { OpenClaimAddressModalAndRedirectToSwap, RedirectPathToSwapOnly, RedirectToSwap } from './Swap/redirects'
import AddLiquidity from './AddLiquidity'
import { RedirectDuplicateTokenIds, RedirectOldAddLiquidityPathStructure } from './AddLiquidity/redirects'
import MyAccountPage from './MyAccount'
import { RedirectOldRemoveLiquidityPathStructure } from './WithdrawLiquidity/redirects'
import WithdrawLiquidity from './WithdrawLiquidity'
import WithdrawLiquidity2 from './WithdrawLiquidity2'
import PoolFinder from './PoolFinder'
import Vote from './Vote'
import VotePage from './Vote/VotePage'
import Earn from './Earn'
import Manage from './Earn/Manage'
import UnstakeUI from './UnstakeUI'

export default function Routing() {
  return (
    <Switch>
      <Route exact strict path="/swap" component={Swap} />
      <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
      <Route exact path="/add" component={AddLiquidity} />
      <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
      <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
      <Route exact strict path="/my-account" component={MyAccountPage} />
      <Route exact strict path="/my-account/withdraw/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
      <Route exact strict path="/my-account/withdraw/:currencyIdA/:currencyIdB" component={WithdrawLiquidity} />
      <Route exact strict path="/my-account/withdraw2/:currencyIdA/:currencyIdB" component={WithdrawLiquidity2} />
      <Route exact strict path="/my-account/unstake" component={UnstakeUI} />
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
