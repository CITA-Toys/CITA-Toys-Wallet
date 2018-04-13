import * as React from 'react'
import { Link } from 'react-router-dom'
import { LinearProgress } from 'material-ui/Progress'
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card'
import List, { ListItem, ListItemText } from 'material-ui/List'
import Typography from 'material-ui/Typography'

import { withObservables } from '../../contexts/observables'
import { IContainerProps, DetailedTransaction } from '../../typings/'
import ErrorNotification from '../../components/ErrorNotification'

const layouts = require('../../styles/layout.scss')
const texts = require('../../styles/text.scss')
const styles = require('./styles.scss')

interface TransactionProps extends IContainerProps {}

interface TransactionState extends DetailedTransaction {
  error: {
    message: string
    code: string
  }
}
const initState: TransactionState = {
  hash: '',
  blockHash: '',
  blockNumber: '',
  index: '',
  content: '',
  error: {
    message: '',
    code: '',
  },
}
class Transaction extends React.Component<TransactionProps, TransactionState> {
  readonly state = initState
  componentWillMount () {
    const { transaction } = this.props.match.params
    if (transaction) {
      this.props.CITAObservables.getTransaction(transaction).subscribe(
        // next
        (tx: DetailedTransaction) => {
          this.setState(state => ({ ...tx }))
        },
        // error
        error => {
          this.setState(state => ({ error }))
        },

        // complete
        () => {},
      )
    }
  }
  private infos = [
    { key: 'index', label: 'Index' },
    {
      key: 'content',
      label: 'Content',
    },
  ]

  private dismissNotification = e => {
    this.setState(state => ({
      error: {
        message: '',
        code: '',
      },
    }))
  }
  render () {
    const { hash, blockHash, blockNumber, content, index, error } = this.state
    return (
      <React.Fragment>
        {hash ? '' : <LinearProgress />}
        <div className={layouts.main}>
          <Card>
            <CardHeader
              title={
                <div className={styles.txHeader}>
                  Transaction: <span className={texts.addr}>{hash}</span>
                </div>
              }
              subheader="time"
            />
            <CardContent>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Block: "
                    secondary={
                      <Link
                        to={`/block/${blockHash}`}
                        href={`/block/${blockHash}`}
                        className={texts.addr}
                      >
                        {blockHash}
                      </Link>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Height: "
                    secondary={
                      <Link
                        to={`/height/${blockNumber}`}
                        href={`/height/${blockNumber}`}
                        className={texts.addr}
                      >
                        {blockNumber}
                      </Link>
                    }
                  />
                </ListItem>
                {this.infos.map(info => (
                  <ListItem key={info.key}>
                    <ListItemText
                      classes={{
                        primary: styles.txHeader,
                        secondary: styles.subheader,
                      }}
                      primary={info.label}
                      secondary={this.state[info.key]}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </div>
        <ErrorNotification
          error={error}
          dismissNotification={this.dismissNotification}
        />
      </React.Fragment>
    )
  }
}

export default withObservables(Transaction)
