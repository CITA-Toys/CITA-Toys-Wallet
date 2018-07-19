import * as React from 'react'
import * as echarts from 'echarts'
import { Observable } from '@reactivex/rxjs'
import { Card, CardContent } from '@material-ui/core'
import { withObservables } from '../../contexts/observables'
import { withConfig } from '../../contexts/config'
import {
  IContainerProps,
  IBlock,
  BlockNumber,
  Timestamp,
  TransactionFromServer,
  ProposalFromServer,
  Hash,
} from '../../typings/'
import Banner from '../../components/Banner'
import ErrorNotification from '../../components/ErrorNotification'
import { BarOption, PieOption } from '../../config/graph'
import { fetchTransactions, fetchStatistics } from '../../utils/fetcher'
import hideLoader from '../../utils/hideLoader'
import { handleError, dismissError } from '../../utils/handleError'

const layout = require('../../styles/layout.scss')
const styles = require('./graph.scss')

const initState = {
  blocks: [] as IBlock[],
  transactions: [] as TransactionFromServer[],
  proposals: [] as ProposalFromServer[],
  loadBlockHistory: false,
  maxCount: 100,
  error: {
    code: '',
    message: '',
  },
}

interface GraphsProps extends IContainerProps {}
type GraphState = typeof initState
type BlockGraphData = [BlockNumber, Timestamp, number, string]
type TxGraphData = [Hash, number]
type ProposalData = [string, number]

const getBlockSource = ({ blocks = this.state.blocks }) => {
  if (blocks.length <= 1) return []
  const source: BlockGraphData[] = []
  // form the source , x = height, y = interval, tx count, gas used
  blocks.reduce((prev, curr) => {
    source.push([
      (curr as IBlock).header.number, // height
      +(curr as IBlock).header.timestamp - +(prev as IBlock).header.timestamp, // interval
      (curr as IBlock).body.transactions.length, // tx count
      (curr as IBlock).header.gasUsed,
    ])
    return curr
  })
  const graphSource = [
    ['Blocks', 'Block Interval', 'Transactions', 'Gas Used'],
    ...source,
  ]
  return graphSource
}
const getTxSource = ({ txs = this.state.transactions }) => {
  const source: TxGraphData[] = txs.length
    ? txs.map(tx => [tx.hash, tx.gasUsed])
    : []
  const graphSource = [['Transactions', 'Gas Used'], ...source]
  return graphSource
}

const getProposalSource = ({ proposals = this.state.proposals }) => {
  const source: ProposalData[] = proposals.length
    ? proposals.map(p => [`${p.validator.slice(0, 5)}...`, p.count])
    : []
  const graphSource = [['Validators', 'Count'], ...source]
  return graphSource
}

class Graphs extends React.Component<GraphsProps, GraphState> {
  readonly state = initState
  componentWillMount () {
    this.setMaxCount()
    this.startListening()
    const source = Observable.fromEvent(window, 'resize')
    source.debounceTime(500).subscribe(() => {
      if (this.blockGraph) {
        this.blockGraph.resize()
      }
      if (this.txCountGraph) {
        this.txCountGraph.resize()
      }
      if (this.gasUsedGraph) {
        this.gasUsedGraph.resize()
      }
      if (this.txGasUsedGraph) {
        this.txGasUsedGraph.resize()
      }
      if (this.proposalsGraph) {
        this.proposalsGraph.resize()
      }
    })
  }

  componentDidMount () {
    hideLoader()
    this.initGraphs()
  }
  componentDidCatch (err) {
    this.handleError(err)
  }
  // private graphSource: any[] = []
  // private updateAllDiagram = () => {}
  // private updateDiagram = ({ chart, data }) => {}

