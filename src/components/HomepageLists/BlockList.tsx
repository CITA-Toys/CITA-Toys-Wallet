import * as React from 'react'
import { Link } from 'react-router-dom'
import { translate } from 'react-i18next'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
// import Avatar from '@material-ui/core/Avatar'
import { IBlock } from '../../typings/'

const texts = require('../../styles/text.scss')
const styles = require('./styles.scss')

export default translate('microscope')(
  ({ blocks, t }: { blocks: IBlock[]; t: (key: string) => string }) => (
    <List>
      {blocks.map((block: IBlock) => (
        <ListItem
          key={block.hash}
          classes={{
            root: styles.listItemContainer,
          }}
        >
          <div className={styles.blockIcon}>
            <span>{t('block')}</span>
            <Link
              to={`/height/${block.header.number}`}
              href={`/height/${block.header.number}`}
            >
              #{+block.header.number}
            </Link>
          </div>
          <ListItemText
            classes={{
              primary: styles.primary,
              secondary: styles.secondary,
              root: styles.listItemTextRoot,
            }}
            primary={
              <React.Fragment>
                <span className={texts.ellipsis}>
                  {t('hash')}:{' '}
                  <Link
                    to={`/block/${block.hash}`}
                    href={`/block/${block.hash}`}
                  >
                    <span className={texts.addr} title={block.hash}>
                      {block.hash}
                    </span>
                  </Link>
                </span>
                <span className={styles.time}>
                  {Math.round((Date.now() - +block.header.timestamp) / 1000)}s{' '}
                  {t('ago')}
                </span>
              </React.Fragment>
            }
            secondary={
              <React.Fragment>
                <div className={texts.ellipsis}>
                  {t('including')} <b>{block.body.transactions.length}</b>{' '}
                  {t('Transactions')}.{' '}
                </div>
                <div className={texts.ellipsis}>
                  {t('proposed by')}{' '}
                  <span className={texts.highlight}>
                    {block.header.proof.Tendermint.proposal}
                  </span>
                </div>
              </React.Fragment>
            }
          />
        </ListItem>
      ))}
    </List>
  ),
)
