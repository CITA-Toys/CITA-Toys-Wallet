import * as React from 'react'
import citaWebPlugin from 'cita-web3-plugin'

const CitaWeb3 = citaWebPlugin().CITA
export default class extends React.Component {
  fetchBlockNumber = () => {
    CitaWeb3.getBlockNumber().then(console.log)
  }
  fetchPeerCount = () => {
    CitaWeb3.netPeerCount().then(console.log)
  }
  render () {
    return (
      <div>
        <button onClick={this.fetchPeerCount}>peerCount</button>
        <button onClick={this.fetchBlockNumber}>blockNumber</button>
      </div>
    )
  }
}
