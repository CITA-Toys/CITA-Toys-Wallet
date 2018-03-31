import * as React from 'react'
import 'normalize.css'
import { HashRouter as Router } from 'react-router-dom'
import theme from './config/theme'
import Routes from './Routes'
import { provideObservabls } from './contexts/observables'
import { provideConfig } from './contexts/config'

const App = () => (
  <Router>
    <Routes />
  </Router>
)

export default provideConfig(provideObservabls(App))
