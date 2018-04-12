// 概览
// 地址
// 默认代币数量
// 总交易数
// 合约创建人@ txid
// erc20/erc721 代币名称
// 合约操作

// 地址详细内容
// 交易列表 或 资产读取页面

// 前端应能保存 erc721 与 abi 对应的列表
import * as React from 'react'
import Card, { CardHeader, CardContent } from 'material-ui/Card'
import AppBar from 'material-ui/AppBar/'

import List, {
  ListItem,
  ListItemText,
  ListSubheader,
  ListItemSecondaryAction,
} from 'material-ui/List'
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  ExpansionPanelActions,
} from 'material-ui/ExpansionPanel'
import Tabs, { Tab } from 'material-ui/Tabs'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import IconButton from 'material-ui/IconButton'
import Typography from 'material-ui/Typography'
import DeleteIcon from 'material-ui-icons/Delete'
import ExpandMoreIcon from 'material-ui-icons/ExpandMore'
import AddIcon from 'material-ui-icons/Add'
// import TxIcon from 'material-ui-icons/SwapHoriz'
// import PanelIcon from 'material-ui-icons/Dns'

import ERCPanel from '../../components/ERCPanel'
import TransactionList from '../../components/TransactionList'
import Dialog from '../Dialog'

import { withObservables } from '../../contexts/observables'
import { IContainerProps, Transaction } from '../../typings'

const layouts = require('../../styles/layout.scss')
const texts = require('../../styles/text.scss')
const styles = require('./styles.scss')

enum AccountType {
  NORMAL = '普通账户',
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
}

const accountFormatter = (addr: string) =>
  addr.startsWith('0x') ? addr : `0x${addr}`
/* eslint-disable no-restricted-globals */
interface LocalAccount {
  name: string
  abi?: string
  addr: string
}
/* eslint-enable no-restricted-globals */
interface AccountProps extends IContainerProps {}
const initState = {
  type: AccountType.NORMAL,
  addr: '',
  balance: '',
  txCount: '',
  creator: '',
  transactions: [] as Transaction[],
  customToken: {
    name: '',
  },

  normals: [] as LocalAccount[],
  erc20s: [] as LocalAccount[],
  erc721s: [] as LocalAccount[],
  panelOn: false,
  addrsOn: false,
  normalsAdd: {
    name: '',
    addr: '',
  },
  erc20sAdd: {
    name: '',
    addr: '',
  },
  erc721sAdd: {
    name: '',
    addr: '',
  },
}
type AccountState = typeof initState
class Account extends React.Component<AccountProps, AccountState> {
  state = initState

