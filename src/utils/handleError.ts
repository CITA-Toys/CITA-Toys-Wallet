/*
 * @Author: Keith-CY
 * @Date: 2018-07-22 21:33:48
 * @Last Modified by: Keith-CY
 * @Last Modified time: 2018-07-22 21:34:52
 */

import { initError } from './../initValues'

export const handleError = ctx => error => {
  if (!window.localStorage.getItem('chainIp')) return
  // only active when chain ip exsits
  ctx.setState(state => ({
    loading: state.loading - 1,
    error
  }))
  // }
}

export const dismissError = ctx => () => {
  ctx.setState({ error: initError })
}