  private setMaxCount = () => {
    const { graphMaxCount: maxCount } = this.props.config.panelConfigs
    this.setState({ maxCount })
  }
  // declare chart variables
  private blockGraph: any
  private txCountGraph: any
  private gasUsedGraph: any
  private txGasUsedGraph: any
  private proposalsGraph: any
  private blockGraphDOM: HTMLDivElement | null
  private txCountGraphDOM: HTMLDivElement | null
  private gasUsedGraphDOM: HTMLDivElement | null
  private txGasUsedGraphDOM: HTMLDivElement | null
  private proposalsGraphDOM: HTMLDivElement | null
  private initGraphs = () => {
    // init chart dom
    const { panelConfigs } = this.props.config
    if (panelConfigs.graphIPB) {
      this.blockGraph = this.initGraph(this.blockGraphDOM as HTMLDivElement)
    }
    if (panelConfigs.graphTPB) {
      this.txCountGraph = this.initGraph(this.txCountGraphDOM as HTMLDivElement)
    }
    if (panelConfigs.graphGasUsedBlock) {
      this.gasUsedGraph = this.initGraph(this.gasUsedGraphDOM as HTMLDivElement)
    }
    if (panelConfigs.graphGasUsedTx) {
      this.txGasUsedGraph = this.initGraph(this
        .txGasUsedGraphDOM as HTMLDivElement)
    }
    if (panelConfigs.graphProposals) {
      this.proposalsGraph = this.initGraph(this
        .proposalsGraphDOM as HTMLDivElement)
    }
  }
  private initGraph = (dom: HTMLDivElement) => {
    const graph = echarts.init(dom)
    graph.showLoading()
    return graph
  }
  private startListening = () => {
    this.props.CITAObservables.newBlockByNumberSubject.subscribe(
      block => {
        if (block.hash) {
          this.handleNewBlock(block)
          this.updateTransactions()
          this.updateProposals()
        } else {
          throw new Error(block)
        }
      },
      // error => console.error(error),
      this.handleError,
    )
  }
  private updateProposals = () => {
    fetchStatistics({ type: 'proposals' })
      .then(({ result = [] }) => {
        this.setState(state => ({ ...state, proposals: result }))
        const source = getProposalSource({ proposals: result })
        const proposalOption = {
          ...PieOption,
          title: {
            text: 'Proposal Distribution',
            textStyle: {
              fontSize: 16,
            },
          },
          color: ['#415dfc', '#ab62f1', '#fca441', '#4db7f8'],
          radius: ['50%', '70%'],
          dataset: { source },
        }
        this.updateGraph({
          graph: this.proposalsGraph,
          option: proposalOption,
        })
        // this.update
      })
      .catch(this.handleError)
  }
  private updateTransactions = () => {
    fetchTransactions({ limit: this.state.maxCount })
      .then(({ result: { transactions: txs } }) => {
        txs.reverse()
        this.setState(state => ({
          ...state,
          transactions: txs,
        }))
        const source = getTxSource({ txs })
        const txGasUsedOption = {
          title: {
            text: 'Gas Used/Transaction',
          },
          color: ['#ab62f1'],
          ...BarOption,
          dataset: { source: source.map(item => [item[0], item[1]]) },
        }
        if (this.props.config.panelConfigs.graphGasUsedTx) {
          this.updateGraph({
            graph: this.txGasUsedGraph,
            option: txGasUsedOption,
          })
        }
      })
      .catch(this.handleError)
  }
  private handleNewBlock = block => {
    const { panelConfigs } = this.props.config
    this.setState(state => {
      const blocks = [...state.blocks, block].slice(-this.state.maxCount)
      if (this.blockGraph && blocks.length > 1) {
        const source = getBlockSource({ blocks })
        const timeCostOption = {
          title: {
            text: 'Interval/Block',
            textStyle: {
              fontSize: 16,
            },
          },
          color: ['#415dfc'],
          ...BarOption,
          dataset: { source: source.map(item => [item[0], item[1]]) },
        }
        const txCountOption = {
          title: {
            text: 'Transactions/Block',
            textStyle: {
              fontSize: 16,
            },
          },
          color: ['#fca441'],
          ...BarOption,
          dataset: { source: source.map(item => [item[0], item[2]]) },
        }
        const gasUsedOption = {
          title: {
            text: 'Gas Used/Block',
            textStyle: {
              fontSize: 16,
            },
          },
          color: ['#4db7f8'],
          ...BarOption,
          dataset: { source: source.map(item => [item[0], item[3]]) },
        }
        if (panelConfigs.graphIPB) {
          this.updateGraph({ graph: this.blockGraph, option: timeCostOption })
        }
        if (panelConfigs.graphTPB) {
          this.updateGraph({ graph: this.txCountGraph, option: txCountOption })
        }
        if (panelConfigs.graphGasUsedBlock) {
          this.updateGraph({ graph: this.gasUsedGraph, option: gasUsedOption })
        }
      }
      return { blocks }
    })
  }
  private updateGraph = ({ graph, option }) => {
    graph.setOption(option)
    graph.hideLoading()
  }
  private handleError = handleError(this)
  private dismissError = dismissError(this)
  render () {
    return (
      <React.Fragment>
        <Banner bg={`${process.env.PUBLIC}/banner/banner-Statistics.png`}>
          Statistics
        </Banner>
        <div className={layout.center}>
          <div className={styles.graphs}>
            <Card>
              <CardContent>
                <div
                  ref={el => (this.blockGraphDOM = el)}
                  className={styles.graphContainer}
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div
                  ref={el => (this.txCountGraphDOM = el)}
                  className={styles.graphContainer}
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div
                  ref={el => (this.gasUsedGraphDOM = el)}
                  className={styles.graphContainer}
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div
                  ref={el => (this.txGasUsedGraphDOM = el)}
                  className={styles.graphContainer}
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div
                  ref={el => (this.proposalsGraphDOM = el)}
                  className={styles.graphContainer}
                />
              </CardContent>
            </Card>
          </div>
        </div>
        <ErrorNotification
          error={this.state.error}
          dismissError={this.dismissError}
        />
      </React.Fragment>
    )
  }
}

export default withConfig(withObservables(Graphs))
