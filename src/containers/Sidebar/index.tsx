import * as React from 'react'
import Drawer from 'material-ui/Drawer'
import List, { ListItem, ListItemText } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import { withStyles } from 'material-ui/styles'
import { containers } from '../../Routes'

const styles = theme => ({
  toolbar: theme.mixins.toolbar,
})

/* eslint-disable no-restricted-globals */
interface ISidebarProps {
  classes: {
    toolbar: string
  }
}
/* eslint-enable no-restricted-globals */

const Sidebar: React.SFC<ISidebarProps> = () => (
  <Drawer variant="permanent">
    <div className={this.props.classes.toolbar} />
    <List>
      {containers.filter(container => container.path !== '/').map(container => (
        <ListItem>
          <ListItemText primary={container.name} />
        </ListItem>
      ))}
    </List>
  </Drawer>
)
export default withStyles(styles)(Sidebar)
