import * as React from 'react'
import { Link } from 'react-router-dom'
import Paper from 'material-ui/Paper'
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card'
import List, { ListItem, ListItemText } from 'material-ui/List'
import Typography from 'material-ui/Typography'
import ExpandMore from 'material-ui-icons/ExpandMore'
import IconButton from 'material-ui/IconButton'
import BackIcon from 'material-ui-icons/ArrowBack'
import NextIcon from 'material-ui-icons/ArrowForward'

import { withConfig } from '../../contexts/config'
import { withObservables } from '../../contexts/observables'
import { IContainerProps, IBlock } from '../../typings'

const layouts = require('../../styles/layout')
const texts = require('../../styles/text.scss')
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
    proof: {
      Tendermint: {
        proposal: '',
      },
    },
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
  private headerInfo = [
    { key: 'gasUsed', label: 'Gas Used' },
    { key: 'receiptsRoot', label: 'Receipts Root' },
    { key: 'stateRoot', label: 'State Root' },
    { key: 'transactionsRoot', label: 'Transactions Root' },
  ]

  render () {
    const { body: { transactions }, hash, header } = this.state
    return (
      <div className={layouts.main}>
        <Card>
          <CardHeader
            title={
              <div className={styles.blockHeader}>
                Block: <span className={texts.addr}>{hash}</span>
              </div>
            }
            subheader={`${header.timestamp &&
              new Date(+header.timestamp).toLocaleString()}`}
            action={
              <div className={styles.blockHeader}>
                <IconButton>
                  <BackIcon />
                </IconButton>
                {header.number}
                <IconButton>
                  <NextIcon />
                </IconButton>
              </div>
            }
            classes={{ subheader: styles.subheader }}
          />
          <CardContent>
            <List>
              <ListItem>
                <ListItemText
                  primary="MinedBy"
                  secondary={header.proof.Tendermint.proposal}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Parent Hash"
                  secondary={
                    <Link
                      to={header.prevHash}
                      href={header.prevHash}
                      className={texts.addr}
                    >
                      {header.prevHash}
                    </Link>
                  }
                />
              </ListItem>
              {this.headerInfo.map(item => (
                <ListItem key={item.key}>
                  <ListItemText
                    primary={item.label}
                    secondary={header[item.key]}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </div>
    )
  }
}
export default withConfig(withObservables(Block))
