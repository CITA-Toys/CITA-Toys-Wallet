import * as React from 'react'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'

interface MetadataProps {
  on: boolean
  onClose: (e: any) => void
  onOpen: () => void
  children: React.ReactChild
}

const RightSidebar: React.SFC<MetadataProps> = ({
  on,
  onClose,
  onOpen,
  children,
}) => (
  <SwipeableDrawer anchor="right" open={on} onClose={onClose} onOpen={onOpen}>
    {children}
  </SwipeableDrawer>
)

export default RightSidebar
