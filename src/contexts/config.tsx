/* eslint-disable */
/// <reference path="../typings/react/index.d.ts" />
/* eslint-enable */
import * as React from 'react'
import LOCAL_STORAGE from '../config/localstorage'
import {
  getServerList,
  getPrivkeyList,
  getPanelConfigs,
} from '../utils/accessLocalstorage'

const initConfig = {
  localStorage: LOCAL_STORAGE,
  serverList: getServerList(),
  privkeyList: getPrivkeyList(),
  panelConfigs: getPanelConfigs(),
  addServer: server => false,
  deleteServer: server => false,
  addPrivkey: privkey => false,
  deletePrivkey: privkey => false,
  changePanelConfig: (config: any) => false,
}

interface ConfigProviderActions {
  addServer: (server: string) => boolean
  deleteServer: (idx: number) => boolean
  addPrivkey: (privkey: string) => boolean
  deletePrivkey: (idx: number) => boolean
  changePanelConfig: (configs: any) => boolean
}

export type IConfig = typeof initConfig & ConfigProviderActions

const ConfigContext = React.createContext<IConfig>({
  ...initConfig,
})

class ConfigProvider extends React.Component<any, IConfig> {
  readonly state = initConfig
  protected addServer = (server: string): boolean => {
    const serverList = [...this.state.serverList]
    if (!serverList.includes(server)) {
      const newServerList = [...serverList, server]
      this.setState({
        serverList: newServerList,
      })
      // side effect
      window.localStorage.setItem(
        LOCAL_STORAGE.SERVER_LIST,
        JSON.stringify(newServerList),
      )
      return true
    }
    return false
  }
  protected deleteServer = (idx: number): boolean => {
    if (!this.state.serverList.length) {
      return false
    }
    const serverList = [...this.state.serverList].splice(idx, 1)
    this.setState({
      serverList,
    })
    // side effect
    window.localStorage.setItem(
      LOCAL_STORAGE.SERVER_LIST,
      JSON.stringify(serverList),
    )
    return true
  }
  protected addPrivkey = (privkey: string): boolean => {
    const privkeyList = [...this.state.privkeyList]
    if (!privkeyList.includes(privkey)) {
      const newPrivkeyList = [...privkeyList, privkey]
      this.setState({ privkeyList: newPrivkeyList })
      // side effect
      window.localStorage.setItem(
        LOCAL_STORAGE.PRIV_KEY_LIST,
        JSON.stringify(newPrivkeyList),
      )
      return true
    }
    return false
  }
  protected deletePrivkey = (idx: number): boolean => {
    if (!this.state.privkeyList.length) {
      return false
    }
    const privkeyList = [...this.state.privkeyList].splice(idx, 1)
    this.setState({ privkeyList })
    // side effect
    window.localStorage.setItem(
      LOCAL_STORAGE.PRIV_KEY_LIST,
      JSON.stringify(privkeyList),
    )
    return true
  }
  protected changePanelConfig = newPanelConfigs => {
    this.setState({
      panelConfigs: newPanelConfigs,
    })
    // side effect
    window.localStorage.setItem(
      LOCAL_STORAGE.PANEL_CONFIGS,
      JSON.stringify(newPanelConfigs),
    )
    return true
  }
  public render () {
    return (
      <ConfigContext.Provider
        value={{
          ...this.state,
          addServer: this.addServer,
          deleteServer: this.deleteServer,
          addPrivkey: this.addPrivkey,
          deletePrivkey: this.deletePrivkey,
          changePanelConfig: this.changePanelConfig,
        }}
      >
        {this.props.children}
      </ConfigContext.Provider>
    )
  }
}

export const provideConfig = Comp => props => (
  <ConfigProvider>
    <Comp {...props} />
  </ConfigProvider>
)

export const withConfig = Comp => props => (
  <ConfigContext.Consumer>
    {config => <Comp {...props} config={config} />}
  </ConfigContext.Consumer>
)

export default ConfigContext
