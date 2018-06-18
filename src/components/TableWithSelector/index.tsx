import * as React from 'react'
import { Link } from 'react-router-dom'
import Paper from '@material-ui/core/Paper'
import Pager from 'react-pager'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import SkipNext from '@material-ui/icons/SkipNext'
import SkipPrevious from '@material-ui/icons/SkipPrevious'

import Dialog from '../../containers/Dialog'
import paramsFilter from '../../utils//paramsFilter'

const text = require('../../styles/text.scss')
const layout = require('../../styles/layout.scss')
const styles = require('./styles.scss')

export enum SelectorType {
  SINGLE,
  MULTIPLE,
  RANGE,
}

export interface TableHeaderWithSelector {
  key: string
  text: string
  href?: string
}
export interface TableRowWithSelector {
  key: string
  [index: string]: string
}

export interface TableWithSelectorProps {
  headers: TableHeaderWithSelector[]
  items: TableRowWithSelector[]
  count: number
  pageSize: number
  pageNo: number
  selectors: {
    type: SelectorType
    key: string
    text: string
    items?: { key: string; text: string }[]
  }[]
  selectorsValue?: any
  onSubmit?: any
  handlePageChanged?: (pageNo: number) => void
}

export default class TableWithSelector extends React.Component<
  TableWithSelectorProps,
  any
  > {
  state = {
    on: false,
    selectorsValue: this.props.selectorsValue,
  }

  showDialog = (on: boolean = false) => (e?: any) => {
    this.setState(state => ({
      on,
    }))
  }

  handleSelectorInput = (selector: string) => e => {
    e.persist()
    this.setState(state => {
      const { selectorsValue } = state
      const newSelectorsValue = {
        ...selectorsValue,
        [selector]: e.target.value,
      }

      return {
        selectorsValue: newSelectorsValue,
      }
    })
  }
  handleSubmit = e => {
    this.props.onSubmit(this.state.selectorsValue)
    this.showDialog(false)()
  }
  render () {
    const { on, selectorsValue } = this.state
    const { headers, items, selectors, pageSize, pageNo, count } = this.props
    const total = Math.ceil(count / pageSize)
    const activeParams = paramsFilter(this.props.selectorsValue)
    return (
      <Paper className={`${layout.center} ${styles.container}`}>
        <Dialog
          on={!!on}
          dialogTitle="高级选择器"
          onClose={this.showDialog(false)}
          maxWidth="md"
        >
          <div className={styles.dialog}>
            {selectors.map(
              selector =>
                selector.items ? (
                  <div key={selector.key} className={styles.rangeSelector}>
                    <span className={styles.title}>{selector.text}</span>
                    {selector.items.map(item => (
                      <input
                        key={item.key}
                        value={selectorsValue[item.key]}
                        placeholder={item.text}
                        onChange={this.handleSelectorInput(item.key)}
                      />
                    ))}
                  </div>
                ) : (
                  <div key={selector.key} className={styles.singleSelector}>
                    <span className={styles.title}>{selector.text}</span>
                    <input
                      value={selectorsValue[selector.key]}
                      placeholder={selector.text}
                      onChange={this.handleSelectorInput(selector.key)}
                    />
                  </div>
                ),
            )}
            <button onClick={this.handleSubmit}>Submit</button>
          </div>
        </Dialog>
        <div className={styles.options}>
          <span>
            当前搜索参数:
            {Object.keys(activeParams)
              .map(key => `${key}: ${activeParams[key]}`)
              .join(', ')}
          </span>
          <button onClick={this.showDialog(true)}>高级选择器</button>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              {headers.map(header => <th key={header.key}>{header.key}</th>)}
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.key}>
                {headers.map(header => (
                  <td
                    key={header.key}
                    className={text.ellipsis}
                    title={item[header.key]}
                  >
                    {header.href === undefined ? (
                      item[header.key] === null ? (
                        '/'
                      ) : (
                        item[header.key]
                      )
                    ) : (
                      <Link
                        to={`${header.href}${item[header.key]}`}
                        href={`${header.href}${item[header.key]}`}
                        className={text.addr}
                      >
                        {item[header.key] === null ? '/' : item[header.key]}
                      </Link>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <Pager
          total={total}
          current={pageNo}
          visiblePages={3}
          titles={{
            first: <SkipPrevious />,
            last: <SkipNext />,
            prev: <KeyboardArrowLeft />,
            next: <KeyboardArrowRight />,
          }}
          className={styles.pager}
          onPageChanged={this.props.handlePageChanged}
        />
      </Paper>
    )
  }
}
// export default TableWithSelector
