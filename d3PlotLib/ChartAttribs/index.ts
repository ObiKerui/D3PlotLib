/* eslint-disable @typescript-eslint/no-explicit-any */
export const containerAttrs = {
  svg: null as any,
  width: 500,
  height: 400,

  margin: {
    bottom: 50,
    left: 40,
    right: 60,
    top: 20,
  },

  chartWidth: 0,
  chartHeight: 0,
  showMargins: false,
  scale: null as any,
  legend: null as any,
} as const

export type scaleAttrsType = {
  xScale: number | null
  yScale: number | null
}

export const scaleAttrs = {
  xScale: null as any,
  yScale: null as any,
} as const

export const axisAttrs = {
  xAxis: null as any,
  xAxisLabel: '',
  xAxisPosition: 'bottom',
  xAxisLabelOffset: 30,

  xAxisText: {
    rotation: 0,
  },

  xAxisLabelEl: null as any,
  xTicks: 5,
  xAxisShow: true,
  xGrid: null as any,
  xGridShow: false,

  yAxis: null as any,
  yAxisLabel: '',
  yAxisPosition: 'left',
  yAxisLabelOffset: -30,
  yAxisLabelEl: null as any,
  yAxisPaddingBetweenChart: 10,
  yTicks: 5,
  yAxisShow: true,
  yGrid: null as any,
  yGridShow: true,

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
