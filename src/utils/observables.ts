import { Observable, ReplaySubject } from '@reactivex/rxjs'
// import * as Web3 from 'web3'
import citaWebPlugin from './web3-cita-plugin'

// const provider = new Web3['providers']['HttpProvider'](
//   process.env.CITA_SERVER || '',
// )

// const web3 = Web3(provider)

const Web3Ins = citaWebPlugin()
const CitaWeb3 = Web3Ins.CITA
console.log(Web3Ins)

const INTERVAL = process.env.NODE_ENV === 'production' ? 1000 : 10000

/**
 * @function newBlockNumber$
 * @param
* @returns observable of result in rpc return
 */
export const newBlockNumber$ = Observable.interval(INTERVAL).switchMap(() =>
  CitaWeb3.getBlockNumber(),
)
/**
 * @function blockByNumber$
blockNumber
 */
export const blockByNumber$ = (blockNumber: string) =>
  Observable.fromPromise(
    CitaWeb3.getBlockByNumber({
      quantity: blockNumber,
      detailed: true,
    }),
  )

/**
 * @function blockByHash$
blockHash
 */
export const blockByHash$ = (blockHash: string) =>
  Observable.fromPromise(
    CitaWeb3.getBlockByHash({
      hash: blockHash,
      detailed: true,
    }),
  )

/**
 * @function newBlockByNumber$
 */
export const newBlockByNumber$ = newBlockNumber$
  .distinct()
  .switchMap(blockByNumber$)

/**
 * @function peerCount$
 */
export const peerCount$ = Observable.interval(INTERVAL).switchMap(() =>
  CitaWeb3.netPeerCount(),
)

const newBlockByNumberSubject = new ReplaySubject(10)

/**
 * @subject multicastedNewBlockByNumber
 */
export const multicastedNewBlockByNumber$ = newBlockByNumber$.multicast(
  newBlockByNumberSubject,
)

/*
 * Send Transaction
 */

export const sendTransaction$ = signedData =>
  Observable.fromPromise(CitaWeb3.sendTransaction(signedData))

export const signTx$ = (privKey: string, data: string) =>
  Observable.of(Web3Ins.eth.sign(privKey, data))
