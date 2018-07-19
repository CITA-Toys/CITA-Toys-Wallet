import * as React from 'react'
import {
  Paper,
  Button,
  TextField,
  Typography,
  Divider,
  MenuItem,
} from '@material-ui/core'
import { withConfig } from '../../contexts/config'
import { withObservables } from '../../contexts/observables'
import { IContainerProps } from '../../typings/'

const layouts = require('../../styles/layout')

const initEditorState = {
  byteCode: '',
  result: '',
  resultError: false,
  resultErrorText: '',
  privKeys: ['test', 'tset2', 'test3'],
  selectedKey: 'test',
}

type IContractEditorState = typeof initEditorState
interface IContractEditorProps extends IContainerProps {}

class ContractEditor extends React.Component<
  IContractEditorProps,
  IContractEditorState
  > {
  readonly state = initEditorState
  componentWillMount () {
    // observables.newBlock$.subscribe(block => console.log(block))
  }
  // componentDidCatch (e) {
  //   console.log('catch', e)
  // }
  private submit = e => {
    this.props.CITAObservables.sendTransaction(this.state.byteCode).subscribe(
      (result: any) => {
        this.setState(state => ({
          result,
          resultError: false,
          resultErrorText: '',
        }))
      },
      error => {
        this.setState({
          result: error.message,
          resultError: true,
          resultErrorText: 'Error Received',
        })
      },
    )
  }
  private handleChange = name => e => {
    const { value } = e.target
    this.setState(state => Object.assign({}, state, { [name]: value }))
  }
  render () {
    return (
      <Paper className={layouts.main}>
        <Typography variant="headline">Editor</Typography>
        <Divider />
        <TextField
          value={this.state.byteCode}
          onInput={this.handleChange('byteCode')}
          multiline
          rows={15}
          fullWidth
        />
        <TextField
          id="select-currency"
          select
          label="Select"
          value={this.state.selectedKey}
          onChange={this.handleChange('selectedKey')}
          SelectProps={{ MenuProps: {} }}
          helperText="Please select your currency"
          margin="normal"
        >
          {this.state.privKeys.map(option => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <Button variant="raised" onClick={this.submit}>
          Send
        </Button>
        <TextField
          value={this.state.result}
          multiline
          rows={5}
          fullWidth
          label="Response"
          error={this.state.resultError}
          helperText={this.state.resultErrorText}
        />
      </Paper>
    )
  }
}

// withConfig(withObservables(ContractEditor))
