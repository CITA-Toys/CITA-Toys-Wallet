import * as React from 'react'
import * as echarts from 'echarts'

const styles = require('./homeChart.scss')

export default class HomeChart extends React.Component<any, any> {
  componentDidMount () {
    this.chart = echarts.init(this.chartDOM as HTMLDivElement)
    this.chart.showLoading()
  }
  private chart: any
  private chartDOM: HTMLDivElement | null
  render () {
    return (
      <div className={this.props.className}>
        <div ref={el => (this.chartDOM = el)} className={styles.chart} />
      </div>
    )
  }
}
