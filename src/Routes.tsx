import * as React from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import Bundle from './components/Bundle'

export const containers = [
  { path: '/', name: 'Header', component: 'Header', nav: false },
  {
    path: '/',
    name: 'Homepage',
    component: 'Homepage',
    exact: true,
    nav: false,
  },
  {
    path: '/block/:blockHash',
    name: 'BlockByHash',
    component: 'Block',
    exact: true,
    nav: false,
  },
  {
    path: '/height/:height',
    name: 'BlockByHeight',
    component: 'Block',
    exact: true,
    nav: false,
  },
  {
    path: '/blocks',
    name: 'Blocks',
    component: 'BlockTable',
    exact: true,
    nav: true,
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: 'TransactionTable',
    exact: true,
    nav: true,
  },
  {
    path: '/transaction/:transaction',
    name: 'Transaction',
    component: 'Transaction',
    exact: true,
    nav: false,
  },
  {
    path: '/account/:account',
    name: 'Account',
    component: 'Account',
    exact: true,
    nav: false,
  },
  {
    path: '/graphs',
    name: 'Statistics',
    component: 'Graphs',
    exact: true,
    nav: true,
  },
  {
    path: '/config',
    name: 'Config',
    component: 'ConfigPage',
    exact: true,
    nav: true,
  },
  { path: '/', name: 'Footer', component: 'Footer', exact: false, nav: false },
]

const asyncRender = mod => routerProps => {
  if (!mod) return null
  /* eslint-disable */
  const Component = require(`bundle-loader?lazy!./containers/${mod}`)
  /* eslint-enable */
  return (
    <Bundle load={Component}>
      {Comp => (Comp ? <Comp {...routerProps} /> : <div>Loading</div>)}
    </Bundle>
  )
}
/* eslint-enable import/no-dynamic-require */
/* eslint-enable global-require */

export const renderRouteArray = containerArr =>
  containerArr.map(container => (
    <Route
      key={container.name}
      {...container}
      render={asyncRender(container.component)}
    />
  ))

const Routes = () => (
  <React.Fragment>
    {containers.map(container => (
      <Route
        key={container.name}
        path={container.path}
        exact={container.exact}
        render={asyncRender(container.component)}
      />
    ))}
  </React.Fragment>
)

export default Routes
