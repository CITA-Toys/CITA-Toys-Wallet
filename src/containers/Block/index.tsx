import * as React from 'react'
import { Link } from 'react-router-dom'
import {
  LinearProgress,
  Card,
  CardContent,
  List,
  ListItem,
} from '@material-ui/core'

import Banner from '../../components/Banner'

import { withConfig } from '../../contexts/config'
import { withObservables } from '../../contexts/observables'
import { IContainerProps, IBlock } from '../../typings'
import Dialog from '../Dialog/'
import TransactionList from '../../components/TransactionList/'
import ErrorNotification from '../../components/ErrorNotification'
import hideLoader from '../../utils/hideLoader'

const layouts = require('../../styles/layout')
const texts = require('../../styles/text.scss')
const styles = require('./block.scss')

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
  componentDidMount () {
    hideLoader()
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
        {loading ? (
          <LinearProgress
            classes={{
              root: 'linearProgressRoot',
            }}
          />
        ) : null}
        <Banner bg={`${process.env.PUBLIC}/banner/banner-Block.png`}>
          <div>Block</div>
          <div className={styles.height}>
            <Link
              to={`/height/0x${(+header.number - 1).toString(16)}`}
              href={`/height/0x${(+header.number - 1).toString(16)}`}
            >
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-left" />
              </svg>
            </Link>
            # {header.number}
            <Link
              to={`/height/0x${(+header.number + 1).toString(16)}`}
              href={`/height/0x${(+header.number + 1).toString(16)}`}
            >
              <svg
                className="icon"
                aria-hidden="true"
                style={{ transform: 'rotate(180deg)' }}
              >
                <use xlinkHref="#icon-left" />
              </svg>
            </Link>
          </div>
        </Banner>
        <div className={layouts.main}>
          <Card
            classes={{
              root: styles.hashCardRoot,
            }}
          >
            <CardContent>
              <div className={styles.hashTitle}>Block Hash</div>
              <div className={styles.hashText}>{hash}</div>
            </CardContent>
          </Card>
          <Card classes={{ root: layouts.cardContainer }}>
            <CardContent>
              <List className={styles.items}>
                <ListItem
                  onClick={this.toggleTransaction(true)}
                  style={{ cursor: 'pointer' }}
                >
                  <span className={styles.itemTitle}>Transactions</span>
                  <span>{transactions.length}</span>
                </ListItem>
                <ListItem>
                  <span className={styles.itemTitle}>Proposer</span>
                  <span className={texts.hash}>
                    {header.proof &&
                      header.proof.Tendermint &&
                      header.proof.Tendermint.proposal}
                  </span>
                </ListItem>
                <ListItem>
                  <span className={styles.itemTitle}>Parent Hash</span>
                  <span>
                    <Link
                      to={`/block/${header.prevHash}`}
                      href={`/block/${header.prevHash}`}
                      className={texts.addr}
                    >
                      {header.prevHash}
                    </Link>
                  </span>
                </ListItem>
                {this.headerInfo.map(item => (
                  <ListItem key={item.key}>
                    <span className={styles.itemTitle}>{item.label}</span>
                    <span>{header[item.key]}</span>
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
