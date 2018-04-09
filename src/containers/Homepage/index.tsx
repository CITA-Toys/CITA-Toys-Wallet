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
import { IContainerProps, IBlock, Transaction } from '../../typings'
import { withObservables } from '../../contexts/observables'
import StaticCard from '../../components/StaticCard'
import TransactionList from '../../components/TransactionList/'

const layout = require('../../styles/layout.scss')
const texts = require('../../styles/text.scss')
const styles = require('./styles.scss')

interface HomepageProps extends IContainerProps {}

const initState = {
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
}
type HomepageState = typeof initState
class Homepage extends React.Component<HomepageProps, HomepageState> {
  state = initState
  componentDidMount () {
    this.props.CITAObservables.newBlockNumber(0, false).subscribe(blockNumber =>
      this.blockHistory({ height: blockNumber, count: 10 }),
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
      if (blockCount > 0) {
        // get tps
        const tps = `${blocks.reduce(
          (acc, block) => block.body.transactions.length + acc,
          0,
        ) / blockCount} TPS`
        // get duration
        const duration = `${(+blocks[0].header.timestamp -
          +blocks[blockCount - 1].header.timestamp) /
          1000 /
          blockCount}s`
        // update state
        const transactions = blocks
          .reduce((acc, block) => [...acc, ...block.body.transactions], [])
          .slice(2, 10)

        this.setState(state => {
          const generals = Object.assign({}, state.generals, { tps, duration })
          return { ...state, generals, blocks, transactions }
        })
      } else {
        throw new Error('No History or Fetch Blocks Failed')
      }
    })
  }
  render () {
    return (
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
        <StaticCard title="节点健康状况">健康</StaticCard>
        <StaticCard title="最新区块">
          <List>
            {this.state.blocks.map(block => (
              <ListItem key={block.hash}>
                <ListItemText
                  primary={
                    <div className={styles.blockListHeader}>
                      <Link
                        to={`/block/${block.hash}`}
                        href={`/block/${block.hash}`}
                      >
                        <h1 className={texts.addr}>{block.hash}</h1>
                      </Link>
                      <span>
                        {new Date(+block.header.timestamp).toLocaleString()}
                      </span>
                    </div>
                  }
                  secondary={`At Height of ${
                    block.header.number
                  }, mined by own`}
                />
              </ListItem>
            ))}
          </List>
        </StaticCard>
        <StaticCard title="最新交易">
          <TransactionList transactions={this.state.transactions} />
        </StaticCard>
      </div>
    )
  }
}
export default withObservables(Homepage)
