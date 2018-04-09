import * as React from 'react'
import { Link } from 'react-router-dom'
import List, { ListItem, ListItemText } from 'material-ui/List'
import { Transaction } from '../../typings/'

const texts = require('../../styles/text.scss')
const styles = require('./styles.scss')

export default ({ transactions }: { transactions: Transaction[] }) => (
  <List>
    {transactions.map(tx => (
      <ListItem key={tx.id}>
        <ListItemText
          primary={
            <div className={styles.listItemPrimary}>
              <Link to={`/transaction/${tx.id}`} href={`/transaction/${tx.id}`}>
                <h1 className={texts.addr}>{tx.id}</h1>
              </Link>
              <span>{new Date(+tx.timestamp).toLocaleString()}</span>
            </div>
          }
          secondary={
            <div>
              From <span className={texts.addr}>{tx.from}</span> TO{' '}
              <span className={texts.addr}>{tx.to}</span>
            </div>
          }
        />
      </ListItem>
    ))}
  </List>
)
