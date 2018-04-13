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

export interface ABIElement {
  constant: boolean
  inputs: { name: string; type: string; value?: string }[]
  name: string
  outputs: { name: string; type: string; value?: string }[]
  payable: boolean
  stateMutability: string
  type: string
}
/* eslint-enable no-restricted-globals */

export type ABI = ABIElement[]

export interface IContainerState {}
