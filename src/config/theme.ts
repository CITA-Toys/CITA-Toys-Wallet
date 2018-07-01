// import colors, { COLORS } from './colors'
// import sizes, { SIZES } from './sizes'
import { createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#FFF',
    },
  },
  props: {
    MuiAppBar: {
      elevation: 0,
    },
  },
})

export default theme
