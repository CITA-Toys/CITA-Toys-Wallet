export const BarOption = {
  legend: {},
  tooltip: {},
  dataset: {
    // 提供一份数据。
    source: [
      ['product', '2015'],
      ['Matcha Latte', 43.3],
      ['Milk Tea', 83.1],
      ['Cheese Cocoa', 86.4],
      ['Walnut Brownie', 72.4],
    ],
  },
  // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
  xAxis: { type: 'category' },
  // 声明一个 Y 轴，数值轴。
  yAxis: {},
  // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
  series: [{ type: 'bar' }],
}
export const PieOption = {
  legend: {},
  tooltip: {},
  dataset: {
    // 提供一份数据。
    source: [
      ['product', '2015'],
      ['Matcha Latte', 43.3],
      ['Milk Tea', 83.1],
      ['Cheese Cocoa', 86.4],
      ['Walnut Brownie', 72.4],
    ],
  },
  // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
  xAxis: { type: 'category' },
  // 声明一个 Y 轴，数值轴。
  yAxis: {},
  // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。

  series: [
    {
      type: 'pie',
      radius: ['50%', '70%'],
    },
  ],
}

export default {
  BarOption,
  PieOption,
}
