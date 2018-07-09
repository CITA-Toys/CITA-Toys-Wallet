import * as React from 'react'
import { Link } from 'react-router-dom'
import { translate } from 'react-i18next'
import { Typography } from '@material-ui/core'

const styles = require('../../containers/Header/header.scss')

const HeaderNavs = ({ containers, pathname, logo, t }) => (
  <React.Fragment>
    <Link to="/" href="/" className={styles.headerNavIcon}>
      <Typography variant="title" color="inherit">
        <img src={logo} alt="logo" className={styles.headerLogo} />
      </Typography>
    </Link>
    <div className={styles.headerNavs}>
      {containers.filter(container => container.nav).map(container => (
        <Typography variant="subheading" key={container.name}>
          <Link
            to={container.path}
            href={container.path}
            className={`${styles.navItem} ${
              pathname === container.path ? styles.activeNav : ''
            }`}
          >
            <span>{t(container.name)}</span>
          </Link>
        </Typography>
      ))}
    </div>
  </React.Fragment>
)
export default translate('microscope')(HeaderNavs)
