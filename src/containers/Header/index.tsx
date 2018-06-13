import * as React from 'react'
import { createPortal } from 'react-dom'
import { Subject, Subscription } from '@reactivex/rxjs'
import axios, { AxiosResponse } from 'axios'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import FingerprintIcon from '@material-ui/icons/Fingerprint'
import SettingsIcon from '@material-ui/icons/Settings'
import ViewCarouselIcon from '@material-ui/icons/ViewCarousel'
import FormatShapesIcon from '@material-ui/icons/FormatShapes'
import GraphicIcon from '@material-ui/icons/GraphicEq'
import SearchIcon from '@material-ui/icons/Search'
import { Link } from 'react-router-dom'
import { containers } from '../../Routes'
import { IContainerProps } from '../../typings/index.d'
import RightSidebar from '../../components/RightSidebar'
import MetadataPanel from '../../components/MetadataPanel'
import { withObservables } from '../../contexts/observables'
import { isIp } from '../../utils/validators'

const styles = require('./styles')
const layout = require('../../styles/layout')

const urlGen = keyword => {
  switch (keyword.length) {
    case 64:
    case 66: {
      return `/block/${keyword}`
    }
    case 40:
    case 42: {
      return `/account/${keyword}`
    }
    default: {
      return `/height/${keyword}`
    }
  }
}

const icons = {
  Possession: <FingerprintIcon />,
  Blocks: <ViewCarouselIcon />,
  ContractEditor: <FormatShapesIcon />,
  Config: <SettingsIcon />,
  Graphs: <GraphicIcon />,
}
export interface Metadata {
  chainId: string
  chainName: string
  operator: string
  website: string
  genesisTimestamp: string
  validators: string[]
  blockInterval: number
}
const initMetadata: Metadata = {
  chainId: '',
  chainName: '',
  operator: '',
  website: '',
  genesisTimestamp: '',
  validators: [],
  blockInterval: 0,
}
const initState = {
  keyword: '',
  metadata: initMetadata,
  activePanel: '',
  searchIp: '',
  otherMetadata: initMetadata,
}
type HeaderState = typeof initState
interface HeaderProps extends IContainerProps {}

class Header extends React.Component<HeaderProps, HeaderState> {
  state = initState
  componentWillMount () {
    this.onSearch$ = new Subject()
    console.log(this.props.CITAObservables.server)
  }
  componentDidMount () {
    this.searchSubscription = this.onSearch$
      .debounceTime(1000)
      .subscribe(({ key, value }) => {
        if (key === 'searchIp') {
          this.getChainMetadata(value)
        }
      })
    this.props.CITAObservables.metaData({
      blockNumber: 'latest',
    }).subscribe(
      (metadata: Metadata) => {
        this.setState(state => ({ ...state, metadata }))
      },
      error => {
        console.error(error)
      },
    )
  }
  private onPanelActivate = () => {
    console.log('onPanelActivate')
  }
  private onSearch$: Subject<any>
  getChainMetadata = ip => {
    if (isIp(ip)) {
      axios
        .post(`http://${ip}`, {
          jsonrpc: '2.0',
          method: 'cita_getMetaData',
          params: ['latest'],
          id: 1,
        })
        .then((res: AxiosResponse) => {
          if (res.data && res.data.result) {
            this.setState(state => ({
              otherMetadata: res.data.result,
            }))
          } else {
            throw new Error('Error Response')
          }
        })
        .catch(err => {
          // TODO: handle error
          console.error(err)
        })
    }
  }
  private togglePanel = (panel: string) => e => {
    this.setState(state => ({
      activePanel: panel,
    }))
  }

  protected handleInput = key => (
    e: React.SyntheticEvent<HTMLInputElement>,
  ) => {
    const { value } = e.currentTarget
    if (key === 'searchIp') {
      this.onSearch$.next({ key: 'searchIp', value })
    }
    this.setState(state => ({
      ...state,
      [key]: value,
    }))
  }

  switchChain = () => {
    // console.log(this.state.searchIp)
    this.props.CITAObservables.setServer(
      this.state.searchIp.startsWith('http')
        ? this.state.searchIp
        : `http://${this.state.searchIp}`,
    )
  }
  private searchSubscription: Subscription
  render () {
    return createPortal(
      <React.Fragment>
        <AppBar position="static" color="default" elevation={1}>
          <Toolbar className={layout.center}>
            <Link to="/" href="/" style={{ color: '#000' }}>
              <Typography variant="title" color="inherit">
                {(process.env.APP_NAME as string).toUpperCase()}
              </Typography>
            </Link>
            <div className={styles.navs}>
              {containers.filter(container => container.nav).map(container => (
                <Typography variant="subheading" key={container.name}>
                  <Link
                    to={container.path}
                    href={container.path}
                    className={styles.navItem}
                  >
                    <IconButton color="inherit" aria-label={container.name}>
                      {icons[container.name]}
                    </IconButton>
                    <span>{container.name}</span>
                  </Link>
                </Typography>
              ))}
            </div>
            <div className={styles.rightNavs}>
              {/*
              <TextField
                value={this.state.keyword}
                onChange={this.handleInput('keyword')}
              />
              <Link
                to={urlGen(this.state.keyword)}
                href={urlGen(this.state.keyword)}
              >
                <IconButton style={{ color: '#FFF' }}>
                  <SearchIcon />
                </IconButton>
              </Link>
              */}

              <Button
                className={styles.navItem}
                onClick={this.togglePanel('metadata')}
              >
                {this.state.metadata.chainName}
              </Button>
              <Button
                className={styles.navItem}
                onClick={this.togglePanel('statistics')}
              >
                TPS: 00
              </Button>
              <IconButton
                className={styles.navItem}
                onClick={this.togglePanel('search')}
              >
                <SearchIcon />
              </IconButton>
              <Button className={styles.navItem} onClick={this.togglePanel('')}>
                CN
              </Button>
            </div>
          </Toolbar>
        </AppBar>
        <RightSidebar
          on={this.state.activePanel !== ''}
          // open={true}
          onClose={this.togglePanel('')}
          onOpen={() => {}}
        >
          <MetadataPanel
            metadata={this.state.metadata}
            handleInput={this.handleInput}
            searchIp={this.state.searchIp}
            searchResult={this.state.otherMetadata}
            switchChain={this.switchChain}
          />
        </RightSidebar>
      </React.Fragment>,
      document.getElementById('header') as HTMLElement,
    )
  }
}

export default withObservables(Header)
