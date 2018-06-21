import * as React from 'react'
import { translate } from 'react-i18next'
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

const MetadataRender = translate('microscope')(
  ({ metadata, t }: { metadata: Metadata; t: (key: string) => string }) => (
    <div className={styles.display}>
      {list.map(item => (
        <div key={item.name} className={`${styles.item} ${text.ellipsis}`}>
          {t(item.name)}:{' '}
          <span className={styles.itemValue}>{metadata[item.value]}</span>
        </div>
      ))}
      <div className={styles.validators}>
        <div className={styles.item}>{t('validators')}:</div>
        <div className={styles.box}>
          {metadata.validators.map((validator, index) => (
            <div key={validator} className={`${text.ellipsis} ${text.hash}`}>
              {index + 1}: {validator}
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
)

interface MetadataPanelProps {
  metadata: Metadata
  searchIp: string
  searchResult: Metadata
  handleInput: (key: string) => (e: any) => void
  switchChain: (e) => void
  handleKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => void
  t: (key: string) => string
}

const MetadataPanel: React.SFC<MetadataPanelProps> = ({
  metadata,
  searchIp,
  searchResult,
  handleInput,
  handleKeyUp,
  switchChain,
  t,
}) => (
  <div>
    <div className={styles.title}>
      {t('active')} {t('chain')}:
    </div>
    <MetadataRender metadata={metadata} />
    <div className={styles.title}>
      {t('other')} {t('chain')}
    </div>
    <div className={styles.fields}>
      <input
        type="text"
        onChange={handleInput('searchIp')}
        placeholder="ip:port"
        value={searchIp}
        onKeyUp={handleKeyUp}
      />
      <button onClick={switchChain}>{t('switch')}</button>
    </div>
    {searchResult.chainId !== '' ? (
      <MetadataRender metadata={searchResult} />
    ) : null}
  </div>
)

export default translate('microscope')(MetadataPanel)
