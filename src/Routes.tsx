import * as React from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import AsyncLoader from './components/AsyncLoader'

export const containers = [
  { path: '/', name: 'Header', component: 'Header' },
  // { path: '/', name: 'Sidebar', component: 'Sidebar' },
  { path: '/', name: 'NetStatus', component: 'NetStatus' },
  {
    path: '/processions',
    name: 'Procession',
    component: 'Procession',
    exact: true,
  },
  { path: '/blocks', name: 'Blocks', component: 'BlockList', exact: true },
  {
    path: '/contract-editor',
    name: 'ContractEditor',
    component: 'ContractEditor',
    exact: true,
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
