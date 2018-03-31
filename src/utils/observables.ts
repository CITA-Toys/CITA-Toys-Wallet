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
export const newBlockByNumber$ = newBlockNumber$
  .distinct()
  .switchMap(blockNumber =>
    CitaWeb3.getBlockByNumber({ quantity: blockNumber, detailed: true }),
  )
export const peerCount$ = Observable.interval(INTERVAL).switchMap(() =>
  CitaWeb3.netPeerCount(),
)

const newBlockByNumberSubject = new ReplaySubject(10)

export const multicastedNewBlockByNumber$ = newBlockByNumber$.multicast(
  newBlockByNumberSubject,
)
