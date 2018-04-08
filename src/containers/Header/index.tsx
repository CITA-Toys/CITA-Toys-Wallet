import * as React from 'react'

import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import TextField from 'material-ui/TextField'
import MenuIcon from 'material-ui-icons/Menu'
import { DialogContent } from 'material-ui/Dialog'
import FingerprintIcon from 'material-ui-icons/Fingerprint'
import SettingsIcon from 'material-ui-icons/Settings'
import ViewCarouselIcon from 'material-ui-icons/ViewCarousel'
import FormatShapesIcon from 'material-ui-icons/FormatShapes'
import GraphicIcon from 'material-ui-icons/GraphicEq'
import { Link } from 'react-router-dom'
import { containers } from '../../Routes'
import { IContainerProps } from '../../typings/index.d'
import Dialog from '../Dialog'

const styles = require('./styles')

const icons = {
  Possession: <FingerprintIcon />,
  Blocks: <ViewCarouselIcon />,
  ContractEditor: <FormatShapesIcon />,
  Config: <SettingsIcon />,
  Graphs: <GraphicIcon />,
}
const initState = {
  keyword: '',
  settingsOn: false,
}
type HeaderState = typeof initState
interface HeaderProps extends IContainerProps {}

class Header extends React.Component<HeaderProps, HeaderState> {
  state = initState
  private handleInput = name => e => {
    this.setState(state => ({
      ...state,
      [name]: e.target.value,
    }))
  }
  private toggleSettings = (on = !this.state.settingsOn) => e => {
    this.setState(state => ({
      settingsOn: on,
    }))
  }
  render () {
    return (
      <React.Fragment>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="title" color="inherit">
              CITA TOYS
            </Typography>
            <div style={{ flexGrow: 1, display: 'flex' }}>
              {/* containers.filter(container => container.nav).map(container => (
              <Typography variant="subheading">
                <Link
                  to={container.path}
                  href={container.path}
                  className={styles.navItem}
                >
                  <IconButton color="inherit" aria-label={container.name}>
                    {icons[container.name]}
                  </IconButton>
                  <span>{container.name}</span>
                </Link>
              </Typography>
            )) */}
            </div>
            <div>
              <IconButton
                style={{ color: '#FFF' }}
                onClick={this.toggleSettings(true)}
              >
                <SettingsIcon />
              </IconButton>
              <TextField
                value={this.state.keyword}
                onChange={this.handleInput('keyword')}
              />
              Go
            </div>
          </Toolbar>
        </AppBar>
        <Dialog
          on={this.state.settingsOn}
          dialogTitle="Setting"
          onClose={this.toggleSettings(false)}
        >
          <DialogContent>Settings</DialogContent>
        </Dialog>
      </React.Fragment>
    )
  }
}

export default Header
