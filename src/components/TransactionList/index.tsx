import * as React from 'react'
import { Link } from 'react-router-dom'
import List, { ListItem, ListItemText } from 'material-ui/List'
import { Transaction } from '../../typings/'

const texts = require('../../styles/text.scss')
const styles = require('./styles.scss')

export default ({ transactions }: { transactions: Transaction[] }) => (
  <List>
    {transactions.map(tx => (
      <ListItem key={tx.hash}>
        <ListItemText
          classes={{ primary: styles.primary }}
          primary={
            <React.Fragment>
              <Link
                to={`/transaction/${tx.hash}`}
                href={`/transaction/${tx.hash}`}
              >
                <h1 className={styles.txHash}>
                  TXID: <span className={texts.addr}>{tx.hash}</span>
                </h1>
              </Link>
              <span>
                {/* new Date(+tx.timestamp).toLocaleString() */}(time of the tx)
              </span>
            </React.Fragment>
          }
          secondary={
            <div>
              From <span className={texts.addr}>{/* tx.from */}(from)</span> TO{' '}
              <span className={texts.addr}>{/* tx.to */}(to)</span> Value{' '}
              <span className={texts.highlight}>(Value)</span>
            </div>
          }
        />
      </ListItem>
    ))}
  </List>
)
