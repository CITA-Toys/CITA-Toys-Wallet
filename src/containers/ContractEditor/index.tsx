import * as React from 'react'
import Paper from 'material-ui/Paper'
// import { newBlock$ } from '../../utils/observables'
// import observables from '../../utils/observables'

export default class ContractEditor extends React.Component {
  componentWillMount () {
    // observables.newBlock$.subscribe(block => console.log(block))
  }
  render () {
    return <Paper>Editor</Paper>
  }
}
