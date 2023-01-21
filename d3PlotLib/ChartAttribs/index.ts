/* eslint-disable @typescript-eslint/no-explicit-any */
export const containerAttrs = {
  svg: null as any,
  width: 500 as number,
  height: 400 as number,

  margin: {
    bottom: 50,
    left: 40,
    right: 60,
    top: 20,
  },

  chartWidth: 0 as number,
  chartHeight: 0 as number,
  showMargins: false as boolean,
  scale: null as any,
  legend: null as any,
} as const

export const scaleAttrs = {
  xScale: null as any,
  yScale: null as any,
} as const

export const axisAttrs = {
  xAxis: null as any,
  xAxisLabel: '' as string,
  xAxisPosition: 'bottom' as string,
  xAxisLabelOffset: 30 as number,

  xAxisText: {
    rotation: 0,
  },

  xAxisLabelEl: null as any,
  xTicks: 5 as number,
  xAxisShow: true as boolean,
  xGrid: null as any,
  xGridShow: false as boolean,

  yAxis: null as any,
  yAxisLabel: '' as string,
  yAxisPosition: 'left' as string,
  yAxisLabelOffset: -30 as number,
  yAxisLabelEl: null as any,
  yAxisPaddingBetweenChart: 10 as number,
  yTicks: 5 as number,
  yAxisShow: true as boolean,
  yGrid: null as any,
  yGridShow: true as boolean,

  yAxisText: {
    rotation: 0,
  },
} as const

export const plotAttrs = {
  tag: null as string,
  xs: [] as any,
  ys: [] as any,
  labels: [] as any,
  plotID: null as string,
  index: null as number,
  alpha: [] as any,
  styles: [] as any,
  colours: [] as any,
  curve: null as any,
} as const

export const barsAttrs = {
  tag: null as string,
  density: null as boolean,
  bins: null as [],
  colours: [] as [],
}

export const lineAttrs = {
  tag: null as string,
  xs: [] as any,
  ys: [] as any,
  lineID: null as string,
  index: null as number,
  alpha: null as number,
  colours: null as string,
  labels: null as string,
  styles: null as string,
}

export const legendAttrs = {
  legendID: null as string,
  index: null as number,
  data: null as any,
  position: null as string,
}
