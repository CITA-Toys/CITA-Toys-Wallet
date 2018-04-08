/* eslint-disable */
/// <reference path="../typings/react/index.d.ts" />
/* eslint-enable */
import { Observable, ReplaySubject } from 'rxjs'
import * as React from 'react'
import CITAObservables from '@cita/observables'

export const initObservables: CITAObservables = new CITAObservables({
  server: process.env.CITA_SERVER || '',
  interval: 1000,
})
const ObservableContext = React.createContext(initObservables)

export const withObservables = Comp => props => (
  <ObservableContext.Consumer>
    {(observables: CITAObservables) => (
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
