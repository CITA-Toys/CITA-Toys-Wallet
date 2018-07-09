import * as React from 'react'
import { Link } from 'react-router-dom'
import { translate } from 'react-i18next'
import {
  Typography,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  AppBar,
} from '@material-ui/core'
import { Menu as MenuIcon } from '@material-ui/icons'

const styles = require('../../containers/Header/header.scss')

const SidebarNavs = ({
  open,
  containers,
  pathname,
  toggleSideNavs,
  logo,
  t,
}) => (
  <Drawer open={open} onClose={toggleSideNavs()}>
    <AppBar position="sticky">
      <Toolbar
        classes={{
          root: styles.toolbarRoot,
        }}
      >
        <Link
          to="/"
          href="/"
          onClick={toggleSideNavs()}
          style={{ color: '#000', marginRight: '31px' }}
        >
          <Typography variant="title" color="inherit">
            <img src={logo} alt="logo" className={styles.headerLogo} />
          </Typography>
        </Link>
        <IconButton
          aria-label="open drawer"
          onClick={toggleSideNavs()}
          classes={{ root: styles.toggleIcon }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
    <List>
      {containers.filter(container => container.nav).map(container => (
        <ListItem key={container.name}>
          <ListItemText
            primary={
              <Link
                to={container.path}
                href={container.path}
                className={`${styles.navItem} ${
                  pathname === container.path ? styles.activeNav : ''
                }`}
                onClick={toggleSideNavs()}
              >
                <span>{t(container.name)}</span>
              </Link>
            }
          />
        </ListItem>
      ))}
    </List>
  </Drawer>
)
export default translate('microscope')(SidebarNavs)
