import * as React from 'react'
import Paper from 'material-ui/Paper'
import List, { ListItem, ListItemText } from 'material-ui/List'
import Typography from 'material-ui/Typography'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import Icon from 'material-ui/Icon'
import AddIcon from 'material-ui-icons/Add'
import ExpandMoreIcon from 'material-ui-icons/ExpandMore'
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  ExpansionPanelActions,
} from 'material-ui/ExpansionPanel'
import Divider from 'material-ui/Divider'
import DeleteIcon from 'material-ui-icons/Delete'

import { withObservables, ICITAObservables } from '../../contexts/observables'
import { withConfig, IConfig } from '../../contexts/config'

const layouts = require('../../styles/layout')

export interface IConfigPageProps {
  config: IConfig
  CITAObservables: ICITAObservables
}

const initState = {
  server: '',
  serverError: false,
  serverHelperText: '',
}
export type IConfigPageState = typeof initState

class ConfigPage extends React.Component<IConfigPageProps, IConfigPageState> {
  state = initState
  private handleInput = stateLabel => e => {
    // const value = e.target.value
    const { value } = e.target
    this.setState(state => ({
      ...state,
      [stateLabel]: value,
      serverError: false,
      serverHelperText: '',
    }))
  }
  private handleSubmit = (actionName: string) => e => {
    switch (actionName) {
      case 'addServer': {
        if (/\d+:\d+/.test(this.state.server)) {
          this.props.config.addServer(this.state.server)
          return true
        }
        this.setState(state => ({
          ...state,
          serverError: true,
          serverHelperText: 'Invalid Format',
        }))
        return false
      }
      default: {
        return false
      }
    }
  }
  render () {
    return (
      <div className={layouts.main}>
        <ServerConfig
          server={this.state.server}
          serverError={this.state.serverError}
          serverHelperText={this.state.serverHelperText}
          serverList={this.props.config.serverList}
          deleteServer={this.props.config.deleteServer}
          handleInput={this.handleInput}
          handleSubmit={this.handleSubmit}
        />
      </div>
    )
  }
}

const ServerConfig = ({
  server,
  serverError,
  serverHelperText,
  serverList,
  deleteServer,
  handleInput,
  handleSubmit,
}) => (
  <ExpansionPanel defaultExpanded>
    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
      <Typography variant="headline">Server List</Typography>
    </ExpansionPanelSummary>
    <Divider />
    <ExpansionPanelDetails>
      <List style={{ width: '100%' }}>
        {serverList.map((_server, idx) => (
          <ListItem>
            <ListItemText primary={_server} />
            <DeleteIcon onClick={() => deleteServer(idx)} />
          </ListItem>
        ))}
      </List>
    </ExpansionPanelDetails>
    <Divider />
    <ExpansionPanelActions>
      <TextField
        value={server}
        onChange={handleInput('server')}
        label="Add New Server"
        placeholder="host:port"
        error={serverError}
        helperText={serverHelperText}
        fullWidth
      />
      <Button variant="flat" onClick={handleSubmit('addServer')}>
        Add
      </Button>
    </ExpansionPanelActions>
  </ExpansionPanel>
)

export default withConfig(withObservables(ConfigPage))
