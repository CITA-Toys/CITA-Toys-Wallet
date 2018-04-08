import * as React from 'react'
import { IContainerProps } from '../../typings'
import { withObservables } from '../../contexts/observables'

interface HomepageProps extends IContainerProps {}

const iniState = {}
type HomepageState = typeof iniState
class Homepage extends React.Component<HomepageProps, HomepageState> {
  state = iniState
  componentDidMount () {
    this.props.CITAObservables.newBlockNumber(1000)
      .take(1)
      .subscribe(blockNumber =>
        this.blockHistory({ height: blockNumber, count: 10 }),
      )
  }

  private blockHistory = ({ height, count }) => {
    this.props.CITAObservables.blockHistory({
      by: height,
      count,
    }).subscribe(blocks => {
      console.log(blocks)
    })
  }
  render () {
    return <div>homepage</div>
  }
}
export default withObservables(Homepage)
