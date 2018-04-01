import * as React from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import AsyncLoader from './components/AsyncLoader'

export const containers = [
  { path: '/', name: 'Header', component: 'Header', nav: false },
  // { path: '/', name: 'Sidebar', component: 'Sidebar' },
  { path: '/', name: 'NetStatus', component: 'NetStatus', nav: false },
  {
    path: '/possessions',
    name: 'Possession',
    component: 'Possession',
    exact: true,
    nav: true,
  },
  {
    path: '/block/:blockHash',
    name: 'Block',
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
    path: '/contract-editor',
    name: 'ContractEditor',
    component: 'ContractEditor',
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
