import * as React from 'react'
import { Link } from 'react-router-dom'
import List, { ListItem, ListItemText } from 'material-ui/List'
import { IBlock } from '../../typings/'

const texts = require('../../styles/text.scss')
const styles = require('./styles.scss')

export default ({ blocks }: { blocks: IBlock[] }) => (
  <List>
    {blocks.map((block: IBlock) => (
      <ListItem key={block.hash}>
        <ListItemText
          classes={{
            primary: styles.primary,
            secondary: styles.secondary,
          }}
          primary={
            <React.Fragment>
              <Link to={`/block/${block.hash}`} href={`/block/${block.hash}`}>
                <h1 className={texts.addr}>{block.hash}</h1>
              </Link>
              <span>{new Date(+block.header.timestamp).toLocaleString()}</span>
            </React.Fragment>
          }
          secondary={
            <span>
              Including{' '}
              <span className={texts.highlight}>
                {block.body.transactions.length}
              </span>{' '}
              Transactions at Height of{' '}
              <Link
                to={`/height/${block.header.number}`}
                href={`/height/${block.header.number}`}
                className={texts.highlight}
              >
                {+block.header.number}
              </Link>, mined by{' '}
              <span className={texts.highlight}>
                {block.header.proof.Tendermint.proposal}
              </span>
            </span>
          }
        />
      </ListItem>
    ))}
  </List>
)
