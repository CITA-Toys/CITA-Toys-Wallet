import * as React from 'react'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  ExpansionPanelActions,
} from 'material-ui/ExpansionPanel'
import ExpandMoreIcon from 'material-ui-icons/ExpandMore'
import Chip from 'material-ui/Chip'
import Button from 'material-ui/Button'
import Divider from 'material-ui/Divider'
import citaWebPlugin from '../../utils/web3-cita-plugin'

const CitaWeb3 = citaWebPlugin()

const Tile = ({ title, children }) => (
  <div style={{ flex: 1, textAlign: 'center' }}>
    <Typography align="center" variant="headline">
      {title}
    </Typography>
    {children}
  </div>
)

interface IBlock {
  body: any
  hash: string
  header: any
  version: string | number
}

interface INetState {
  peerCount: number
  blockNumber: string
  block: IBlock
  blocks: IBlock[]
}
export default class NetStatus extends React.Component<any, INetState> {
  static stateTiles = ['peerCount', 'blockNumber', 'block']
  static updateInterval: any
  state = {
    peerCount: 0,
    blockNumber: '',
    block: {
      body: null,
      hash: '',
      header: null,
      version: 0,
    },
    blocks: [],
  }
  componentWillMount () {
    this.fetchStatus()
    NetStatus.updateInterval = setInterval(this.fetchStatus, 50000)
  }
  componentWillUnmount () {
    clearInterval(NetStatus.updateInterval)
  }

  fetchStatus = () => {
    this.fetchPeerCount()
    this.fetchBlockInfo()
  }

  fetchBlockInfo = () => {
    CitaWeb3.getBlockNumber().then(blockNumber =>
      CitaWeb3.getBlockByNumber({
        quantity: blockNumber,
        detailed: true,
      }).then(block =>
        this.setState(state => ({
          blockNumber,
          block,
          blocks: [...state.blocks, block].slice(0, 10),
        })),
      ),
    )
  }
  fetchPeerCount = () => {
    CitaWeb3.netPeerCount().then(peerCount =>
      this.setState(state => ({ peerCount })),
    )
  }
  render () {
    const { peerCount, blockNumber, block, blocks } = this.state
    return (
      <Paper>
        <div style={{ display: 'flex' }}>
          <Tile title="Peer Count">{peerCount}</Tile>
          <Tile title="Current Height">{blockNumber}</Tile>
        </div>
        <Tile title="Current Block">
          <div>
            <p style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Hash: {block.hash}
            </p>
            <p>Version: {block.version}</p>
          </div>
        </Tile>
        <div>
          {blocks.length ? (
            blocks.map((blockItem: IBlock) => (
              <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <div style={{ display: 'flex' }}>
                    <Typography>{blockItem.hash.slice(0, 5)}</Typography>
                    <Typography>
                      {blockItem.header.prevHash.slice(0, 5)}
                    </Typography>
                    <Typography>
                      {blockItem.body.transactions.length}
                    </Typography>
                    <Typography>
                      {new Date(
                        blockItem.header.timestamp,
                      ).toLocaleTimeString()}
                    </Typography>
                  </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  {blockItem.body.transactions.map(tx => (
                    <div>
                      <Typography variant="caption">tx number</Typography>
                    </div>
                  ))}
                </ExpansionPanelDetails>
                <Divider />
                <ExpansionPanelActions>
                  <Button size="small" color="primary">
                    Detail
                  </Button>
                </ExpansionPanelActions>
              </ExpansionPanel>
            ))
          ) : (
            <div style={{ textAlign: 'center' }}>
              <Typography>暂无信息</Typography>
            </div>
          )}
        </div>
      </Paper>
    )
  }
}
