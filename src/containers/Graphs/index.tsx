import * as React from 'react'
import * as echarts from 'echarts'
import { withObservables } from '../../contexts/observables'
import { withConfig } from '../../contexts/config'
import { IContainerProps, IBlock, BlockNumber, Timestamp } from '../../typings/'
import { BarOption } from '../../config/graph'

const initState = {
  blocks: [] as IBlock[],
}

interface GraphsProps extends IContainerProps {}
type GraphState = typeof initState
type BlockGraphData = [BlockNumber, Timestamp, number]

const getSource = ({ blocks = this.state.blocks }) => {
  if (blocks.length <= 1) return []
  const source: BlockGraphData[] = []
  // form the source , x = height, y = timecost, tx count
  blocks.reduce((prev, curr) => {
    source.push([
      (curr as IBlock).header.number, // height
      +(curr as IBlock).header.timestamp - +(prev as IBlock).header.timestamp, // timecost
      (curr as IBlock).body.transactions.length, // tx count
    ])
    return curr
  })
  const graphSource = [['Blocks', 'TimeCost', 'Tx Count'], ...source]
  this.graphSource = graphSource
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
    // this.updateGraph({ graph: this.blockGraph, option: BarOption })
  }
  private blockGraph: any
  private txCountGraph: any
  private blockGraphDOM: HTMLDivElement | null
  private txCountGraphDOM: HTMLDivElement | null
  private graphSource: any[] = []
  private updateAllDiagram = () => {}
  private updateDiagram = ({ chart, data }) => {}
  private startListening = () => {
    this.props.CITAObservables.newBlockByNumberSubject.subscribe(
      block => {
        this.handleNewBlock(block)
      },
      error => console.log(error),
    )
  }
  private handleNewBlock = block => {
    this.setState(state => {
      const blocks = [...state.blocks, block]
      if (this.blockGraph && blocks.length > 1) {
        // item[0] = cost time; item[1] = tx count;
        const source = getSource({ blocks })
        const timeCostOption = {
          ...BarOption,
          dataset: { source: source.map(item => [item[0], item[1]]) },
        }
        const txCountOption = {
          ...BarOption,
          dataset: { source: source.map(item => [item[0], item[2]]) },
        }
        this.updateGraph({ graph: this.blockGraph, option: timeCostOption })
        this.updateGraph({ graph: this.txCountGraph, option: txCountOption })
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
      </div>
    )
  }
}

// TODO: TxCount/Block
// TODO: Size/Block
// TODO: TimeCost/Block

export default withConfig(withObservables(Graphs))
