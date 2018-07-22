/*
 * @Author: Keith-CY
 * @Date: 2018-07-22 21:41:37
 * @Last Modified by: Keith-CY
 * @Last Modified time: 2018-07-22 22:25:04
 */
import * as React from 'react'
import * as web3Utils from 'web3-utils'
import * as Web3Contract from 'web3-eth-contract'
import * as web3Abi from 'web3-eth-abi'

import {
  Card,
  CardHeader,
  CardContent,
  Tabs,
  Tab,
  Button,
  Divider,
  LinearProgress,
} from '@material-ui/core'

import ERCPanel from '../../components/ERCPanel'
import TransactionTable from '../../containers/TransactionTable'
import Banner from '../../components/Banner'
import Dialog from '../Dialog'
import ErrorNotification from '../../components/ErrorNotification'
import LocalAccounts from '../../components/LocalAccounts'

import { AccountType } from '../../typings/account'
import { IContainerProps, Transaction, ABI } from '../../typings'
import { withObservables } from '../../contexts/observables'

import { initAccountState } from '../../initValues'
import hideLoader from '../../utils/hideLoader'
import { handleError, dismissError } from '../../utils/handleError'

const layouts = require('../../styles/layout.scss')

const accountFormatter = (addr: string) =>
  addr.startsWith('0x') ? addr : `0x${addr}`
interface AccountProps extends IContainerProps { }
type AccountState = typeof initAccountState
class Account extends React.Component<AccountProps, AccountState> {
  readonly state = initAccountState

  public componentWillMount () {
    const { account } = this.props.match.params
    this.onMount(account)
  }
  public componentDidMount () {
    hideLoader()
  }
  public componentWillReceiveProps (nextProps: AccountProps) {
    const { account } = nextProps.match.params
    if (account && account !== this.props.match.params.account) {
      this.onMount(account)
    }
  }
  public componentDidCatch (err) {
    this.handleError(err)
  }
  private onMount = account => {
    this.setState(initAccountState)
    this.updateBasicInfo(account)
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
  private fetchInfo = addr => {
    /**
     * @method get_balance
     */
    this.setState(state => ({ loading: state.loading + 1 }))
    this.props.CITAObservables.getBalance({ addr, blockNumber: 'latest' })
      .finally(() => this.setState(state => ({ loading: state.loading - 1 })))
      .subscribe(
        (balance: string) =>
          this.setState(state => ({ balance: `${+balance}` })),
        error => this.handleError(error),
        () => { },
      )
    /**
     * @method get_transaction_count
     */
    this.setState(state => ({ loading: state.loading + 1 }))
    this.props.CITAObservables.getTransactionCount({
      accountAddr: addr,
      blockNumber: 'latest',
    })
      // .finally(() => this.setState(state => ({ loading: state.loading - 1 })))
      .subscribe(
        (count: string) =>
          this.setState(state => ({ txCount: count.slice(2), loading: state.loading - 1 })),
        error => this.handleError(error),
      )

    /**
     * @method get_abi
     */
    this.setState(state => ({ loading: state.loading + 1 }))
    this.props.CITAObservables.getAbi({
      contractAddr: addr,
      blockNumber: 'latest',
    })
      // .finally(() => this.setState(state => ({ loading: state.loading - 1 })))
      .subscribe(
        encoded => {
          if (encoded === '0x') return
          try {
            const abiStr = web3Utils.hexToUtf8(encoded as string)
            const abi = JSON.parse(abiStr)
            const contract = new Web3Contract(abi, this.state.addr)
            this.setState(state => ({
              abi,
              contract,
              loading: state.loading - 1
            }))
          } catch (err) {
            this.handleError(err)
          }
        },
        this.handleError
      )
  }
  private updateBasicInfo = account => {
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
  private toggleAddrs = (addrsOn = false) => e => {
    this.setState({ addrsOn })
  }
  private addAddr = group => e => {
    this.setState(state => {
      const { name, addr } = this.state[`${group}Add`]
      const newList = [...state[group], { name, addr }]
      // side effect
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
  private handleAddrDelete = (group, idx) => e => {
    this.setState(state => {
      // const { name, addr } = this.state[`${group}Add`]
      const newList = [...state[group]].splice(idx, 1)
      // newList.splice(idx, 1)
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
      // .finally(() => this.setState(state => ({ loading: state.loading - 1 })))
      .subscribe(
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
              return { ...state, abi, loading: state.loading - 1 }
            })
          } catch (err) {
            this.handleError(err)
          }
        },
        this.handleError,
      )
  }
  private handleError = handleError(this)
  private dismissError = dismissError(this)
  render () {
    const {
      loading,
      addr,
      balance,
      txCount,
      panelOn,
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
        {loading ? (
          <LinearProgress
            classes={{
              root: 'linearProgressRoot',
            }}
          />
        ) : null}

        <Banner bg={`${process.env.PUBLIC}/banner/banner-Account.png`}>
          <div style={{ fontSize: '14px' }}>
            Account: <span>{addr}</span>
          </div>
          <div style={{ fontSize: '14px' }}>
            Balance: <span>{balance}</span>
          </div>
        </Banner>
        <div className={layouts.main}>
          <Card classes={{ root: layouts.cardContainer }} elevation={0}>
            <CardHeader
              action={
                <Button onClick={this.toggleAddrs(true)}>管理本地账户</Button>
              }
            />
            <CardContent>
              <Tabs value={+panelOn} onChange={this.onTabClick}>
                <Tab label={`Transactions(${txCount || 0})`} />
                {abi && abi.length ? <Tab label="Contract Panel" /> : null}
              </Tabs>
              <Divider />
              {panelOn ? (
                <ERCPanel
                  abi={abi.filter(abiEl => abiEl.type === 'function')}
                  handleAbiValueChange={this.handleAbiValueChange}
                  handleEthCall={this.handleEthCall}
                />
              ) : (
                <TransactionTable {...this.props} key={addr} inset />
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
        <ErrorNotification error={error} dismissError={this.dismissError} />
      </React.Fragment>
    )
  }
}

export default withObservables(Account)
