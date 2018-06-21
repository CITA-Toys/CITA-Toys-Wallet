import * as React from 'react'
import LinearProgress from '@material-ui/core/LinearProgress'
import TableWithSelector, {
  TableWithSelectorProps,
  SelectorType,
} from '../../components/TableWithSelector'
import ErrorNotification from '../../components/ErrorNotification'
import { fetchBlocks } from '../../utils/fetcher'
import { BlockFromServer } from '../../typings/block'
import paramsFilter from '../../utils/paramsFilter'
import { withConfig } from '../../contexts/config'
import { IContainerProps } from '../../typings'
import hideLoader from '../../utils/hideLoader'

interface BlockSelectors {
  selectorsValue: {
    [index: string]: number | string
  }
}
type BlockTableState = TableWithSelectorProps &
  BlockSelectors & {
    loading: boolean
    error: { code: string; message: string }
  }
interface BlockTableProps extends IContainerProps {}

const initialState: BlockTableState = {
  headers: [
    { key: 'height', text: 'height', href: '/height/' },
    { key: 'hash', text: 'hash', href: '/block/' },
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
      type: SelectorType.RANGE,
      key: 'number',
      text: 'number selector',
      items: [
        { key: 'numberFrom', text: 'NumberFrom' },
        { key: 'numberTo', text: 'NumberTo' },
      ],
    },
    {
      type: SelectorType.RANGE,
      key: 'transaction',
      text: 'transactions selector',
      items: [
        { key: 'transactionFrom', text: 'transactionFrom' },
        { key: 'transactionTo', text: 'transactionTo' },
      ],
    },
  ],
  selectorsValue: {
    numberFrom: '',
    numberTo: '',
    transactionFrom: '',
    transactionTo: '',
  },
  loading: false,
  error: {
    code: '',
    message: '',
  },
}

class BlockTable extends React.Component<BlockTableProps, BlockTableState> {
  state = initialState

  componentWillMount () {
    this.setParamsFromUrl()
    this.setVisibleHeaders()
    this.setPageSize()
  }

  componentDidMount () {
    hideLoader()
    this.fetchBlock({
      ...this.state.selectorsValue,
      offset: this.state.pageNo * this.state.pageSize,
      limit: this.state.pageSize,
    })
  }

  onSearch = params => {
    this.setState(state => Object.assign({}, state, { selectorsValue: params }))
    this.fetchBlock(params)
  }
  private setPageSize = () => {
    const { blockPageSize: pageSize } = this.props.config.panelConfigs
    this.setState({ pageSize })
  }
  private setVisibleHeaders = () => {
    // hide invisible header
    this.setState(state => {
      const { headers } = state
      const visibleHeaders = headers.filter(
        header =>
          this.props.config.panelConfigs[
            `block${header.key[0].toUpperCase()}${header.key.slice(1)}`
          ] !== false,
      )
      return { headers: visibleHeaders }
    })
  }

  private setParamsFromUrl = () => {
    const actParams = new URLSearchParams(this.props.location.search)
    const params = {
      numberFrom: '',
      numberTo: '',
      transactionFrom: '',
      transactionTo: '',
      pageNo: '',
    }
    Object.keys(params).forEach(key => {
      const value = actParams.get(key)
      params[key] = value
    })

    const selectorsValue = {}
    Object.keys(this.state.selectorsValue).forEach(key => {
      selectorsValue[key] = params[key] || this.state.selectorsValue[key]
    })

    const pageNo = +params.pageNo >= 1 ? +params.pageNo - 1 : this.state.pageNo

    this.setState({
      selectorsValue,
      pageNo,
    })
  }
  private handlePageChanged = newPage => {
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
  private fetchBlock = (params: { [index: string]: string | number } = {}) => {
    this.setState({ loading: true })
    return fetchBlocks(paramsFilter(params))
      .then(
        ({
          result,
        }: {
        result: { blocks: BlockFromServer[]; count: number }
        }) => {
          this.setState({
            loading: false,
            count: result.count,
            items: result.blocks.map(block => ({
              key: block.hash,
              height: block.header.number,
              hash: block.hash,
              age: `${Math.round(
                (Date.now() - block.header.timestamp) / 1000,
              )}s ago`,
              transactions: `${block.transactionsCount}`,
              gasUsed: block.header.gasUsed,
            })),
          })
        },
      )
      .catch(err => {
        this.handleError(err)
      })
  }
  private handleError = error => {
    this.setState(state => ({
      error,
      loading: false,
    }))
  }
  private dismissNotification = e => {
    this.setState(state => ({ error: { message: '', code: '' } }))
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
      loading,
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
        <ErrorNotification
          error={error}
          dismissNotification={this.dismissNotification}
        />
      </React.Fragment>
    )
  }
}

export default withConfig(BlockTable)
