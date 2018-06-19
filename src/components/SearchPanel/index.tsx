import * as React from 'react'
import { Link } from 'react-router-dom'
import SearchIcon from '@material-ui/icons/Search'
import { withObservables } from '../../contexts/observables'
import {
  IContainerProps,
  IBlock,
  Transaction,
  TransactionFromServer,
} from '../../typings'
import { initBlock, initTransaction } from '../../initValues'

const styles = require('./styles.scss')

enum SearchType {
  BLOCK,
  TRANSACTION,
  ACCOUNT,
  HEIGHT,
}

const searchGen = keyword => {
  switch (keyword.length) {
    case 64:
    case 66: {
      return [
        { type: SearchType.BLOCK, url: `/block/${keyword}` },
        { type: SearchType.TRANSACTION, url: `/transactions/${keyword}` },
      ]
    }
    case 40:
    case 42: {
      return [{ type: SearchType.ACCOUNT, url: `/account/${keyword}` }]
    }
    default: {
      return [{ type: SearchType.HEIGHT, url: `/height/${keyword}` }]
    }
  }
}

const BlockDisplay = ({ block }: { block: IBlock }) => (
  <div className={styles.display}>
    <div className={styles.title}>Block</div>
    <table className={styles.items}>
      <tbody>
        <tr>
          <td>Hash</td>
          <td>{block.hash}</td>
        </tr>
        <tr>
          <td>Height</td>
          <td>{+block.header.number}</td>
        </tr>
        <tr>
          <td>Prev Hash</td>
          <td>{block.header.prevHash}</td>
        </tr>
        <tr>
          <td>Validator</td>
          <td>{block.header.proof.Tendermint.proposal}</td>
        </tr>
        <tr>
          <td>Time</td>
          <td>{new Date(block.header.timestamp).toLocaleDateString()}</td>
        </tr>
        <tr>
          <td>Gas Used</td>
          <td>{block.header.gasUsed}</td>
        </tr>
      </tbody>
    </table>
    <Link
      to={`/block/${block.hash}`}
      href={`/block/${block.hash}`}
      className={styles.more}
    >
      Detail
    </Link>
  </div>
)

const TransactionDisplay = ({ tx }: { tx: Transaction }) =>
  tx.basicInfo ? (
    <div className={styles.display}>
      <div className={styles.title}>Transaction</div>
      <table className={styles.items}>
        <tbody>
          <tr>
            <td>From</td>
            <td>{tx.basicInfo.from}</td>
          </tr>
          <tr>
            <td>To</td>
            <td>{tx.basicInfo.to}</td>
          </tr>
          <tr>
            <td>Value</td>
            <td>{tx.basicInfo.value}</td>
          </tr>
        </tbody>
      </table>
      <Link
        to={`/transaction/${tx.hash}`}
        href={`/transaction/${tx.hash}`}
        className={styles.more}
      >
        Detail
      </Link>
    </div>
  ) : (
    <div className={styles.display}>
      <div className={styles.title}>Transaction</div>
      <table className={styles.items}>
        <tbody>
          <tr>
            <td>Content</td>
            <td>{tx.content}</td>
          </tr>
        </tbody>
      </table>
      <Link
        to={`/transaction/${tx.hash}`}
        href={`/transaction/${tx.hash}`}
        className={styles.more}
      >
        Detail
      </Link>
    </div>
  )

const AccountDisplay = ({
  balance,
  txCount,
  addr,
}: {
balance: string
txCount: number
addr: string
}) => (
  <div className={styles.display}>
    <div className={styles.title}>Account</div>
    <table className={styles.items}>
      <tbody>
        <tr>
          <td>Balance</td>
          <td>{balance}</td>
        </tr>
        <tr>
          <td>Transactions</td>
          <td>{txCount}</td>
        </tr>
      </tbody>
    </table>
    <Link
      to={`/account/${addr}`}
      href={`/account/${addr}`}
      className={styles.more}
    >
      Detail
    </Link>
  </div>
)

const initState = {
  keyword: '',
  block: initBlock,
  transaction: initTransaction,
  txCount: '',
  balance: '',
}

type SearchPanelState = typeof initState
interface SearchPanelProps extends IContainerProps {}
class SearchPanel extends React.Component<SearchPanelProps, SearchPanelState> {
  state = initState

  private handleInput = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget
    this.setState(state => ({
      keyword: value,
    }))
  }
  private handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      this.handleSearch()
    }
  }
  private handleSearch = () => {
    const { keyword } = this.state
    if (keyword === '') return
    // clear history
    this.setState(state => ({ ...initState, keyword }))

    const { CITAObservables } = this.props
    const searches = searchGen(keyword)
    searches.forEach(search => {
      switch (search.type) {
        case SearchType.BLOCK: {
          return CITAObservables.blockByHash(keyword).subscribe(block =>
            this.setState(state => Object.assign({}, state, { block })),
          )
        }
        case SearchType.HEIGHT: {
          return CITAObservables.blockByNumber(keyword).subscribe(block =>
            this.setState(state => Object.assign({}, state, { block })),
          )
        }
        case SearchType.TRANSACTION: {
          return CITAObservables.getTransaction(keyword).subscribe(
            transaction => {
              this.setState(state => Object.assign({}, state, { transaction }))
            },
          )
        }
        case SearchType.ACCOUNT: {
          // CITAObservables.getBalance({ addr: keyword, blockNumber: "latest" }).subscribe(balance => {
          //   this.setState(state => Object.assign({}, state, {balance}))
          // })
          CITAObservables.getTransactionCount({
            accountAddr: keyword,
            blockNumber: 'latest',
          }).subscribe(txCount => {
            this.setState(state => Object.assign({}, state, { txCount }))
          })
          return CITAObservables.getBalance({
            addr: keyword,
            blockNumber: 'latest',
          }).subscribe(balance => {
            this.setState(state => Object.assign({}, state, { balance }))
          })
        }
        default: {
          return false
        }
      }
    })
  }
  render () {
    const { keyword, block, transaction, balance, txCount } = this.state
    return (
      <div>
        <div className={styles.fields}>
          <input
            type="text"
            value={keyword}
            onChange={this.handleInput}
            onKeyUp={this.handleKeyUp}
          />
          <button onClick={this.handleSearch}>
            <SearchIcon />
          </button>
        </div>
        {block.hash ? <BlockDisplay block={block} /> : null}
        {transaction.hash ? <TransactionDisplay tx={transaction} /> : null}
        {balance !== '' ? (
          <AccountDisplay balance={balance} txCount={+txCount} addr={keyword} />
        ) : null}
      </div>
    )
  }
}
export default withObservables(SearchPanel)
