import CITAObservables from '@cita/observables'
import './block.d'

export * from './block'
/* eslint-disable no-restricted-globals */
export interface IContainerProps {
  CITAObservables: CITAObservables
  history: any
  match: {
    params: {
      blockHash?: string
    }
  }
}
/* eslint-enable no-restricted-globals */

export interface IContainerState {}
