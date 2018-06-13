import * as React from 'react'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'

interface MetadataProps {
  on: boolean
  onClose: (e: any) => void
  onOpen: () => void
  children: React.ReactChild
}
// class RightSidebar extends React.Component<MetadataProps, {}> {
//   render() {
//     return (
//       <SwipeableDrawer
//         anchor="right"
//         open={this.props.on}
//         onClose={this.props.onClose}
//         onOpen={this.props.onOpen}
//       >
//         {this.props.children}
//       </SwipeableDrawer>
//     )
//   }
// }

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
