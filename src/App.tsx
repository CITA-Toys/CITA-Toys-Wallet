import * as React from 'react'
import 'normalize.css'
import { HashRouter as Router } from 'react-router-dom'
import { MuiThemeProvider } from '@material-ui/core/styles'
import Routes from './Routes'
import theme from './config/theme'
import { provideObservabls } from './contexts/observables'
import { provideConfig } from './contexts/config'

const App = () => (
  <MuiThemeProvider theme={theme}>
    <Router>
      <Routes />
    </Router>
  </MuiThemeProvider>
)

export default provideConfig(provideObservabls(App))
