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
        <svg className="icon" aria-hidden="true">
          <use xlinkHref="#icon-transactionpassword" />
        </svg>
        <ListItemText
          classes={{ primary: styles.primary, root: styles.listItemTextRoot }}
          primary={
            <React.Fragment>
              <span className={texts.ellipsis}>
                Transaction:{' '}
                <Link
                  to={`/transaction/${tx.hash}`}
                  href={`/transaction/${tx.hash}`}
                  className={texts.addr}
                >
                  {tx.hash}
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
              <div className={texts.ellipsis}>
                From:{' '}
                <Link
                  to={`/account/${tx.from}`}
                  href={`/account/${tx.from}`}
                  className={texts.addr}
                >
                  {tx.from || '_'}
                </Link>
              </div>
              <div className={texts.ellipsis}>
                To:{' '}
                <Link
                  to={`/account/${tx.to}`}
                  href={`/account/${tx.to}`}
                  className={texts.addr}
                >
                  {tx.to || '_'}
                </Link>
              </div>
              <div className={texts.ellipsis}>
                Value: <b className={styles.value}>{tx.value || 0}</b>
              </div>
            </div>
          }
        />
      </ListItem>
    ))}
  </List>
)
