import * as React from 'react'
import List, { ListItem, ListItemText } from 'material-ui/List'

/* eslint-disable no-restricted-globals */
interface Settings {
  id: string
  name: string
  operator: string
}
/* eslint-enable no-restricted-globals */
export default ({ settings }: { settings: Settings }) => (
  <List>
    <ListItem>
      <ListItemText primary={`CITA-ID: ${settings.id}`} />
    </ListItem>
    <ListItem>
      <ListItemText primary={`Name: ${settings.name}`} />
    </ListItem>
    <ListItem>
      <ListItemText primary={`Operator: ${settings.operator}`} />
    </ListItem>
  </List>
)
