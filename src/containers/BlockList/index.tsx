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
import TextField from 'material-ui/TextField'
import { withObservables, ICITAObservables } from '../../contexts/observables'

interface IBlock {
  body: {
    transactions: any[]
  }
  hash: string
  header: any
  version: string | number
}

const TransactionItem = ({ block }: { block: IBlock }) => (
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
)
interface IBlockListState {
  blocks: IBlock[]
  maxCount: number
}
interface IBlockListProps {
  CITAObservables: ICITAObservables
}

class BlockList extends React.Component<IBlockListProps, IBlockListState> {
  static fetchNewBlockInterval: any
  state = {
    blocks: [],
    maxCount: 100,
  }

  componentWillMount () {
    this.fetchNewBlock()
  }
  private fetchNewBlock = (a = 0) => {
    this.props.CITAObservables.multicastedNewBlockByNumber$.subscribe(
      block =>
        this.setState(state => ({
          blocks: [...state.blocks, block],
        })),
      console.log,
    )
  }
  private handleInput = stateLabal => e => {
    let { value } = e.target
    if (stateLabal === 'maxCount' && +value < 10) {
      value = 10
      console.log(value)
    }
    this.setState(state => ({ [stateLabal]: value }))
  }

  render () {
    const { blocks, maxCount } = this.state
    return (
      <React.Fragment>
        <div style={{ textAlign: 'right' }}>
          <TextField
            label="Max Count of Items"
            value={maxCount}
            type="number"
            onChange={this.handleInput('maxCount')}
          />
        </div>

        {blocks.length ? (
          <React.Fragment>
            {blocks.map((block: IBlock) => <TransactionItem block={block} />)}
          </React.Fragment>
        ) : (
          <LinearProgress />
        )}
      </React.Fragment>
    )
  }
}
export default withObservables(BlockList)
