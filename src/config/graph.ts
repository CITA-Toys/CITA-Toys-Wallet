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
}
