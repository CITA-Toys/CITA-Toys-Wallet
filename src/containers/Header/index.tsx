import * as React from 'react'

import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import MenuIcon from 'material-ui-icons/Menu'
import FingerprintIcon from 'material-ui-icons/Fingerprint'
import SettingsIcon from 'material-ui-icons/Settings'
import ViewCarouselIcon from 'material-ui-icons/ViewCarousel'
import FormatShapesIcon from 'material-ui-icons/FormatShapes'
import { Link } from 'react-router-dom'
import { containers } from '../../Routes'

const styles = require('./styles')

const icons = {
  Possession: <FingerprintIcon />,
  Blocks: <ViewCarouselIcon />,
  ContractEditor: <FormatShapesIcon />,
  Config: <SettingsIcon />,
}

function ButtonAppBar (props) {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="title" color="inherit">
          CITA TOYS
        </Typography>
        {containers.filter(container => container.nav).map(container => (
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
        ))}
      </Toolbar>
    </AppBar>
  )
}

export default ButtonAppBar
