import * as React from 'react'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import Tooltip from '@material-ui/core/Tooltip'
import ViewListIcon from '@material-ui/icons/ViewList'
import LinearProgress from '@material-ui/core/LinearProgress'
import TextField from '@material-ui/core/TextField'
import { withObservables } from '../../contexts/observables'
import { IContainerProps, IBlock } from '../../typings/'

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
          primary={`${block.hash} when ${new Date(
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
    // this.fetchNewBlock()
  }
  // private fetchNewBlock = (a = 0) => {
  // this.props.CITAObservables.newBlockByNumberSubject.subscribe(
  //   (block: IBlock) =>
  //     this.setState(state => ({
  //       blocks: [...state.blocks, block].slice(-1 * MAX_COUNT),
  //     })),
  //   console.log,
  // )
  // }
  private handleInput = stateLabal => e => {
    const { value } = e.target
    if (stateLabal === 'maxCount' && +value < MIN_COUNT) {
      this.setState(state => ({ maxCount: MIN_COUNT }))
      return true
    }
    this.setState(state => Object.assign({}, state, { [stateLabal]: value }))
    return true
  }
  private handleItemClicked = (block: IBlock) => e => {
    this.props.history.push(`/block/${block.hash}`)
  }

  render () {
    const { blocks, maxCount } = this.state
    const displayedBlocks = [...blocks].reverse().slice(0, maxCount)
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
