import * as React from 'react'
import { Link } from 'react-router-dom'
import * as web3 from 'web3'
import * as web3Utils from 'web3-utils'
import * as Web3Contract from 'web3-eth-contract'
import * as web3Abi from 'web3-eth-abi'
import Card, { CardHeader, CardContent } from 'material-ui/Card'
import AppBar from 'material-ui/AppBar/'

import List, {
  ListItem,
  ListItemText,
  ListSubheader,
  ListItemSecondaryAction,
} from 'material-ui/List'
import Tabs, { Tab } from 'material-ui/Tabs'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import IconButton from 'material-ui/IconButton'
import Divider from 'material-ui/Divider'
import { LinearProgress } from 'material-ui/Progress/'

import DeleteIcon from 'material-ui-icons/Delete'
import AddIcon from 'material-ui-icons/Add'

import ERCPanel from '../../components/ERCPanel'
import TransactionList from '../../components/TransactionList'
import Dialog from '../Dialog'

import { withObservables } from '../../contexts/observables'
import { IContainerProps, Transaction, ABI } from '../../typings'
import LocalAccounts, { LocalAccount } from '../../components/LocalAccounts'
import ErrorNotification from '../../components/ErrorNotification'

const layouts = require('../../styles/layout.scss')
const texts = require('../../styles/text.scss')
const styles = require('./styles.scss')

enum AccountType {
  NORMAL = '普通账户',
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
}

interface Contract {
  methods?: any
  _jsonInterface: {
    signature: string
  }[]
}

const accountFormatter = (addr: string) =>
  addr.startsWith('0x') ? addr : `0x${addr}`
interface AccountProps extends IContainerProps {}
const initState = {
  loading: 0,
  type: AccountType.NORMAL,
  addr: '',
  abi: [] as ABI,
  contract: { _jsonInterface: [] } as Contract,
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
  error: {
    code: '',
    message: '',
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
  componentDidCatch (err) {
    // console.log(e)
    this.handleError(err)
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
  private fetchInfo = addr => {
    /**
     * @method get_transaction_count
     */
    this.setState(state => ({ loading: state.loading + 1 }))
    this.props.CITAObservables.getTransactionCount({
      accountAddr: addr,
      blockNumber: 'latest',
    })
      .finally(() => this.setState(state => ({ loading: state.loading - 1 })))
      .subscribe(
        // next
        (count: string) =>
          this.setState(state => ({ txCount: count.slice(2) })),
        // error
        error => this.handleError(error),
        // complete
        () => {},
      )

    /**
     * @method get_abi
     */
    this.setState(state => ({ loading: state.loading + 1 }))
    this.props.CITAObservables.getAbi({
      contractAddr: addr,
      blockNumber: 'latest',
    })
      .finally(() => this.setState(state => ({ loading: state.loading - 1 })))
      .subscribe(
        // next
        encoded => {
          try {
            const abiStr = web3Utils.hexToUtf8(encoded as string)
            const abi = JSON.parse(abiStr)
            const contract = new Web3Contract(abi, this.state.addr)

            this.setState(state => ({
              abi,
              contract,
            }))
          } catch (err) {
            // console.error(e.stack)
            this.handleError(err)
          }
        },
        // error
        err => this.handleError(err),
        // complete
        () => {
          // this.setState(state => ({ loading: state.loading - 1 }))
        },
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
      this.fetchInfo(addr)
    }
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
  private handleAbiValueChange = (index: number) => (
    inputIndex: number,
  ) => e => {
    const { value } = e.target
    this.setState(state => {
      const abi = [...state.abi]
      const oldInput = abi[index].inputs[inputIndex]
      const newInput = { ...oldInput, value }
      abi[index].inputs[inputIndex] = newInput
      return { ...state, abi }
    })
  }
  private handleEthCall = (index: number) => e => {
    const inputs = this.state.abi[index].inputs.map(input => ({
      name: input.name,
      value: input.value,
    }))
    /* eslint-disable no-underscore-dangle */
    const jsonInterface = this.state.contract._jsonInterface[index]
    /* eslint-enable no-underscore-dangle */
    // send transform data
    const data = web3Abi.encodeFunctionCall(
      jsonInterface,
      inputs.map(input => input.value),
    )
    this.setState(state => ({ loading: state.loading + 1 }))
    /**
     * @method eth_call
     */
    this.props.CITAObservables.ethCall({
      from: '',
      to: this.state.addr,
      data,
      blockNumber: 'latest',
    })
      .finally(() => this.setState(state => ({ loading: state.loading - 1 })))
      .subscribe(
        // next
        result => {
          try {
            const outputs = web3Utils.hexToUtf8(result)
            this.setState(state => {
              const abi = [...state.abi]
              if (typeof outputs === 'string') {
                abi[index].outputs[0].value = outputs
              } else {
                outputs.forEach((output, outputIndex) => {
                  abi[index].outputs[outputIndex].value = output
                })
              }
              return { ...state, abi }
            })
          } catch (err) {
            this.handleError(err)
          }
        },
        // error
        error => this.handleError(error),
        // complete
        () => {},
      )
  }
  private handleError = error => {
    this.setState(state => ({
      error,
    }))
  }
  private dismissNotification = e => {
    this.setState(state => ({ error: { message: '', code: '' } }))
  }
  render () {
    const {
      loading,
      addr,
      balance,
      txCount,
      type,
      panelOn,
      transactions,
      addrsOn,
      normals,
      erc20s,
      erc721s,
      normalsAdd,
      erc20sAdd,
      erc721sAdd,
      abi,
      error,
    } = this.state
    return (
      <React.Fragment>
        {loading ? <LinearProgress /> : null}
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
                {abi && abi.length ? <Tab label="ERC Panel" /> : null}
              </Tabs>
              <Divider />
              {panelOn ? (
                <ERCPanel
                  abi={abi}
                  handleAbiValueChange={this.handleAbiValueChange}
                  handleEthCall={this.handleEthCall}
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
          <LocalAccounts
            addrGroups={this.addrGroups}
            normals={normals}
            erc20s={erc20s}
            erc721s={erc721s}
            normalsAdd={normalsAdd}
            erc20sAdd={erc20sAdd}
            erc721sAdd={erc721sAdd}
            handleAddrInput={this.handleAddrInput}
            handleAddrDelete={this.handleAddrDelete}
            addAddr={this.addAddr}
          />
        </Dialog>
        <ErrorNotification
          error={error}
          dismissNotification={this.dismissNotification}
        />
      </React.Fragment>
    )
  }
}

export default withObservables(Account)
