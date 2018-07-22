/*
 * @Author: Keith-CY
 * @Date: 2018-07-22 19:59:10
 * @Last Modified by: Keith-CY
 * @Last Modified time: 2018-07-22 20:10:55
 */

import * as React from 'react'
import { Route } from 'react-router-dom'

import Bundle from '../components/Bundle'
import containers from './containers'

export const asyncRender = mod => routerProps => {
  if (!mod) return null
  /* eslint-disable */
  const Component = require(`bundle-loader?lazy!../containers/${mod}`)
  /* eslint-enable */
  return (
    <Bundle load={Component}>
      {Comp => (Comp ? <Comp {...routerProps} /> : <div>Loading</div>)}
    </Bundle>
  )
}
/* eslint-enable import/no-dynamic-require */
/* eslint-enable global-require */

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
