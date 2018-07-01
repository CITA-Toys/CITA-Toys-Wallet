export const BarOption = {
  legend: {
    bottom: '0',
  },
  tooltip: {},
  dataset: {
    source: [],
  },
  xAxis: { type: 'category' },
  yAxis: {},
  series: [{ type: 'bar' }],
}
export const LineOption = {
  legend: {
    bottom: '0',
  },
  tooltip: {},
  dataset: {
    source: [],
  },
  xAxis: { type: 'category' },
  yAxis: {},
  series: [{ type: 'line' }],
  backgroundColor: {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      {
        offset: 0,
        color: 'red', // 0% 处的颜色
      },
      {
        offset: 1,
        color: 'blue', // 100% 处的颜色
      },
    ],
    globalCoord: false, // 缺省为 false
  },
}
export const PieOption = {
  legend: { bottom: '0' },
  tooltip: {},
  dataset: { source: [] },
  xAxis: { show: false },
  yAxis: { show: false },
  series: [
    {
      type: 'pie',
      radius: ['50%', '70%'],
      emphasis: {
        itemStyle: {
          shadowColor: 'rgba(0,0,0,0.5)',
          shadowBlur: 20,
        },
      },
    },
  ],
}

export default {
  BarOption,
  PieOption,
  LineOption,
}
