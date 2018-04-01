import { IContainerProps } from './index.d'
import { ICITAObservables } from './../contexts/observables'

/* eslint-disable no-restricted-globals */
export interface IContainerProps {
  CITAObservables: ICITAObservables
  history: any
  match: {
    params: {
      blockHash?: string
    }
  }
}
/* eslint-enable no-restricted-globals */

export interface IContainerState {}
