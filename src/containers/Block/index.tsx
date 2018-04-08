import * as React from 'react'
import Paper from 'material-ui/Paper'
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card'
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel'
import Typography from 'material-ui/Typography'
import ExpandMore from 'material-ui-icons/ExpandMore'

import { withConfig } from '../../contexts/config'
import { withObservables } from '../../contexts/observables'
import { IContainerProps, IBlock } from '../../typings'

const layouts = require('../../styles/layout')
const styles = require('./styles')

const initState: IBlock = {
  hash: '',
  header: {
    timestamp: '',
    prevHash: '',
    number: '',
    stateRoot: '',
    transactionsRoot: '',
    receiptsRoot: '',
    gasUsed: '',
  },
  body: {
    transactions: [],
  },
  version: 0,
}
interface IBlockState extends IBlock {}

interface IBlockProps extends IContainerProps {}
class Block extends React.Component<IBlockProps, IBlockState> {
  readonly state = initState
  componentWillMount () {
    const { blockHash } = this.props.match.params
    if (typeof blockHash === 'string') {
      this.props.CITAObservables.blockByHash(blockHash).subscribe(
        (block: IBlock) => {
          this.setState(state => ({ ...block }))
        },
      )
    }
  }

  render () {
    const { body: { transactions }, hash, header } = this.state
    return (
      <div className={layouts.main}>
        <Card>
          <CardHeader
            title="Block"
            subheader={hash}
            classes={{ subheader: styles.subheader }}
          />
          <CardHeader
            title="Position"
            subheader={`${new Date(
              header.timestamp,
            ).toLocaleString()} at the height of ${header.number}`}
            classes={{
              subheader: styles.subheader,
            }}
          />
          <CardContent>
            <Typography variant="headline">Transactions</Typography>
            {transactions.length ? (
              transactions.map(tx => (
                <ExpansionPanel key={tx.hash}>
                  <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                    <Typography variant="headline">tx.hash</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>tx.details</ExpansionPanelDetails>
                </ExpansionPanel>
              ))
            ) : (
              <Typography variant="headline" align="center">
                No Data
              </Typography>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }
}
export default withConfig(withObservables(Block))
