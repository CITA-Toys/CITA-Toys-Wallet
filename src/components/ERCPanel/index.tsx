import * as React from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import Chip from '@material-ui/core/Chip'
import SearchIcon from '@material-ui/icons/Search'
import ArrowIcon from '@material-ui/icons/TrendingFlat'
import { ABI, ABIElement } from '../../typings'

const Item = ({ label, field }) => (
  <ListItem>
    <ListItemText
      primary={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {label}: {field}
        </div>
      }
    />
  </ListItem>
)
/* eslint-disable no-restricted-globals */
interface ErcPanel {
  abi: ABI
  handleAbiValueChange: (
    index: number
  ) => (inputIndex: number) => (e: any) => void
  handleEthCall: (index: number) => (e: any) => void
}
/* eslint-enable no-restricted-globals */

const ContractMethod = ({
  abiEl,
  index,
  handleAbiValueChange,
  handleEthCall
}: {
abiEl: ABIElement
index: number
handleAbiValueChange: (inputIndex: number) => (e: any) => void
handleEthCall: (e: any) => void
}) => (
  <Item
    label={abiEl.name}
    field={
      <React.Fragment>
        {abiEl.inputs &&
          abiEl.inputs.map((input, inputIndex) => (
            <TextField
              key={input.name}
              label={input.name}
              placeholder={input.name}
              onChange={handleAbiValueChange(inputIndex)}
              value={input.value}
            />
          ))}{' '}
        <ArrowIcon />{' '}
        {abiEl.outputs &&
          abiEl.outputs.map(output => {
            if (output.value && output.value.match(/jpg|png|gif/)) {
              return (
                <img
                  src={output.value}
                  key={output.name}
                  alt="img"
                  style={{ height: '100px' }}
                />
              )
            }
            return (
              <TextField
                disabled
                key={output.name}
                label={output.name}
                value={output.value}
                onChange={() => {}}
              />
            )
          })}
        <IconButton onClick={handleEthCall}>
          <SearchIcon />
        </IconButton>
      </React.Fragment>
    }
  />
)

const ERCPanel: React.SFC<ErcPanel> = props => (
  <List>
    {props.abi.map((abiEl, index) => (
      <ContractMethod
        abiEl={abiEl}
        index={index}
        key={abiEl.name}
        handleAbiValueChange={props.handleAbiValueChange(index)}
        handleEthCall={props.handleEthCall(index)}
      />
    ))}
  </List>
)

export default ERCPanel
