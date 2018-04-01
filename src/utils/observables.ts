import { Observable, ReplaySubject } from '@reactivex/rxjs'
import citaWebPlugin from './web3-cita-plugin'

const CitaWeb3 = citaWebPlugin()

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
