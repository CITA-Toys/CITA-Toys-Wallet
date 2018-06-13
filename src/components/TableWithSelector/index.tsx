import * as React from 'react'
import Paper from '@material-ui/core/Paper'
import Pager from 'react-pager'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import SkipNext from '@material-ui/icons/SkipNext'
import SkipPrevious from '@material-ui/icons/SkipPrevious'

import Dialog from '../../containers/Dialog'

// const text = require('../../styles/text.scss')
const layout = require('../../styles/layout.scss')
const style = require('./style.scss')

export interface TableHeaderWithSelector {
  key: string
  text: string
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
  selectors: { key: string; text: string }[]
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
    return (
      <Paper className={`${layout.center} ${style.container}`}>
        <Dialog
          on={!!on}
          dialogTitle="高级选择器"
          onClose={this.showDialog(false)}
        >
          <React.Fragment>
            {selectors.map(selector => (
              <div key={selector.key}>
                {selector.text}:
                <input
                  value={selectorsValue[`${selector.key}From`]}
                  placeholder="from"
                  onChange={this.handleSelectorInput(`${selector.key}From`)}
                />
                <input
                  value={selectorsValue[`${selector.key}To`]}
                  placeholder="to"
                  onChange={this.handleSelectorInput(`${selector.key}To`)}
                />
              </div>
            ))}
            <button onClick={this.handleSubmit}>Submit</button>
          </React.Fragment>
        </Dialog>
        <div className={style.options}>
          <span>当前搜索参数: </span>
          <button onClick={this.showDialog(true)}>高级选择器</button>
        </div>
        <table className={style.table}>
          <thead>
            <tr>
              {headers.map(header => <th key={header.key}>{header.key}</th>)}
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.key}>
                {headers.map(header => (
                  <td key={header.key}>
                    {item[`${header.key}Link`] ? (
                      <a href={item[`${header.key}Link`]}>{item[header.key]}</a>
                    ) : (
                      item[header.key]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        pageNo: {pageNo}
        pageSize: {pageSize}
        count: {count}
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
          className={style.pager}
          onPageChanged={this.props.handlePageChanged}
        />
      </Paper>
    )
  }
}
// export default TableWithSelector
