/*
 * @Author: Keith-CY
 * @Date: 2018-07-22 21:05:01
 * @Last Modified by: Keith-CY
 * @Last Modified time: 2018-07-22 21:11:07
 */

import {
  initPanelConfigs,
  initServerList,
  initPrivateKeyList,
} from '../initValues'
import LOCAL_STORAGE, { PanelConfigs } from '../config/localstorage'

export const getServerList = () => {
  const storedList = window.localStorage.getItem(LOCAL_STORAGE.SERVER_LIST)
  if (storedList) {
    try {
      const servers = JSON.parse(storedList)
      return servers.length ? servers : initServerList
    } catch (err) {
      console.error(err)
      return initServerList
    }
  }
  return initServerList
}

export const getPrivkeyList = () => {
  const storedList = window.localStorage.getItem(LOCAL_STORAGE.PRIV_KEY_LIST)
  if (storedList) {
    try {
      return JSON.parse(storedList)
    } catch (err) {
      console.error(err)
      return initPrivateKeyList
    }
  }
  return initPrivateKeyList
}
export const getPanelConfigs = (
  defaultConfig: PanelConfigs = initPanelConfigs,
) => {
  const localConfigs = window.localStorage.getItem(LOCAL_STORAGE.PANEL_CONFIGS)
  if (localConfigs) {
    try {
      return JSON.parse(localConfigs)
    } catch (err) {
      console.error(err)
      return defaultConfig
    }
  }
  return defaultConfig
}
