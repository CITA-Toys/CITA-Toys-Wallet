import * as React from 'react'
import { Link } from 'react-router-dom'
import { translate } from 'react-i18next'
import { List, ListItem, ListItemText } from '@material-ui/core'
import { Transaction, TransactionFromServer } from '../../typings/'

const texts = require('../../styles/text.scss')
const styles = require('./homepageList.scss')

export default translate('microscope')(
  ({
    transactions,
    t,
  }: {
  transactions: TransactionFromServer[]
  t: (key: string) => string
  }) => (
    <List
      classes={{
        padding: styles.listPadding,
      }}
    >
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
                  {t('transaction')}:{' '}
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
                  {t('from')}:{' '}
                  <Link
                    to={`/account/${tx.from}`}
                    href={`/account/${tx.from}`}
                    className={texts.addr}
                  >
                    {tx.from || '_'}
                  </Link>
                </div>
                <div className={texts.ellipsis}>
                  {t('to')}:{' '}
                  <Link
                    to={`/account/${tx.to}`}
                    href={`/account/${tx.to}`}
                    className={texts.addr}
                  >
                    {tx.to || '_'}
                  </Link>
                </div>
                <div className={texts.ellipsis}>
                  {t('value')}:{' '}
                  <span className={styles.value} title={`${tx.value}`}>
                    {tx.value || 0}
                  </span>
                </div>
              </div>
            }
          />
        </ListItem>
      ))}
    </List>
  ),
)
