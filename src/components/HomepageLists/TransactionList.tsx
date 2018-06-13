import * as React from 'react'
import { Link } from 'react-router-dom'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { Transaction, TransactionFromServer } from '../../typings/'

const texts = require('../../styles/text.scss')
const styles = require('./styles.scss')

export default ({
  transactions,
}: {
transactions: TransactionFromServer[]
}) => (
  <List>
    {transactions.map(tx => (
      <ListItem key={tx.hash} classes={{ root: styles.listItemContainer }}>
        <ListItemText
          classes={{ primary: styles.primary, root: styles.listItemTextRoot }}
          primary={
            <React.Fragment>
              <span>
                Transaction:{' '}
                <Link
                  to={`/transaction/${tx.hash}`}
                  href={`/transaction/${tx.hash}`}
                >
                  <span className={styles.txHash}>
                    <span className={texts.addr}>
                      {tx.hash.slice(0, 10)}...{tx.hash.slice(56, 66)}
                    </span>
                  </span>
                </Link>
              </span>
              <span className={styles.time}>
                {tx.timestamp &&
                  Math.round((Date.now() - +tx.timestamp) / 1000)}s ago
              </span>
            </React.Fragment>
          }
          secondary={
            <div className={styles.txInfo}>
              <span>
                From:{' '}
                <Link
                  to={`/account/${tx.from}`}
                  href={`/account/${tx.from}`}
                  className={texts.addr}
                >
                  {tx.from || '_'}
                </Link>{' '}
                <br /> To:{' '}
                <Link
                  to={`/account/${tx.to}`}
                  href={`/account/${tx.to}`}
                  className={texts.addr}
                >
                  {tx.to || '_'}
                </Link>
              </span>
              <span>
                Value: <b className={styles.value}>{tx.value || 0}</b>
              </span>
            </div>
          }
        />
      </ListItem>
    ))}
  </List>
)
