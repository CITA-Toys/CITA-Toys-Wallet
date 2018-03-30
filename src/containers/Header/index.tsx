import * as React from 'react'

import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import MenuIcon from 'material-ui-icons/Menu'
import { Link } from 'react-router-dom'
import { containers } from '../../Routes'

function ButtonAppBar (props) {
  return (
    <AppBar position="static">
      <Toolbar>
        {/*
        <IconButton color="inherit" aria-label="Menu">
          <MenuIcon />
        </IconButton>
      */}
        <Typography variant="title" color="inherit">
          CITA TOYS
        </Typography>
        {containers
          .filter(container => container.path !== '/')
          .map(container => (
            <Typography variant="subheading">
              <Link
                to={container.path}
                href={container.path}
                style={{
                  padding: '0 15px',
                  color: '#fff',
                  textDecoration: 'none',
                }}
              >
                {container.name}
              </Link>
            </Typography>
          ))}
        {/*
        <Button color="inherit">Login</Button>
        */}
      </Toolbar>
    </AppBar>
  )
}

export default ButtonAppBar
