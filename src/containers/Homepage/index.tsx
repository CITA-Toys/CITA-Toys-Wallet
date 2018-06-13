import * as React from 'react'
import LinearProgress from '@material-ui/core/LinearProgress'
import { IContainerProps, IBlock, TransactionFromServer } from '../../typings'
import { withObservables } from '../../contexts/observables'
import { fetch10Transactions } from '../../utils/fetcher'
import StaticCard from '../../components/StaticCard'
import BlockList from '../../components/HomepageLists/BlockList'
import TransactionList from '../../components/HomepageLists/TransactionList'
import ErrorNotification from '../../components/ErrorNotification'

const layout = require('../../styles/layout.scss')
const texts = require('../../styles/text.scss')
const styles = require('./styles.scss')

interface HomepageProps extends IContainerProps {}

const initState = {
  loading: 0,
  blocks: [] as IBlock[],
  transactions: [] as TransactionFromServer[],
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
    this.transactionHistory()
  }
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
      this.setState(state => ({
        blocks,
      }))
    })
  }
  private transactionHistory = () => {
    fetch10Transactions().then(
      ({
        result,
      }: {
      result: {
      transactions: TransactionFromServer[]
      count: number
      }
      }) => {
        this.setState(state => ({
          transactions: result.transactions,
        }))
      },
    )
  }
  private dismissNotification = e => {
    this.setState(state => ({ error: { message: '', code: '' } }))
  }
  render () {
    return (
      <React.Fragment>
        {this.state.loading ? <LinearProgress /> : null}
        <div className={`${layout.main} ${styles.listContainer}`}>
          <StaticCard title="最新10个区块" page="blocks">
            <BlockList blocks={this.state.blocks} />
          </StaticCard>
          <StaticCard title="最新10笔交易" page="transactions">
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
