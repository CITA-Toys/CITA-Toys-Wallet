import * as React from 'react'
import { createPortal } from 'react-dom'

const Footer = () => <div>footer</div>

export default () =>
  createPortal(<Footer />, document.getElementById('footer') as HTMLElement)
