// 系统概览: 累计区块总数; 平均出块时间(最近10块); 平均 TPS(最近10块); 默认 Token 总发行数

// 节点健康信息

// 最新区块列表, 默认10, 无需刷新
// 出块高度, 出块人, 出块时间, 交易量

// 最新交易列表, 默认10, 无需刷新

import * as React from 'react'
import { Link } from 'react-router-dom'
import Typography from 'material-ui/Typography'
import Zoom from 'material-ui/transitions/Zoom'
import List, { ListItem, ListItemText } from 'material-ui/List'
import { LinearProgress } from 'material-ui/Progress'
import { IContainerProps, IBlock, Transaction } from '../../typings'
import { withObservables } from '../../contexts/observables'
import StaticCard from '../../components/StaticCard'
import BlockList from '../../components/BlockList'
import TransactionList from '../../components/TransactionList/'
import ErrorNotification from '../../components/ErrorNotification'

const layout = require('../../styles/layout.scss')
const texts = require('../../styles/text.scss')
const styles = require('./styles.scss')

interface HomepageProps extends IContainerProps {}

const initState = {
  loading: 0,
  blocks: [] as IBlock[],
  transactions: [] as Transaction[],
  generals: {
    tps: '',
    duration: '',
    blockCount: '',
    tokenCount: '',
  },
  healthy: {
    count: '',
  },
  error: {
    code: '',
    message: '',
  },
}
type HomepageState = typeof initState
class Homepage extends React.Component<HomepageProps, HomepageState> {
  state = initState
  componentWillMount () {
    this.setState(state => ({ loading: state.loading + 1 }))
    this.props.CITAObservables.newBlockNumber(0, false)
      .finally(() => this.setState(state => ({ loading: state.loading - 1 })))
      .subscribe(
        // next
        blockNumber => this.blockHistory({ height: blockNumber, count: 10 }),
        // error
        error => this.setState(state => ({ error })),
        // complete
        () => {},
      )
  }
  private generals = [
    { key: 'tps', label: '平均 TPS' },
    { key: 'duration', label: '平均出块时间' },
    { key: 'blockCount', label: '累计区块总数' },
    { key: 'tokenCount', label: '默认 Token 总发行数' },
  ]
  private blkInfo = [
    { key: 'height', label: '出块高度' },
    { key: 'owner', label: '出块人' },
    { key: 'time', label: '出块时间' },
    { key: 'txCount', label: '交易量' },
  ]

  private blockHistory = ({ height, count }) => {
    this.props.CITAObservables.blockHistory({
      by: height,
      count,
    }).subscribe((blocks: IBlock[]) => {
      const blockCount = blocks.length
      const totalDuration =
        (+blocks[0].header.timestamp -
          +blocks[blockCount - 1].header.timestamp) /
        1000
      if (blockCount > 0) {
        // get tps
        const tps = `${blocks.reduce(
          (acc, block) => block.body.transactions.length + acc,
          0,
        ) / totalDuration} TPS`
        // get duration
        const duration = `${totalDuration / blockCount}s`
        // update state
        const transactions = blocks
          .reduce(
            (acc, block) => [
              ...acc,
              ...block.body.transactions.map(tx => ({
                ...tx,
                timestamp: `${block.header.timestamp}`,
              })),
            ],
            [],
          )
          .slice(0, 10)

        this.setState(state => {
          const generals = Object.assign({}, state.generals, {
            tps,
            duration,
            blockCount: +height,
          })
          return { ...state, generals, blocks, transactions }
        })
      } else {
        throw new Error('No History or Fetch Blocks Failed')
      }
    })
  }
  private dismissNotification = e => {
    this.setState(state => ({ error: { message: '', code: '' } }))
  }
  render () {
    return (
      <React.Fragment>
        {this.state.loading ? <LinearProgress /> : null}
        <div className={layout.main}>
          <StaticCard title="系统概览">
            <List>
              {this.generals.map(item => (
                <ListItem key={item.key}>
                  <ListItemText
                    primary={item.label}
                    secondary={this.state.generals[item.key]}
                  />
                </ListItem>
              ))}
            </List>
          </StaticCard>
          <StaticCard title="最新区块">
            <BlockList blocks={this.state.blocks} />
          </StaticCard>
          <StaticCard title="最新交易">
            <TransactionList transactions={this.state.transactions} />
          </StaticCard>
        </div>
        <ErrorNotification
          error={this.state.error}
          dismissNotification={this.dismissNotification}
        />
      </React.Fragment>
    )
  }
}
export default withObservables(Homepage)
