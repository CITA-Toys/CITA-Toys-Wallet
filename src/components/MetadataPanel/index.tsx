import * as React from 'react'
import { Metadata } from '../../typings'

const styles = require('./styles.scss')
const text = require('../../styles/text.scss')

const list = [
  { name: 'Name', value: 'chainName' },
  { name: 'Id', value: 'chainId' },
  { name: 'Operator', value: 'operator' },
  { name: 'Website', value: 'website' },
  { name: 'Genesis Time', value: 'genesisTimestamp' },
  { name: 'Block Interval', value: 'blockInterval' },
]

const MetadataRender = ({ metadata }: { metadata: Metadata }) => (
  <div className={styles.display}>
    {list.map(item => (
      <div key={item.name} className={styles.item}>
        {item.name}:{' '}
        <span className={styles.itemValue}>{metadata[item.value]}</span>
      </div>
    ))}
    <div className={styles.validators}>
      <div className={styles.item}>Validators:</div>
      <div className={styles.box}>
        {metadata.validators.map((validator, index) => (
          <div key={validator} className={text.ellipsis}>
            {index + 1}: {validator}
          </div>
        ))}
      </div>
    </div>
  </div>
)

interface MetadataPanelProps {
  metadata: Metadata
  searchIp: string
  searchResult: Metadata
  handleInput: (key: string) => (e: any) => void
  switchChain: (e) => void
  handleKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

const MetadataPanel: React.SFC<MetadataPanelProps> = ({
  metadata,
  searchIp,
  searchResult,
  handleInput,
  handleKeyUp,
  switchChain,
}) => (
  <div>
    <div className={styles.title}>Active Chain:</div>
    <MetadataRender metadata={metadata} />
    <div className={styles.title}>Other Chain</div>
    <div className={styles.fields}>
      <input
        type="text"
        onChange={handleInput('searchIp')}
        value={searchIp}
        onKeyUp={handleKeyUp}
      />
      <button onClick={switchChain}>切换</button>
    </div>
    {searchResult.chainId !== '' ? (
      <MetadataRender metadata={searchResult} />
    ) : null}
  </div>
)

export default MetadataPanel
