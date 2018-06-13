import * as React from 'react'
import { Link } from 'react-router-dom'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
// import Avatar from '@material-ui/core/Avatar'
import { IBlock } from '../../typings/'

const texts = require('../../styles/text.scss')
const styles = require('./styles.scss')

export default ({ blocks }: { blocks: IBlock[] }) => (
  <List>
    {blocks.map((block: IBlock) => (
      <ListItem
        key={block.hash}
        classes={{
          root: styles.listItemContainer,
        }}
      >
        <div className={styles.blockIcon}>
          <span>Block</span>
          <Link
            to={`/height/${block.header.number}`}
            href={`/height/${block.header.number}`}
          >
            #{+block.header.number}
          </Link>
        </div>
        <ListItemText
          classes={{
            primary: styles.primary,
            secondary: styles.secondary,
            root: styles.listItemTextRoot,
          }}
          primary={
            <React.Fragment>
              <span>
                Hash:{' '}
                <Link to={`/block/${block.hash}`} href={`/block/${block.hash}`}>
                  <span className={texts.addr} title={block.hash}>
                    {block.hash.slice(0, 10)}...{block.hash.slice(56, 66)}
                  </span>
                </Link>
              </span>
              <span className={styles.time}>
                {Math.round((Date.now() - +block.header.timestamp) / 1000)}s ago
              </span>
            </React.Fragment>
          }
          secondary={
            <React.Fragment>
              Including <b>{block.body.transactions.length}</b> Transactions.{' '}
              <br />Proposed by{' '}
              <span className={texts.highlight}>
                {block.header.proof.Tendermint.proposal.slice(0, 20)}...
              </span>
            </React.Fragment>
          }
        />
      </ListItem>
    ))}
  </List>
)
