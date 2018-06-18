import * as React from 'react'
import { Link } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'

const styles = require('../../containers/Header/styles.scss')

const HeaderNavs = ({ containers, pathname }) => (
  <React.Fragment>
    <Link to="/" href="/" className={styles.headerNavIcon}>
      <Typography variant="title" color="inherit">
        {(process.env.APP_NAME as string).toUpperCase()}
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
            <span>{container.name}</span>
          </Link>
        </Typography>
      ))}
    </div>
  </React.Fragment>
)
export default HeaderNavs
