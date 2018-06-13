import * as React from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { Metadata } from '../../containers/Header'

const texts = require('../../styles/text')

/* eslint-disable no-restricted-globals */
// interface Settings {
//   id: string
//   name: string
//   operator: string
// }
/* eslint-enable no-restricted-globals */
export default ({ metadata }: { metadata: Metadata }) => (
  <List>
    <ListItem>
      <ListItemText primary={`Chain-ID: ${metadata.chainId}`} />
    </ListItem>
    <ListItem>
      <ListItemText primary={`Chain-Name: ${metadata.chainName}`} />
    </ListItem>
    <ListItem>
      <ListItemText primary={`Operator: ${metadata.operator}`} />
    </ListItem>
    <ListItem>
      <ListItemText
        primary={
          <span>
            Website:{' '}
            <a
              href={metadata.website}
              className={texts.addr}
              target="_blank"
              rel="noreferrer noopener"
            >
              {metadata.website}
            </a>
          </span>
        }
      />
    </ListItem>
    <ListItem>
      <ListItemText
        primary={`Genesis Time: ${new Date(
          +metadata.genesisTimestamp
        ).toLocaleString()}`}
      />
    </ListItem>
    <ListItem>
      <ListItemText primary={`Interval: ${metadata.blockInterval}ms`} />
    </ListItem>
    <ListItem>
      <ListItemText
        primary="Validators:"
        secondary={metadata.validators.map(val => (
          <p key={val} className={texts.highlight}>
            {val}
          </p>
        ))}
      />
    </ListItem>
  </List>
)
