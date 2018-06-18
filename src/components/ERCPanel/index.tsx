import * as React from 'react'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import { ABI, ABIElement } from '../../typings'

const styles = require('./styles.scss')

const Item = ({ label, fields }) => (
  <div className={styles.method}>
    <div className={styles.title}>{label}</div>
    <Divider />
    <div className={styles.fields}>{fields}</div>
  </div>
)
/* eslint-disable no-restricted-globals */
interface ErcPanel {
  abi: ABI
  handleAbiValueChange: (
    index: number,
  ) => (inputIndex: number) => (e: any) => void
  handleEthCall: (index: number) => (e: any) => void
}
/* eslint-enable no-restricted-globals */

const ContractMethod = ({
  abiEl,
  handleAbiValueChange,
  handleEthCall,
}: {
abiEl: ABIElement
index: number
handleAbiValueChange: (inputIndex: number) => (e: any) => void
handleEthCall: (e: any) => void
}) => (
  <Item
    label={abiEl.name}
    fields={
      <React.Fragment>
        <div className={styles.inputs}>
          {abiEl.inputs && abiEl.inputs.length ? (
            abiEl.inputs.map((input, inputIndex) => (
              <input
                key={input.name}
                // label={input.name}
                placeholder={input.name}
                onChange={handleAbiValueChange(inputIndex)}
                value={input.value}
              />
            ))
          ) : (
            <span className={styles.noEls}>No Inputs</span>
          )}
        </div>
        <div className={styles.outputs}>
          {abiEl.outputs && abiEl.outputs.length ? (
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
                <input
                  disabled
                  key={output.name}
                  placeholder={output.name}
                  // label={output.name}
                  value={output.value}
                  onChange={() => {}}
                />
              )
            })
          ) : (
            <span className={styles.noEls}>No Outputs</span>
          )}
        </div>
        <button onClick={handleEthCall}>Submit</button>
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
