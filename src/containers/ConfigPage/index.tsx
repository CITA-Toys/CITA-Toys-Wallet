import * as React from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import TextField from '@material-ui/core/TextField'

import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Divider from '@material-ui/core/Divider'
import Switch from '@material-ui/core/Switch'
import CITAObservables from '@cita/observables'

import { PanelConfigs } from '../../config/localstorage'
import { initPanelConfigs } from '../../initValues'
import { withObservables } from '../../contexts/observables'
import { withConfig, IConfig } from '../../contexts/config'

const layouts = require('../../styles/layout')
const styles = require('./styles.scss')

/* eslint-disable no-use-before-define */
interface ConfigItem {
  panel: ConfigPanel
  type: ConfigType
  key: string
  title: string
}
/* eslint-enable no-use-before-define */

enum ConfigType {
  DISPLAY,
  COUNT,
  ITEMS,
  VALUE,
}

enum ConfigPanel {
  GENERAL = 'general',
  HEADER = 'header',
  BLOCK = 'block',
  TRANSACTION = 'transaction',
  GRAPH = 'graph',
}

export interface IConfigPageProps {
  config: IConfig
  CITAObservables: CITAObservables
}

export interface IConfigPageState {
  configs: PanelConfigs
}

const initState: IConfigPageState = {
  configs: initPanelConfigs,
}

