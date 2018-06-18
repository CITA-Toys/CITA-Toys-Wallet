import * as React from 'react'
import { Timestamp } from '../../typings'

const styles = require('./styles.scss')

/* eslint-disable no-use-before-define */
interface BriefStatistics {
  peerCount: number
  number: string
  timestamp: Timestamp
  proposal: string
  tps: number
  tpb: number
  ipb: number
}
/* eslint-enable no-use-before-define */

const BriefStatistics: React.SFC<BriefStatistics> = ({
  peerCount,
  number,
  timestamp,
  proposal,
  tps,
  tpb,
  ipb,
}) => (
  <div className={styles.briefStatistics}>
    <div>
      peerCount: <span>{peerCount}</span>
    </div>
    <div>
      blockNumber: <span>{number}</span>
    </div>
    <div>
      time: <span>{new Date(timestamp).toLocaleString()}</span>
    </div>
    <div>
      validators: <span>{proposal.slice(0, 20)}...</span>
    </div>
    <div>
      TPS: <span>{tps}</span>
    </div>
    <div>
      TPB: <span>{tpb}</span>
    </div>
    <div>
      IPB: <span>{ipb}</span>
    </div>
  </div>
)
export default BriefStatistics
