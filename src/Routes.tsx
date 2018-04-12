import * as React from 'react'
import { HashRouter as Router, Route, Redirect } from 'react-router-dom'
import AsyncLoader from './components/AsyncLoader'

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
    component: 'BlockList',
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
  }, //   name: 'Graphs', //   path: '/graphs', // { path: '/', name: 'NetStatus', component: 'NetStatus', nav: false }, // { // { path: '/', name: 'Sidebar', component: 'Sidebar' }, // {
  //   component: 'Graphs',
  //   exact: true,
  //   nav: true,
  // }, // {
  //   path: '/contract-editor',
  //   name: 'ContractEditor',
  //   component: 'ContractEditor',
  //   exact: true,
  //   nav: true,
  // },
  {
    path: '/config',
    name: 'Config',
    component: 'ConfigPage',
    exact: true,
    nav: true,
  },
  { path: '/', name: 'Footer', component: 'Footer', exact: false, nav: false },
]

const Routes = () => (
  <React.Fragment>
    {containers.map(container => (
      <Route
        key={container.name}
        {...container}
        component={AsyncLoader({
          loader: () => import(`./containers/${container.component}`),
        })}
      />
    ))}
  </React.Fragment>
)

export default Routes