const ConfigItem = ({
  config,
  index,
  value,
  handleSwitch,
  handleInput,
}: {
config: ConfigItem
index: number
value: number | string | boolean | undefined
handleSwitch: (key: string) => (e: any) => void
handleInput: (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => void
}) => (
  <ListItem key={config.key}>
    <ListItemText
      primary={`${config.type === ConfigType.DISPLAY ? 'Display' : 'Set'} ${
        config.title
      }`}
    />
    <ListItemSecondaryAction>
      {config.type === ConfigType.DISPLAY ? (
        <Switch onChange={handleSwitch(config.key)} checked={!!value} />
      ) : (
        <div>
          <TextField value={`${value}`} onChange={handleInput(config.key)} />
        </div>
      )}
    </ListItemSecondaryAction>
  </ListItem>
)

const Config = ({ title, configs, values, handleSwitch, handleInput }) => (
  <ExpansionPanel defaultExpanded classes={{ root: styles.panel }}>
    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
      <Typography variant="caption" classes={{ caption: styles.panelTitle }}>
        {`${title} Config`}
      </Typography>
    </ExpansionPanelSummary>
    <Divider />
    <ExpansionPanelDetails>
      <List style={{ width: '100%' }}>
        {configs.map((config, idx) => (
          <ConfigItem
            key={config.key}
            config={config}
            index={idx}
            value={values[config.key]}
            handleSwitch={handleSwitch}
            handleInput={handleInput}
          />
        ))}
      </List>
    </ExpansionPanelDetails>
    <Divider />
  </ExpansionPanel>
)

class ConfigPage extends React.Component<IConfigPageProps, IConfigPageState> {
  // state: IConfigPageState
  constructor (props) {
    super(props)
    this.state = {
      configs: this.props.config.panelConfigs,
    }
  }
  configs = [
    {
      panel: ConfigPanel.GENERAL,
      type: ConfigType.VALUE,
      key: 'logo',
      title: 'logo',
    },
    {
      panel: ConfigPanel.HEADER,
      type: ConfigType.DISPLAY,
      key: 'TPS',
      title: 'TPS',
    },
    {
      panel: ConfigPanel.BLOCK,
      type: ConfigType.DISPLAY,
      key: 'blockHeight',
      title: 'height',
    },
    {
      panel: ConfigPanel.BLOCK,
      type: ConfigType.DISPLAY,
      key: 'blockHash',
      title: 'hash',
    },
    {
      panel: ConfigPanel.BLOCK,
      type: ConfigType.DISPLAY,
      key: 'blockAge',
      title: 'age',
    },
    {
      panel: ConfigPanel.BLOCK,
      type: ConfigType.DISPLAY,
      key: 'blockTransactions',
      title: 'transactions',
    },
    {
      panel: ConfigPanel.BLOCK,
      type: ConfigType.DISPLAY,
      key: 'blcokGasUsed',
      title: 'gas used',
    },
    {
      panel: ConfigPanel.BLOCK,
      type: ConfigType.VALUE,
      key: 'blockPageSize',
      title: 'page size',
    },
    {
      panel: ConfigPanel.TRANSACTION,
      type: ConfigType.DISPLAY,
      key: 'transactionHash',
      title: 'hash',
    },
    {
      panel: ConfigPanel.TRANSACTION,
      type: ConfigType.DISPLAY,
      key: 'transactionFrom',
      title: 'from',
    },
    {
      panel: ConfigPanel.TRANSACTION,
      type: ConfigType.DISPLAY,
      key: 'transactionTo',
      title: 'to',
    },
    {
      panel: ConfigPanel.TRANSACTION,
      type: ConfigType.DISPLAY,
      key: 'transactionValue',
      title: 'value',
    },
    {
      panel: ConfigPanel.TRANSACTION,
      type: ConfigType.DISPLAY,
      key: 'transactionAge',
      title: 'age',
    },
    {
      panel: ConfigPanel.TRANSACTION,
      type: ConfigType.DISPLAY,
      key: 'transactionBlockNumber',
      title: 'block number',
    },
    {
      panel: ConfigPanel.TRANSACTION,
      type: ConfigType.DISPLAY,
      key: 'transactionGasUsed',
      title: 'gas used',
    },
    {
      panel: ConfigPanel.TRANSACTION,
      type: ConfigType.VALUE,
      key: 'transactionPageSize',
      title: 'page size',
    },
    {
      panel: ConfigPanel.GRAPH,
      type: ConfigType.DISPLAY,
      key: 'graphIPB',
      title: 'Interval/Block',
    },
    {
      panel: ConfigPanel.GRAPH,
      type: ConfigType.DISPLAY,
      key: 'graphTPB',
      title: 'Transactions/Block',
    },
    {
      panel: ConfigPanel.GRAPH,
      type: ConfigType.DISPLAY,
      key: 'graphGasUsedBlock',
      title: 'Gas Used/Block',
    },
    {
      panel: ConfigPanel.GRAPH,
      type: ConfigType.DISPLAY,
      key: 'graphGasUsedTx',
      title: 'Gas Used/Transaction',
    },
    {
      panel: ConfigPanel.GRAPH,
      type: ConfigType.DISPLAY,
      key: 'graphProposals',
      title: 'Proposals/Block',
    },
    {
      panel: ConfigPanel.GRAPH,
      type: ConfigType.VALUE,
      key: 'graphMaxCount',
      title: 'MaxCount',
    },
  ] as ConfigItem[]
  private handleSwitch = key => (e: any) => {
    this.setState(state => {
      const { configs } = this.state
      const newConfig = { ...configs, [key]: !configs[key] }
      if (this.props.config.changePanelConfig(newConfig)) {
        return { configs: newConfig }
      }
      return state
    })
  }
  private handleInput = key => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget
    this.setState(state => {
      const { configs } = state
      const newConfig = { ...configs, [key]: value }
      if (this.props.config.changePanelConfig(newConfig)) {
        return { configs: newConfig }
      }
      return state
    })
  }
  private panels = [
    // ConfigPanel.GENERAL,
    ConfigPanel.HEADER,
    ConfigPanel.BLOCK,
    ConfigPanel.TRANSACTION,
    ConfigPanel.GRAPH,
  ]
  render () {
    return (
      <div className={styles.main}>
        {this.panels.map(panel => (
          <Config
            title={panel}
            key={panel}
            configs={this.configs.filter(config => config.panel === panel)}
            values={this.state.configs}
            handleSwitch={this.handleSwitch}
            handleInput={this.handleInput}
          />
        ))}
      </div>
    )
  }
}

export default withConfig(withObservables(ConfigPage))
