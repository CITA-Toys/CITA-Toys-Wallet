import * as L from 'react-loadable'
import LoadingPage from '../Loading'

const AsyncLoader = opts =>
  L({
    loading: LoadingPage,
    delay: 300,
    ...opts,
  })

export default AsyncLoader
