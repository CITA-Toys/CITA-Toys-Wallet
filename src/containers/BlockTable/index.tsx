import * as React from 'react'
import TableWithSelector, {
  TableWithSelectorProps,
} from '../../components/TableWithSelector'
import { fetchBlocks } from '../../utils/fetcher'
import { BlockFromServer } from '../../typings/block'
import paramsFilter from '../../utils/paramsFilter'

interface BlockSelectors {
  selectorsValue: {
    [index: string]: number | string
  }
}

const initialState: TableWithSelectorProps & BlockSelectors = {
  headers: [
    { key: 'height', text: 'height' },
    { key: 'hash', text: 'hash' },
    { key: 'age', text: 'age' },
    { key: 'transactions', text: 'transactions' },
    { key: 'gasUsed', text: 'gas used' },
  ],
  items: [] as any[],
  count: 0,
  pageSize: 10,
  pageNo: 0,
  selectors: [
    {
      key: 'number',
      text: 'number selector',
    },
    {
      key: 'transaction',
      text: 'transactions selector',
    },
  ],
  selectorsValue: {
    numberFrom: '',
    numberTo: '',
    transactionFrom: '',
    transactionTo: '',
  },
}
class BlockTable extends React.Component {
  state = initialState
  componentDidMount () {
    this.fetchBlock()
  }

  onSearch = params => {
    this.fetchBlock({ ...this.state.selectorsValue, ...params })
  }
  private fetchBlock = (params: { [index: string]: string | number } = {}) =>
    fetchBlocks(paramsFilter(params)).then(
      ({
        result,
      }: {
      result: { blocks: BlockFromServer[]; count: number }
      }) => {
        this.setState(state => ({
          count: result.count,
          items: result.blocks.map(block => ({
            key: block.hash,
            height: block.header.number,
            hash: block.hash,
            age: `${Math.round(
              (Date.now() - block.header.timestamp) / 1000,
            )}s ago`,
            transactions: block.transactionsCount,
            gasUsed: block.header.gasUsed,
          })),
        }))
      },
    )

  handlePageChanged = newPage => {
    const offset = newPage * this.state.pageSize
    const limit = this.state.pageSize
    this.fetchBlock({
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

export default BlockTable
