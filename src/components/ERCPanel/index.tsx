import * as React from 'react'
// import Card, { CardHeader, CardContent } from 'material-ui/Card'
import List, { ListItem, ListItemText } from 'material-ui/List'
import TextField from 'material-ui/TextField'
import IconButton from 'material-ui/IconButton'
import SearchIcon from 'material-ui-icons/Search'
import ArrowIcon from 'material-ui-icons/TrendingFlat'

const Item = ({ label, field }) => (
  <ListItem>
    <ListItemText
      primary={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {label} <ArrowIcon /> {field}
        </div>
      }
    />
  </ListItem>
)
/* eslint-disable no-restricted-globals */
interface ErcPanel {
  name: string
  totalSupply: string
  decimals: string
  version: string
  paused: boolean
  owner: string
  symbol: string
}
/* eslint-enable no-restricted-globals */

const ERCPanel: React.SFC<ErcPanel> = props => (
  <List>
    <Item label="name" field={props.name} />
    <Item label="totalSupply" field={props.totalSupply} />
    <Item label="decimals" field={props.decimals} />
    <Item label="version" field={props.version} />
    <Item label="paused" field={props.paused} />
    <Item
      label="balanceOf"
      field={
        <React.Fragment>
          <TextField value="" placeholder="owner address" />
          <span>is how</span>
          <IconButton>
            <SearchIcon />
          </IconButton>
        </React.Fragment>
      }
    />
    <Item label="owner" field={props.owner} />
    <Item label="symbol" field={props.symbol} />
    <Item
      label="allowance"
      field={
        <React.Fragment>
          <TextField value="" placeholder="owner address" />,{' '}
          <TextField value="" placeholder="spender address" />
          <span>is how</span>
          <IconButton>
            <SearchIcon />
          </IconButton>
        </React.Fragment>
      }
    />
  </List>
)

export default ERCPanel
