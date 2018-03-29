import axios from 'axios'
// import { Observable } from 'rxjs'

enum CITA_METHODS {
  NET_PEER_COUNT = 'net_peerCount',
  CITA_BLOCK_NUMBER = 'cita_blockNumber',
  SEND_TRANSACTION = 'cita_sendTransaction',
  GET_BLOCK_BY_HASH = 'cita_getBlockByHash',
  GET_BLOCK_BY_NUMBER = 'cita_getBlockByNumber',
  ETH_GET_TRANSACTION_RECEIPT = 'eth_getTransactionReceipt',
  ETH_GET_LOGS = 'eth_getLogs',
  ETH_CALL = 'eth_call',
  CITA_GET_TRANSACTION = 'cita_getTransaction',
  ETH_GET_TRANSACTION_COUNT = 'eth_getTransactionCount',
  ETH_GET_CODE = 'eth_getCode',
  ETH_GET_ABI = 'eth_getAbi',
  ETH_NEW_FILTER = 'eth_newFilter',
  ETH_NEW_BLOCK_FILTER = 'eth_newBlockFilter',
  ETH_UNINSTALL_FILTER = 'eth_uninstallFilter',
  ETH_GET_FILTER_CHANGES = 'eth_getFilterChanges',
  ETH_GET_FILTER_LOGS = 'eth_getFilterLogs',
  CITA_GET_TRANSACTION_PROOF = 'cita_getTransactionProof',
}

interface IJSONRPCParams {
  method: CITA_METHODS
  params: string[]
  id: number
}
interface IJSONRPC {
  jsonrpc: string
  method: CITA_METHODS | string
  params: string[]
  id: number
}

interface IJSONRPCResponse {
  jsonrpc: string
  id: number
  error?: {
    code: number
    message: string
    data: any
  }
  result?: any
}

const JSONRPC = ({ method, params, id }: IJSONRPCParams): IJSONRPC => ({
  jsonrpc: '2.0',
  method,
  params,
  id,
})

const { CITA_SERVER } = process.env

const citaFetchIns = axios.create({
  baseURL: CITA_SERVER,
  method: 'POST',
  timeout: 5000,
})

const citaFetch = ({ method, params, id }) =>
  citaFetchIns({
    data: JSONRPC({
      method,
      params,
      id: 1,
    }),
  })
    .then(res => {
      const { data, status } = res
      if (status !== 200) throw new Error('Error Status')
      return data
    })
    .then(data => {
      const {
        // id,
        // jsonrpc,
        result,
        error,
      } = data
      if (error) throw new Error(error)
      return result
    })
    .catch(err => console.error(err.stack))

export default (web3?) => {
  if (typeof web3 !== 'undefined') {
    // TODO Web3 Logic
  }
  return class {
    static postId = 0
    static netPeerCount = () =>
      citaFetch({
        method: CITA_METHODS.NET_PEER_COUNT,
        params: [],
        id: 1,
      })
    /**
     * @function getBlockNumber
    null
     * @returns
     */
    static getBlockNumber = () =>
      citaFetch({
        method: CITA_METHODS.CITA_BLOCK_NUMBER,
        params: [],
        id: 1,
      })

    static sendTransaction = (signedData: string) =>
      citaFetch({
        method: CITA_METHODS.SEND_TRANSACTION,
        params: [signedData],
        id: 1,
      })
    static getBlockByHash = ({
      hash,
      detailed,
    }: {
      hash: string
      detailed: boolean
      }) =>
      citaFetch({
        method: CITA_METHODS.GET_BLOCK_BY_HASH,
        params: [hash, detailed],
        id: 1,
      })
    static getBlockByNumber = ({
      quantity,
      detailed,
    }: {
      quantity: string
      detailed: boolean
      }) =>
      citaFetch({
        method: CITA_METHODS.GET_BLOCK_BY_NUMBER,
        params: [quantity, detailed],
        id: 1,
      })

    static getTransactionReceipt = (hash: string) =>
      citaFetch({
        method: CITA_METHODS.ETH_GET_TRANSACTION_RECEIPT,
        params: [hash],
        id: 1,
      })
    // TODO: eth_getLogs
    // TODO: eth_call
    // TODO: cita_getTransaction
    // TODO: eth_getTransactionCount
    // TODO: eth_getCode
    // TODO: eth_getAbi
    // TODO: eth_newFilter
    // TODO: eth_newBlockFilter
    // TODO: eth_uninstallFilter
    // TODO: eth_getFilterChanges
    // TODO: eth_getFilterLogs
    // TODO: cita_getTransactionProof
  }
}
