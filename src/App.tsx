import * as React from 'react'
import 'normalize.css'
import { HashRouter as Router } from 'react-router-dom'
import theme from './config/theme'
import Routes from './Routes'

export default () => (
  <Router>
    <Routes />
  </Router>
)