  componentWillMount () {
    this.loadAddrList()
    this.updateBasicInfo()
  }
  private onTabClick = (e, value) => {
    this.setState(state => ({ panelOn: !!value }))
  }
  protected readonly addrGroups = [
    {
      key: 'normals',
      label: AccountType.NORMAL,
    },
    {
      key: 'erc20s',
      label: AccountType.ERC20,
    },
    {
      key: 'erc721s',
      label: AccountType.ERC721,
    },
  ]
  private generalInfo = [
    { key: 'balance', label: 'Balance' },
    { key: 'txCount', label: 'Count of Transactions' },
  ]
  private fetchInfo = () => {
    this.props.CITAObservables.getTransactionCount({
      accountAddr: this.state.addr,
      blockNumber: 'latest',
    }).subscribe((count: string) =>
      this.setState(state => ({ txCount: count.slice(2) })),
    )
  }
  private updateBasicInfo = () => {
    const { account } = this.props.match.params
    if (account) {
      const addr = accountFormatter(account)
      let type = AccountType.NORMAL
      type = this.state.erc20s.map(erc => erc.addr).includes(addr)
        ? AccountType.ERC20
        : type
      type = this.state.erc721s.map(erc => erc.addr).includes(addr)
        ? AccountType.ERC721
        : type
      this.setState({
        addr,
        type,
      })
    }
    this.fetchInfo()
  }
  private loadAddrList = () => {
    const normals = JSON.parse(window.localStorage.getItem('normals') || '[]')
    const erc20s = JSON.parse(window.localStorage.getItem('erc20s') || '[]')
    const erc721s = JSON.parse(window.localStorage.getItem('erc721s') || '[]')
    this.setState(state => ({
      normals,
      erc20s,
      erc721s,
    }))
  }
  private toggleAddrs = (addrsOn = false) => e => {
    this.setState(state => ({ addrsOn }))
  }
  private addAddr = group => e => {
    this.setState(state => {
      const { name, addr } = this.state[`${group}Add`]
      const newList = [...state[group], { name, addr }]
      window.localStorage.setItem(group, JSON.stringify(newList))
      return {
        ...state,
        [group]: newList,
        [`${group}Add`]: {
          name: '',
          addr: '',
        },
      }
    })
  }
  private handleAddrInput = (group, label) => e => {
    const { value } = e.target
    this.setState(state => ({
      ...state,
      [`${group}Add`]: {
        ...state[`${group}Add`],
        [label]: value,
      },
    }))
  }
  private handleAddrDelete = (group, index) => e => {
    this.setState(state => {
      const { name, addr } = this.state[`${group}Add`]
      console.log()
      const newList = [...state[group]]
      newList.splice(index, 1)
      window.localStorage.setItem(group, JSON.stringify(newList))
      return {
        ...state,
        [group]: newList,
        [`${group}Add`]: {
          name: '',
          addr: '',
        },
      }
    })
  }
  render () {
    const {
      addr,
      balance,
      txCount,
      type,
      panelOn,
      transactions,
      addrsOn,
      erc20s,
      erc721s,
    } = this.state
    return (
      <React.Fragment>
        <div className={layouts.main}>
          <Card>
            <CardHeader
              title={
                <div className={styles.accountHeader}>
                  Account: <span className={texts.addr}>{addr}</span>
                </div>
              }
              subheader={type}
              action={
                <Button onClick={this.toggleAddrs(true)}>管理本地账户</Button>
              }
            />
            <CardContent>
              <List>
                {this.generalInfo.map(info => (
                  <ListItem key={info.key}>
                    <ListItemText
                      primary={info.label}
                      secondary={this.state[info.key]}
                    />
                  </ListItem>
                ))}
              </List>
              <Tabs value={+panelOn} onChange={this.onTabClick}>
                <Tab label="Transactions" />
                <Tab label="ERC Panel" />
              </Tabs>
              {panelOn ? (
                <ERCPanel
                  name="string"
                  totalSupply="string"
                  decimals="string"
                  version="string"
                  paused={false}
                  owner="string"
                  symbol="string"
                />
              ) : (
                <TransactionList transactions={transactions} />
              )}
            </CardContent>
          </Card>
        </div>
        <Dialog
          fullScreen
          on={addrsOn}
          dialogTitle="地址管理"
          onClose={this.toggleAddrs()}
        >
          {this.addrGroups.map(group => (
            <ExpansionPanel key={group.key}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body1">
                  Including: {this.state[group.key].length} {group.label}(s)
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <List style={{ width: '100%' }}>
                  {this.state[group.key].length ? (
                    this.state[group.key].map((item: LocalAccount, index) => (
                      <ListItem key={item.addr}>
                        <ListItemText
                          classes={{
                            root: styles.addrItem,
                          }}
                          primary={item.name}
                          secondary={item.addr}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            onClick={this.handleAddrDelete(group.key, index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))
                  ) : (
                    <ListItem>
                      <ListItemText primary="暂无记录" />
                    </ListItem>
                  )}
                </List>
              </ExpansionPanelDetails>
              <ExpansionPanelActions>
                <TextField
                  value={this.state[`${group.key}Add`].name}
                  placeholder="name"
                  onChange={this.handleAddrInput(group.key, 'name')}
                />
                <TextField
                  value={this.state[`${group.key}Add`].addr}
                  placeholder="address"
                  onChange={this.handleAddrInput(group.key, 'addr')}
                />
                <Button
                  variant="fab"
                  mini
                  color="primary"
                  onClick={this.addAddr(group.key)}
                >
                  <AddIcon />
                </Button>
              </ExpansionPanelActions>
            </ExpansionPanel>
          ))}
        </Dialog>
      </React.Fragment>
    )
  }
}

export default withObservables(Account)
