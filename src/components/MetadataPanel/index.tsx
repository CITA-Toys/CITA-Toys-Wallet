import * as React from 'react'
import { Metadata } from '../../containers/Header'

const list = [
  { name: 'Name', value: 'chainName' },
  { name: 'Id', value: 'chainId' },
  { name: 'Operator', value: 'operator' },
  { name: 'Website', value: 'website' },
  { name: 'Genesis Time', value: 'genesisTimestamp' },
  { name: 'Block Interval', value: 'blockInterval' },
]

const MetadataRender = ({ metadata }: { metadata: Metadata }) => (
  <div>
    {list.map(item => (
      <div key={item.name}>
        {item.name}: {metadata[item.value]}
      </div>
    ))}
    <div>
      <div>Validators</div>
      <div>
        {metadata.validators.map((validator, index) => (
          <div key={validator}>
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
}

const MetadataPanel: React.SFC<MetadataPanelProps> = ({
  metadata,
  searchIp,
  searchResult,
  handleInput,
  switchChain,
}) => (
  <div>
    <div>Active Chain:</div>
    <MetadataRender metadata={metadata} />
    <div>Other Chain</div>
    <input type="text" onChange={handleInput('searchIp')} value={searchIp} />
    <button onClick={switchChain}>切换</button>
    <MetadataRender metadata={searchResult} />
  </div>
)

export default MetadataPanel
