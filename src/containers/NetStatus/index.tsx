import * as React from 'react'
import Typography from 'material-ui/Typography'
import Toolbar from 'material-ui/Toolbar/'
import Button from 'material-ui/Button'
import Divider from 'material-ui/Divider'
import citaWebPlugin from '../../utils/web3-cita-plugin'
import {
  multicastedNewBlockByNumber$,
  peerCount$,
} from '../../utils/observables'

const CitaWeb3 = citaWebPlugin()

const PlainState = ({ title, value }: { title: string; value: string }) => (
  <div style={{ flex: 1, textAlign: 'center' }}>
    <Typography align="center" variant="headline">
      {title}
    </Typography>
    <Typography align="center" variant="body1">
      {value}
    </Typography>
  </div>
)

const initialState = {
  peerCount: 0,
  blockNumber: '',
  block: {
    body: '',
    hash: '',
    header: {
      gasUsed: '',
      number: '',
      prevHash: '',
      timestamp: '',
    },
    version: 0,
  },
  gasPrice: 0,
  network: process.env.CITA_SERVER || '',
}

type INetState = Readonly<typeof initialState>
export default class NetStatus extends React.Component<any, INetState> {
  static plainStates = [
    { title: 'Peer Count', value: 'peerCount' },
    { title: 'Current Height', value: 'blockNumber' },
    { title: 'Gas Price', value: 'gasPrice' },
    { title: 'Network', value: 'network' },
  ]
  static updateInterval: any
  readonly state = initialState
  componentWillMount () {
    this.fetchStatus()
  }

  private fetchStatus = () => {
    // fetch peer Count
    peerCount$.subscribe(peerCount =>
      this.setState(state => ({ peerCount: peerCount.slice(2) })),
    )
    console.log(multicastedNewBlockByNumber$)
    // fetch Block Number and Block
    multicastedNewBlockByNumber$.subscribe(block => {
      this.setState(state => ({ blockNumber: block.header.number }))
    })
    multicastedNewBlockByNumber$.connect()
  }
  render () {
    const { block } = this.state
    return (
      <Toolbar style={{ display: 'flex' }}>
        {NetStatus.plainStates.map(state => (
          <PlainState {...state} value={this.state[state.value]} />
        ))}
      </Toolbar>
    )
  }
}
