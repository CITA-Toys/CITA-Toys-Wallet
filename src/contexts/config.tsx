/* eslint-disable */
/// <reference path="../typings/react/index.d.ts" />
/* eslint-enable */
import * as React from 'react'
import LOCAL_STORAGE from '../config/localstorage'

// const initServerList = window.localStorage.getItem('server_list')
const getServerList = () => {
  const storedList = window.localStorage.getItem(LOCAL_STORAGE.SERVER_LIST)
  if (storedList) {
    const servers = JSON.parse(storedList)
    return servers.length ? servers : [process.env.CITA_SERVER]
  }
  return [process.env.CITA_SERVER]
}

const initConfig = {
  localStorage: LOCAL_STORAGE,
  serverList: getServerList(),
  changeServer: server => window.localStorage.setItem('server', server),
  addServer: server => false,
  deleteServer: server => false,
}

interface ConfigProviderActions {
  addServer: (server: string) => boolean
  deleteServer: (idx: number) => boolean
}

export type IConfig = typeof initConfig & ConfigProviderActions

const ConfigContext = React.createContext<IConfig>({
  ...initConfig,
})

class ConfigProvider extends React.Component {
  state = initConfig
  protected addServer = (server: string): boolean => {
    const serverList = [...this.state.serverList]
    if (!serverList.includes(server)) {
      const newServerList = [...serverList, server]
      this.setState(state => ({
        serverList: newServerList,
      }))
      window.localStorage.setItem(
        LOCAL_STORAGE.SERVER_LIST,
        JSON.stringify(newServerList),
      )
      return true
    }
    return false
  }
  protected deleteServer = (idx: number): boolean => {
    const serverList = [...this.state.serverList]
    serverList.splice(idx, 1)
    this.setState(state => ({
      serverList,
    }))
    window.localStorage.setItem(
      LOCAL_STORAGE.SERVER_LIST,
      JSON.stringify(serverList),
    )
    return true
  }
  render () {
    return (
      <ConfigContext.Provider
        value={{
          ...this.state,
          addServer: this.addServer,
          deleteServer: this.deleteServer,
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
