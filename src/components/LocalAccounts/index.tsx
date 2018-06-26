import * as React from 'react'
import { Link } from 'react-router-dom'

import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  ExpansionPanelActions,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Button,
} from '@material-ui/core'
import {
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@material-ui/icons'

const texts = require('../../styles/text.scss')
const styles = require('./styles.scss')
/* eslint-disable no-restricted-globals */
export interface LocalAccount {
  name: string
  abi?: string
  addr: string
}
/* eslint-enable no-restricted-globals */

export default props =>
  props.addrGroups.map(group => (
    <ExpansionPanel key={group.key}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="body1">
          Including: {props[group.key].length} {group.label}(s)
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <List style={{ width: '100%' }}>
          {props[group.key].length ? (
            props[group.key].map((item: LocalAccount, index) => (
              <ListItem key={item.addr}>
                <ListItemText
                  classes={{
                    root: styles.addrItem,
                  }}
                  primary={item.name}
                  secondary={
                    <Link
                      href={`/account/${item.addr}`}
                      to={`/account/${item.addr}`}
                      className={texts.addr}
                    >
                      {item.addr}
                    </Link>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    onClick={props.handleAddrDelete(group.key, index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="暂无记录" />
            </ListItem>
          )}
        </List>
      </ExpansionPanelDetails>
      <ExpansionPanelActions>
        <TextField
          value={props[`${group.key}Add`].name}
          placeholder="name"
          onChange={props.handleAddrInput(group.key, 'name')}
        />
        <TextField
          value={props[`${group.key}Add`].addr}
          placeholder="address"
          onChange={props.handleAddrInput(group.key, 'addr')}
        />
        <Button
          variant="fab"
          mini
          color="primary"
          onClick={props.addAddr(group.key)}
        >
          <AddIcon />
        </Button>
      </ExpansionPanelActions>
    </ExpansionPanel>
  ))
