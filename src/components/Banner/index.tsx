import * as React from 'react'

const styles = require('./banner.scss')

const Banner = ({ bg, children }) => (
  <div
    className={styles.banner}
    style={{
      backgroundImage: `url(${bg})`,
    }}
  >
    {children}
  </div>
)
export default Banner
