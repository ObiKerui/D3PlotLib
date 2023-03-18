/* eslint-disable @typescript-eslint/no-explicit-any */
import { Axis, AxisDomain, AxisScale } from 'd3'

// type NumberAxis = Axis<number>
type YAxisPosition = 'left' | 'right'
type XAxisPosition = 'bottom' | 'top'

// type ScaleOrdinalType<Domain, Range> = ScaleOrdinal<Domain, Range>
// type ScaleContinuousType = ScaleContinuousNumeric<unknown, number>
// type AllD3PlotLibScales = ScaleContinuousType | ScaleOrdinalType<unknown, number>

export const containerAttrs = {
  svg: null as d3.Selection<SVGSVGElement, any, null, undefined> | null,

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
  scale: null as CallableFunction | null,
  legend: null as CallableFunction | null,
}

export const scaleAttrs = {
  xScale: null as AxisScale<AxisDomain> | null,
  yScale: null as AxisScale<AxisDomain> | null,
}

export const axisAttrs = {
  xAxis: null as Axis<AxisDomain> | null,
  xAxisLabel: '',
  xAxisPosition: 'bottom' as XAxisPosition,
  xAxisLabelOffset: 30,

  xAxisText: {
    rotation: 0,
  },

  xAxisLabelEl: null as d3.Selection<SVGTextElement, any, null, undefined> | null,
  xTicks: 5,
  xAxisShow: true,
  xGrid: null as Axis<AxisDomain> | null,
  xGridShow: false,

  yAxis: null as Axis<AxisDomain> | null,
  yAxisLabel: '',
  yAxisPosition: 'left' as YAxisPosition,
  yAxisLabelOffset: -30,
  yAxisLabelEl: null as d3.Selection<SVGTextElement, any, null, undefined> | null,
  yAxisPaddingBetweenChart: 10,
  yTicks: 5,
  yAxisShow: true,
  yGrid: null as Axis<AxisDomain> | null,
  yGridShow: true,

  yAxisText: {
    rotation: 0,
  },
}

export const plotAttrs = {
  tag: null as string,
  xs: [] as unknown[],
  ys: [] as unknown[],
  labels: [] as string[],
  plotID: null as string,
  index: null as number,
  alpha: [] as unknown[],
  styles: [] as unknown[],
  colours: [] as string[],
  curve: null as unknown,
}

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
