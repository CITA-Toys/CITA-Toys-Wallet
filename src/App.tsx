import * as React from 'react'
import * as PropTypes from 'prop-types'
import 'normalize.css'
import { HashRouter as Router, Route } from 'react-router-dom'
import AsyncLoader from './components/AsyncLoader'
import theme from './config/theme'
// import routes from './routes'
const Header = AsyncLoader({
  loader: () => import(/* webpackChunkName: 'Header' */ './containers/Header/'),
})
const NetStatus = AsyncLoader({
  loader: () =>
    import(/* webpackChunkName: 'NetStatus' */ './containers/NetStatus/'),
})
const Procession = AsyncLoader({
  loader: () =>
    import(/* webpackChunkName: 'Procession' */ './containers/Procession/'),
})

// export default () => (
// <ThemeProvider theme={theme}>
// <Router>
//   <React.Fragment>{AsyncRoutes(routes)}</React.Fragment>
// </Router>
// </ThemeProvider>
// )

export default () => (
  <Router>
    <React.Fragment>
      <Route path="/" component={Header} />
      <Route path="/" component={NetStatus} />
      <Route path="/" exact component={Procession} />
    </React.Fragment>
  </Router>
)
