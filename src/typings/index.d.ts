import CITAObservables from '@cita/observables'
import './block.d'

export * from './block'
/* eslint-disable no-restricted-globals */
export interface IContainerProps {
  CITAObservables: CITAObservables
  history: any
  match: {
    path: string
    params: {
      height?: string
      blockHash?: string
      transaction?: string
      account?: string
    }
  }
}
/* eslint-enable no-restricted-globals */

export interface IContainerState {}
