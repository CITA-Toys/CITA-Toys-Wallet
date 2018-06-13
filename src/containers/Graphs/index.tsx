import * as React from 'react'
import * as echarts from 'echarts'
import { withObservables } from '../../contexts/observables'
import { withConfig } from '../../contexts/config'
import {
  IContainerProps,
  IBlock,
  BlockNumber,
  Timestamp,
  TransactionFromServer,
  Hash,
} from '../../typings/'
import { BarOption } from '../../config/graph'
import { fetchTransactions } from '../../utils/fetcher'

const initState = {
  blocks: [] as IBlock[],
  transactions: [] as TransactionFromServer[],
  loadBlockHistory: false,
  maxCount: 10,
}

interface GraphsProps extends IContainerProps {}
type GraphState = typeof initState
type BlockGraphData = [BlockNumber, Timestamp, number, string]
type TxGraphData = [Hash, number]

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

class Graphs extends React.Component<GraphsProps, GraphState> {
  readonly state = initState
  componentWillMount () {
    this.startListening()
  }

  componentDidMount () {
    this.blockGraph = echarts.init(this.blockGraphDOM as HTMLDivElement)
    this.txCountGraph = echarts.init(this.txCountGraphDOM as HTMLDivElement)
    this.gasUsedGraph = echarts.init(this.gasUsedGraphDOM as HTMLDivElement)
    this.txGasUsedGraph = echarts.init(this.txGasUsedGraphDOM as HTMLDivElement)
  }
  private blockGraph: any
  private txCountGraph: any
  private gasUsedGraph: any
  private txGasUsedGraph: any
  private blockGraphDOM: HTMLDivElement | null
  private txCountGraphDOM: HTMLDivElement | null
  private gasUsedGraphDOM: HTMLDivElement | null
  private txGasUsedGraphDOM: HTMLDivElement | null
  // private graphSource: any[] = []
  private updateAllDiagram = () => {}
  private updateDiagram = ({ chart, data }) => {}

  loadBlockHistory = (number: number) => {
    this.props.CITAObservables.blockHistory({
      by: number,
      count: 10,
    }).subscribe(prevBlocks => {
      this.setState((state: any) => {
        const blocks = [...prevBlocks.reverse(), ...state.blocks]
        return { blocks }
      })
    })
  }
  private startListening = () => {
    this.props.CITAObservables.newBlockByNumberSubject.subscribe(
      block => {
        if (block.hash) {
          this.handleNewBlock(block)
          this.updateTransactions()
        } else {
          throw new Error(block)
        }
      },
      error => console.error(error),
    )
    this.props.CITAObservables.newBlockByNumberSubject.connect()
  }
  private updateTransactions = () => {
    fetchTransactions({ limit: this.state.maxCount })
      .then(({ result: txs }) => {
        this.setState(state => ({
          ...state,
          transactions: txs,
        }))
        const source = getTxSource({ txs })
        const txGasUsedOption = {
          ...BarOption,
          dataset: { source: source.map(item => [item[0], item[1]]) },
        }
        this.updateGraph({
          graph: this.txGasUsedGraph,
          option: txGasUsedOption,
        })
      })
      .catch(err => console.error(err))
  }
  private handleNewBlock = block => {
    this.setState(state => {
      const blocks = [...state.blocks, block].slice(-this.state.maxCount)
      if (this.blockGraph && blocks.length > 1) {
        const source = getBlockSource({ blocks })
        const timeCostOption = {
          ...BarOption,
          dataset: { source: source.map(item => [item[0], item[1]]) },
        }
        const txCountOption = {
          ...BarOption,
          dataset: { source: source.map(item => [item[0], item[2]]) },
        }
        const gasUsedOption = {
          ...BarOption,
          dataset: { source: source.map(item => [item[0], item[3]]) },
        }
        this.updateGraph({ graph: this.blockGraph, option: timeCostOption })
        this.updateGraph({ graph: this.txCountGraph, option: txCountOption })
        this.updateGraph({ graph: this.gasUsedGraph, option: gasUsedOption })
      }
      return { blocks }
    })
  }
  private updateGraph = ({ graph, option }) => {
    graph.setOption(option)
  }
  render () {
    return (
      <div>
        <div
          ref={el => (this.blockGraphDOM = el)}
          style={{ width: '100vw', height: '30vh' }}
        />
        <div
          ref={el => (this.txCountGraphDOM = el)}
          style={{ width: '100vw', height: '30vh' }}
        />
        <div
          ref={el => (this.gasUsedGraphDOM = el)}
          style={{ width: '100vw', height: '30vh' }}
        />
        <div
          ref={el => (this.txGasUsedGraphDOM = el)}
          style={{ width: '100vw', height: '30vh' }}
        />
      </div>
    )
  }
}

export default withConfig(withObservables(Graphs))
