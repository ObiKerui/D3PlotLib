import * as d3 from 'd3'
import rfdc from 'rfdc'

import { scaleAttrs, containerAttrs, axisAttrs } from '../ChartAttribs'
import AxisGenerator from './AxisGenerator'
import LabelGenerator from './LabelGenerator'
import GridGenerator from './GridGenerator'

const publicAttributes = {
  ...scaleAttrs,
  ...containerAttrs,
  ...axisAttrs,
}

export type containerObj = typeof publicAttributes | null

function Container() {
  const obj = rfdc()(publicAttributes)
  const plots: unknown[] = []
  const axisGenerator = AxisGenerator()
  const labelGenerator = LabelGenerator()
  const gridGenerator = GridGenerator()

  // Dispatcher object to broadcast the mouse events
  // const dispatcher = d3Dispatch.dispatch(
  //   'customMouseOver',
  //   'customMouseMove',
  //   'customMouseOut',
  //   'customMouseClick'
  // )

  function buildScales() {
    const scaler = obj.scale === null ? null : obj.scale
    if (scaler) scaler(obj, plots)
  }

  // Building Blocks
  function buildContainerGroups(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) {
    const marginLeft = obj.margin.left
    const marginTop = obj.margin.top

    const container = svg
      .append('g')
      .classed('container-group', true)
      // .attr("transform", `translate(${obj.margin.left + obj.yAxisPaddingBetweenChart},${obj.margin.top})`)
      .attr('transform', `translate(${marginLeft},${marginTop})`)

    container.append('g').classed('x-axis-group grid', true)
    container.append('g').classed('y-axis-group grid', true)

    container.append('g').classed('chart-group', true)

    container.append('g').classed('x-axis-group axis', true)
    container.append('g').classed('x-axis-label', true)

    container.append('g').classed('y-axis-group axis', true)
    container.append('g').classed('y-axis-label', true)

    container.append('g').classed('metadata-group', true)
  }

  function buildSVG(container: HTMLElement) {
    if (!obj.svg) {
      obj.svg = d3.select(container).append('svg').classed('jschart-container', true)
      buildContainerGroups(obj.svg)
    }
    obj.svg.attr('width', obj.width).attr('height', obj.height)
  }

  function toExport(htmlSelection: d3.Selection<HTMLElement, unknown, null, undefined>) {
    obj.chartWidth = +(obj.width - obj.margin.left - obj.margin.right)
    obj.chartHeight = +(obj.height - obj.margin.top - obj.margin.bottom)

    buildSVG(htmlSelection.node())
    buildScales()

    plots.forEach((plot: CallableFunction) => {
      plot(obj)
    })

    axisGenerator(obj)
    labelGenerator(obj)
    gridGenerator(obj)

    if (obj.legend) obj.legend(obj, plots)

    if (obj.showMargins && obj.svg) {
      obj.svg.style('background-color', 'rgba(255, 0, 0, .2)')
    }
  }

  const chart = toExport

  /* eslint-disable @typescript-eslint/no-explicit-any */
  toExport.plot = function (x: any): any {
    if (Number.isInteger(x) && plots.length > 0) {
      return plots[x]
    }
    if (typeof x === 'string') {
      const labels = plots.filter((elem: any) => elem.tag() === x)
      if (labels.length > 0) {
        return labels[0]
      }
      return null
    }
    plots.push(x)
    return toExport
  }

  function generateAccessor(attr: keyof typeof obj) {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    function accessor<Type>(value: Type): any {
      if (!arguments.length) {
        return obj[attr]
      }
      obj[attr] = value as never

      return chart
    }
    return accessor
  }

  toExport.scale = generateAccessor('scale')
  toExport.legend = generateAccessor('legend')
  toExport.showMargins = generateAccessor('showMargins')
  toExport.height = generateAccessor('height')
  toExport.width = generateAccessor('width')
  toExport.margin = generateAccessor('margin')
  toExport.xAxisLabel = generateAccessor('xAxisLabel')
  toExport.xAxisText = generateAccessor('xAxisText')
  toExport.yAxisLabel = generateAccessor('yAxisLabel')
  toExport.yAxisText = generateAccessor('yAxisText')
  toExport.yAxisPosition = generateAccessor('yAxisPosition')

  return toExport
}

export default Container
