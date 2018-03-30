import * as React from 'react'
import Typography from 'material-ui/Typography'
import Toolbar from 'material-ui/Toolbar/'
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  ExpansionPanelActions,
} from 'material-ui/ExpansionPanel'
import List, { ListItem, ListItemText } from 'material-ui/List/'
import ExpandMoreIcon from 'material-ui-icons/ExpandMore'
import Chip from 'material-ui/Chip'
import Button from 'material-ui/Button'
import Divider from 'material-ui/Divider'
import { LinearProgress } from 'material-ui/Progress'

import { multicastedNewBlockByNumber$ } from '../../utils/observables'
import citaWebPlugin from '../../utils/web3-cita-plugin'

const CitaWeb3 = citaWebPlugin()

interface IBlock {
  body: {
    transactions: any[]
  }
  hash: string
  header: any
  version: string | number
}
interface IBlockListState {
  blocks: IBlock[]
}

export default class BlockList extends React.Component<
  object,
  IBlockListState
  > {
  static fetchNewBlockInterval: any
  state = {
    blocks: [],
  }

  componentWillMount () {
    this.fetchNewBlock()
  }
  private fetchNewBlock = (a = 0) => {
    multicastedNewBlockByNumber$.subscribe(
      block =>
        this.setState(state => ({
          blocks: [...state.blocks, block],
        })),
      console.log,
    )
  }

  render () {
    const { blocks } = this.state
    if (blocks.length) {
      return (
        <React.Fragment>
          {blocks.map((block: IBlock) => (
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{block.hash.slice(0, 10)}</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Typography variant="caption">
                  Transactions<br />
                </Typography>
                <List>
                  {block.body.transactions.length ? (
                    block.body.transactions.map(tx => (
                      <ListItem key={tx.name}>
                        <ListItemText primary="tx" secondary="tx_details" />
                      </ListItem>
                    ))
                  ) : (
                    <ListItem>
                      <ListItemText primary="没有交易" />
                    </ListItem>
                  )}
                </List>
              </ExpansionPanelDetails>
              <Divider />
              <ExpansionPanelActions>
                <Button size="small" color="primary">
                  Detail
                </Button>
              </ExpansionPanelActions>
            </ExpansionPanel>
          ))}
        </React.Fragment>
      )
    }
    return <LinearProgress />
  }
}
