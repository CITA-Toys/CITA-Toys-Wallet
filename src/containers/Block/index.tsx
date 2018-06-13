import * as React from 'react'
import { Link } from 'react-router-dom'
import LinearProgress from '@material-ui/core/LinearProgress'
import Paper from '@material-ui/core/Paper'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Snackbar from '@material-ui/core/Snackbar/'
import Typography from '@material-ui/core/Typography'

import ExpandMore from '@material-ui/icons/ExpandMore'
import IconButton from '@material-ui/core/IconButton'
import BackIcon from '@material-ui/icons/ArrowBack'
import NextIcon from '@material-ui/icons/ArrowForward'
import CloseIcon from '@material-ui/icons/Close'

import { withConfig } from '../../contexts/config'
import { withObservables } from '../../contexts/observables'
import { IContainerProps, IBlock } from '../../typings'
import Dialog from '../Dialog/'
import TransactionList from '../../components/TransactionList/'
import ErrorNotification from '../../components/ErrorNotification'

const layouts = require('../../styles/layout')
const texts = require('../../styles/text.scss')
const styles = require('./styles')

interface IBlockState extends IBlock {
  loading: number
  transactionsOn: boolean
  error: {
    message: string
    code: string
  }
}

const initState: IBlockState = {
  loading: 0,
  hash: '',
  header: {
    timestamp: '',
    prevHash: '',
    number: '',
    stateRoot: '',
    transactionsRoot: '',
    receiptsRoot: '',
    gasUsed: '',
    proof: {
      Tendermint: {
        proposal: '',
      },
    },
  },
  body: {
    transactions: [],
  },
  version: 0,
  transactionsOn: false,
  error: {
    message: '',
    code: '',
  },
}

interface IBlockProps extends IContainerProps {}
class Block extends React.Component<IBlockProps, IBlockState> {
  readonly state = initState
  componentWillMount () {
    this.onMount(this.props.match.params)
  }
  componentWillReceiveProps (nextProps: IBlockProps) {
    const { blockHash, height } = nextProps.match.params
    const {
      blockHash: oldBlockHash,
      height: oldHeight,
    } = this.props.match.params
    if (
      (blockHash && blockHash !== oldBlockHash) ||
      (height && height !== oldHeight)
    ) {
      this.onMount(nextProps.match.params)
    }
  }
  onMount = params => {
    const { blockHash, height } = params
    if (blockHash) {
      this.setState(state => ({ loading: state.loading + 1 }))
      this.props.CITAObservables.blockByHash(blockHash)
        .finally(() => this.setState(state => ({ loading: state.loading - 1 })))
        .subscribe(
          // next
          (block: IBlock) => this.handleReturnedBlock(block),
          // error
          error => this.setState(state => ({ error })),
          // complete
          () => {},
        )
    }
    if (height) {
      this.setState(state => ({ loading: state.loading + 1 }))
      this.props.CITAObservables.blockByNumber(height)
        .finally(() => this.setState(state => ({ loading: state.loading - 1 })))
        .subscribe(
          // next
          (block: IBlock) => {
            this.handleReturnedBlock(block)
          },

          // error
          error => this.setState(state => ({ error })),
          // complete
          () => {},
        )
    }
  }
  private handleReturnedBlock = (block: IBlock) => {
    if (!block) {
      this.setState(state => ({
        error: {
          message: 'Block Not Found',
          code: '-1',
        },
      }))
    }
    /* eslint-disable */
    block.body.transactions = block.body.transactions.map(tx => ({
      ...tx,
      timestamp: `${block.header.timestamp}`,
    }))
    /* eslint-enable */
    return this.setState(state => ({ ...block }))
  }
  private toggleTransaction = (on: boolean = false) => e => {
    this.setState(state => ({
      ...state,
      transactionsOn: on,
    }))
  }

  private dismissNotification = e => {
    console.log('clicked')
    this.setState(state => ({
      error: {
        message: '',
        code: '',
      },
    }))
  }
  private headerInfo = [
    { key: 'gasUsed', label: 'Gas Used' },
    { key: 'receiptsRoot', label: 'Receipts Root' },
    { key: 'stateRoot', label: 'State Root' },
    { key: 'transactionsRoot', label: 'Transactions Root' },
  ]

  render () {
    const {
      loading,
      body: { transactions },
      hash,
      header,
      transactionsOn,
      error,
    } = this.state
    return (
      <React.Fragment>
        {loading ? <LinearProgress /> : null}
        <div className={layouts.main}>
          <Card>
            <CardHeader
              title={
                <div className={styles.blockHeader}>
                  Block: <span className={texts.addr}>{hash}</span>
                </div>
              }
              subheader={`${header.timestamp &&
                new Date(+header.timestamp).toLocaleString()}`}
              action={
                <div className={styles.blockHeader}>
                  <Link
                    to={`/height/0x${(+header.number - 1).toString(16)}`}
                    href={`/height/0x${(+header.number - 1).toString(16)}`}
                  >
                    <IconButton>
                      <BackIcon />
                    </IconButton>
                  </Link>
                  {header.number}
                  <Link
                    to={`/height/0x${(+header.number + 1).toString(16)}`}
                    href={`/height/0x${(+header.number + 1).toString(16)}`}
                  >
                    <IconButton>
                      <NextIcon />
                    </IconButton>
                  </Link>
                </div>
              }
              classes={{ subheader: styles.subheader }}
            />
            <CardContent>
              <List>
                <ListItem
                  onClick={this.toggleTransaction(true)}
                  style={{ cursor: 'pointer' }}
                >
                  <ListItemText
                    primary="Count of Transactions"
                    secondary={transactions.length}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    classes={{ secondary: texts.hash }}
                    primary="Mined By"
                    secondary={
                      header.proof &&
                      header.proof.Tendermint &&
                      header.proof.Tendermint.proposal
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Parent Hash"
                    secondary={
                      <Link
                        to={`/block/${header.prevHash}`}
                        href={`/block/${header.prevHash}`}
                        className={texts.addr}
                      >
                        {header.prevHash}
                      </Link>
                    }
                  />
                </ListItem>
                {this.headerInfo.map(item => (
                  <ListItem key={item.key}>
                    <ListItemText
                      classes={{ secondary: texts.hash }}
                      primary={item.label}
                      secondary={header[item.key]}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </div>
        <Dialog
          on={transactionsOn}
          onClose={this.toggleTransaction()}
          dialogTitle="交易列表"
        >
          <TransactionList transactions={transactions} />
        </Dialog>
        <ErrorNotification
          error={error}
          dismissNotification={this.dismissNotification}
        />
      </React.Fragment>
    )
  }
}
export default withConfig(withObservables(Block))
