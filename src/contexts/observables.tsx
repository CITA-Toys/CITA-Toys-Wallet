// / <reference path="../typings/react.d.ts" />
import { Observable, ReplaySubject } from 'rxjs'
import * as React from 'react'
import * as CITAObservables from '../utils/observables'

export type ICITAObservables = typeof CITAObservables

const initObservables = CITAObservables
const ObservableContext = React.createContext(initObservables)

export const withObservables = Comp => props => (
  <ObservableContext.Consumer>
    {(observables: ICITAObservables) => (
      <Comp {...props} CITAObservables={observables} />
    )}
  </ObservableContext.Consumer>
)
export const provideObservabls = Comp => props => (
  <ObservableContext.Provider value={initObservables}>
    <Comp {...props} />
  </ObservableContext.Provider>
)

export default ObservableContext
