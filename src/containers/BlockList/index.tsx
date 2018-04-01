import * as React from 'react'
import Typography from 'material-ui/Typography'
import List, {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from 'material-ui/List/'
import Divider from 'material-ui/Divider'
import Paper from 'material-ui/Paper'
import Tooltip from 'material-ui/Tooltip'
import ViewListIcon from 'material-ui-icons/ViewList'
import { LinearProgress } from 'material-ui/Progress'
import TextField from 'material-ui/TextField'
import { withObservables, ICITAObservables } from '../../contexts/observables'
import { IBlock } from '../Block'
import { IContainerProps } from '../../typings/'

const layouts = require('../../styles/layout')

const MIN_COUNT = 10
const MAX_COUNT = 600

const TransactionItem = ({
  block,
  handleItemClicked,
}: {
block: IBlock
handleItemClicked: (block: IBlock) => React.MouseEventHandler<HTMLElement>
}) => (
  <React.Fragment>
    <Divider />
    <Tooltip title={block.hash} placement="top">
      <ListItem
        style={{
          cursor: 'pointer',
        }}
        onClick={handleItemClicked(block)}
      >
        <ListItemText
          primary={`${block.hash.slice(0, 5)} when ${new Date(
            block.header.timestamp,
          ).toLocaleString()} at the height of ${block.header.number}`}
          secondary={`Including ${block.body.transactions.length} transactions`}
          title={block.hash}
        />
        <ListItemSecondaryAction>
          <ViewListIcon />
        </ListItemSecondaryAction>
      </ListItem>
    </Tooltip>
  </React.Fragment>
)
interface IBlockListState {
  blocks: IBlock[]
  maxCount: number
}
interface IBlockListProps extends IContainerProps {}

class BlockList extends React.Component<IBlockListProps, IBlockListState> {
  static fetchNewBlockInterval: any
  state = {
    blocks: [],
    maxCount: 50,
  }

  componentWillMount () {
    this.fetchNewBlock()
  }
  private fetchNewBlock = (a = 0) => {
    this.props.CITAObservables.multicastedNewBlockByNumber$.subscribe(
      block =>
        this.setState(state => ({
          blocks: [...state.blocks, block].slice(-1 * MAX_COUNT),
        })),
      console.log,
    )
  }
  private handleInput = stateLabal => e => {
    const { value } = e.target
    if (stateLabal === 'maxCount' && +value < MIN_COUNT) {
      return false
    }
    this.setState(state => ({ [stateLabal]: value }))
    return true
  }
  private handleItemClicked = (block: IBlock) => e => {
    this.props.history.push(`/block/${block.hash}`)
  }

  render () {
    const { blocks, maxCount } = this.state
    const displayedBlocks = blocks.reverse().slice(0, maxCount)
    return (
      <Paper className={layouts.main}>
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
            <List>
              {displayedBlocks.map((block: IBlock) => (
                <TransactionItem
                  block={block}
                  handleItemClicked={this.handleItemClicked}
                  key={block.hash}
                />
              ))}
            </List>
          </React.Fragment>
        ) : (
          <LinearProgress />
        )}
      </Paper>
    )
  }
}
export default withObservables(BlockList)
