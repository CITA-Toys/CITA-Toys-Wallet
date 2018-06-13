import * as React from 'react'
import TableWithSelector, {
  TableWithSelectorProps,
} from '../../components/TableWithSelector'
import { fetchTransactions } from '../../utils/fetcher'
import { TransactionFromServer } from '../../typings/block'
import paramsFilter from '../../utils/paramsFilter'

interface BlockSelectors {
  selectorsValue: {
    [index: string]: number | string
  }
}

const initialState: TableWithSelectorProps & BlockSelectors = {
  headers: [
    { key: 'hash', text: 'hash' },
    { key: 'from', text: 'from' },
    { key: 'to', text: 'to' },
    { key: 'value', text: 'value' },
    { key: 'blockNumber', text: 'block number' },
    { key: 'gasUsed', text: 'gas used' },
    { key: 'age', text: 'age' },
  ],
  items: [] as any[],
  count: 0,
  pageSize: 10,
  pageNo: 0,
  selectors: [
    {
      key: 'from',
      text: 'from selector',
    },
    {
      key: 'to',
      text: 'to selector',
    },
    {
      key: 'value',
      text: 'value selector',
    },
  ],
  selectorsValue: {
    from: '',
    to: '',
    valueFrom: '',
    valueTo: '',
  },
}
class TransactionTable extends React.Component {
  state = initialState
  componentDidMount () {
    this.fetchTransactions()
  }
  onSearch = params => {
    console.log(params)
    this.fetchTransactions(params)
  }

  private fetchTransactions = (
    params: { [index: string]: string | number } = {},
  ) =>
    fetchTransactions(paramsFilter(params)).then(
      ({
        result,
      }: {
      result: { transactions: TransactionFromServer[]; count: number }
      }) => {
        console.log(result)
        this.setState(state => ({
          count: result.count,
          items: result.transactions.map(tx => ({
            key: tx.hash,
            blockNumber: tx.blockNumber,
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: tx.value,
            age: `${Math.round((Date.now() - tx.timestamp) / 1000)}s ago`,
            gasUsed: tx.gasUsed,
          })),
        }))
      },
    )

  handlePageChanged = newPage => {
    const offset = newPage * this.state.pageSize
    const limit = this.state.pageSize
    this.fetchTransactions({
      offset,
      limit,
      ...this.state.selectorsValue,
    }).then(() => {
      this.setState({ pageNo: newPage })
    })
  }

  render () {
    const {
      headers,
      items,
      selectors,
      selectorsValue,
      count,
      pageSize,
      pageNo,
    } = this.state
    return (
      <TableWithSelector
        headers={headers}
        items={items}
        selectorsValue={selectorsValue}
        selectors={selectors}
        onSubmit={this.onSearch}
        count={count}
        pageSize={pageSize}
        pageNo={pageNo}
        handlePageChanged={this.handlePageChanged}
      />
    )
  }
}

export default TransactionTable
