import * as React from 'react'
import { Link } from 'react-router-dom'
import { LinearProgress } from 'material-ui/Progress'
import Paper from 'material-ui/Paper'
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card'
import List, { ListItem, ListItemText } from 'material-ui/List'
import Typography from 'material-ui/Typography'
import ExpandMore from 'material-ui-icons/ExpandMore'
import IconButton from 'material-ui/IconButton'
import BackIcon from 'material-ui-icons/ArrowBack'
import NextIcon from 'material-ui-icons/ArrowForward'

import { withConfig } from '../../contexts/config'
import { withObservables } from '../../contexts/observables'
import { IContainerProps, IBlock } from '../../typings'
import Dialog from '../Dialog/'
import TransactionList from '../../components/TransactionList/'

const layouts = require('../../styles/layout')
const texts = require('../../styles/text.scss')
const styles = require('./styles')

interface IBlockState extends IBlock {
  transactionsOn: boolean
}
const initState: IBlockState = {
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
}

interface IBlockProps extends IContainerProps {}
class Block extends React.Component<IBlockProps, IBlockState> {
  readonly state = initState
  componentWillMount () {
    const { blockHash, height } = this.props.match.params
    if (blockHash) {
      this.props.CITAObservables.blockByHash(blockHash).subscribe(
        (block: IBlock) => {
          this.setState(state => ({ ...block }))
        },
      )
    }
    if (height) {
      this.props.CITAObservables.blockByNumber(height).subscribe(
        (block: IBlock) => {
          this.setState(state => ({ ...block }))
        },
      )
    }
  }
  private toggleTransaction = (on: boolean = false) => e => {
    this.setState(state => ({
      ...state,
      transactionsOn: on,
    }))
  }
  private headerInfo = [
    { key: 'gasUsed', label: 'Gas Used' },
    { key: 'receiptsRoot', label: 'Receipts Root' },
    { key: 'stateRoot', label: 'State Root' },
    { key: 'transactionsRoot', label: 'Transactions Root' },
  ]

  render () {
    const { body: { transactions }, hash, header, transactionsOn } = this.state
    return (
      <React.Fragment>
        {hash ? '' : <LinearProgress />}
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
                    primary="MinedBy"
                    secondary={header.proof.Tendermint.proposal}
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
      </React.Fragment>
    )
  }
}
export default withConfig(withObservables(Block))
