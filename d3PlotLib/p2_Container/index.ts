// Container/index.ts
import * as d3 from 'd3'
import { dispatch } from 'd3-dispatch'

import { scaleAttrs, containerAttrs, axisAttrs } from '../ChartAttribs'

const publicAttributes = {
  ...scaleAttrs,
  ...containerAttrs,
  ...axisAttrs,
} as const

export default function () {
  const obj: any = JSON.parse(JSON.stringify(publicAttributes))
  const plots: any = []

  // console.log('P2 Container: what is public attrs: ', publicAttributes)
  // console.log('P2 Container: what is after stringify: ', JSON.stringify(publicAttributes))
  // console.log('P2 Container: what is public attrs: ', obj)

  // Dispatcher object to broadcast the mouse events
  const dispatcher = dispatch(
    'customMouseOver',
    'customMouseMove',
    'customMouseOut',
    'customMouseClick'
  )

  function toExport(html_selection: any) {
    obj.chartWidth = obj.width - obj.margin.left - obj.margin.right
    obj.chartHeight = obj.height - obj.margin.top - obj.margin.bottom

    buildSVG(html_selection.node())
    buildScales()
    buildAxes()
    buildGrid()

    // buildMouseInteractor()

    plots.forEach((plot: any) => {
      plot(obj)
    })

    drawGrid()
    drawAxes()
    drawAxisLabels()

    drawLegends()

    if (obj.showMargins && obj.svg) {
      obj.svg.style('background-color', 'rgba(255, 0, 0, .2)')
    }
  }

  function buildScales() {
    const scaler = obj.scale == null ? null : obj.scale
    if (scaler) scaler(obj, plots)
  }

  function buildAxes() {
    obj.xAxis = obj.yAxis = null
    if (obj.xScale == null || obj.yScale == null) {
      return
    }

    obj.xAxis = d3.axisBottom(obj.xScale)

    if (obj.yAxisPosition == 'right') {
      obj.yAxis = d3.axisRight(obj.yScale)
    } else {
      obj.yAxis = d3.axisLeft(obj.yScale)
    }

    obj.yAxis.ticks(10, '%').tickFormat((d: any) => {
      if (d / 1000 >= 1) {
        d = `${d / 1000}K`
      }
      return d
    })
  }

  function buildGrid() {
    obj.xGrid = obj.yGrid = null
    if (obj.xScale == null || obj.yScale == null) {
      return
    }

    obj.xGrid = d3.axisBottom(obj.xScale).tickSize(-obj.chartHeight).tickFormat(null).ticks(10)

    if (obj.yAxisPosition === 'right') {
      obj.yGrid = d3.axisRight(obj.yScale)
    } else {
      obj.yGrid = d3.axisLeft(obj.yScale)
    }

    obj.yGrid.tickSize(-obj.chartWidth).tickFormat('').ticks(10)
  }

  // Building Blocks
  function buildContainerGroups(svg: any) {
    const marginLeft = obj.margin.left
    const marginTop = obj.margin.top
    // marginLeft = 50
    // marginTop = 20

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

    // console.log('P2_Container/index/buildcontainerGroups: built the container groups: ', container)
  }

  function buildSVG(container: any) {
    // console.log('P2_Container/index/buildSVG: ', obj)

    if (!obj.svg) {
      obj.svg = d3.select(container).append('svg').classed('jschart-container', true)

      // console.log('P2-Container/index/buildSVG: what is obj.svg: ', obj.svg)

      buildContainerGroups(obj.svg)
    }
    obj.svg.attr('width', obj.width).attr('height', obj.height)
  }

  function drawAxes() {
    // console.log('what is obj when container draw axes: ', obj)
    const xAxisTextRotation = obj.xAxisText.rotation ?? 0
    let xAxisTextAnchor = 'middle'
    let xAxisTextDX = '0em'
    let xAxisTextDY = '1em'

    if (xAxisTextRotation !== 0) {
      xAxisTextAnchor = 'start'
      xAxisTextDX = '.8em'
      xAxisTextDY = '.15em'
    }

    const yAxisTextRotation = obj.yAxisText.rotation ?? 0
    const yAxisTextAnchor = 'end'
    const yAxisTextDX = '0em'
    let yAxisTextDY = '0em'

    if (yAxisTextRotation !== 0) {
      // yAxisTextAnchor = "start"
      // yAxisTextDX = ".8em"
      yAxisTextDY = '.15em'
    }

    let yAxisShift = 0
    if (obj.yAxisPosition == 'right') {
      yAxisShift = obj.chartWidth + 4
    }

    if (obj.xAxisShow && obj.xAxis) {
      obj.svg
        .select('.x-axis-group.axis')
        .attr('transform', `translate(0,${obj.chartHeight})`)
        .call(obj.xAxis)

      obj.svg
        .select('.x-axis-group.axis')
        .selectAll('text')
        .style('font', '10px Arial, sans-serif')
        .style('text-anchor', xAxisTextAnchor)
        .attr('dx', xAxisTextDX)
        .attr('dy', xAxisTextDY)
        .attr('transform', `rotate(${xAxisTextRotation})`)
    }

    if (obj.yAxisShow && obj.yAxis) {
      obj.svg
        .select('.y-axis-group.axis')
        .attr('transform', `translate(${yAxisShift}, 0)`)
        .call(obj.yAxis)

      obj.svg
        .select('.y-axis-group.axis')
        .selectAll('text')
        .style('font', '10px Arial, sans-serif')
        // .style("text-anchor", yAxisTextAnchor)
        // .attr("dx", yAxisTextDX)
        // .attr("dy", yAxisTextDY)
        .attr('transform', `rotate(${yAxisTextRotation})`)
    }
  }

  function drawGrid() {
    let yAxisShift = 0
    if (obj.yAxisPosition == 'right') {
      yAxisShift = obj.chartWidth + 4
    }

    if (obj.xGridShow && obj.xGrid) {
      const xGrid = obj.svg
        .select('.x-axis-group.grid')
        .attr('transform', `translate(0,${obj.chartHeight})`)
        .call(obj.xGrid)

      xGrid.style('opacity', 0.3)
    }

    if (obj.yGridShow && obj.yGrid) {
      const yGrid = obj.svg
        .select('.y-axis-group.grid')
        .attr('transform', `translate(${yAxisShift})`)
        .call(obj.yGrid)

      yGrid.style('opacity', 0.3)
    }
  }

  /**
   * Draws the x and y axis custom labels respective groups
   * @private
   */
  function drawAxisLabels() {
    // .append("text")
    // .attr("y", 6)
    // .attr("dy", "2.0em")
    // .attr("x", 100)
    // .style("fill", "black")
    // .text("hello")

    let yAxisShift = 0
    if (obj.yAxisPosition == 'right') {
      yAxisShift = obj.chartWidth + 80
    }

    if (obj.yAxisLabel) {
      if (obj.yAxisLabelEl) {
        obj.yAxisLabelEl.remove()
      }

      obj.yAxisLabelEl = obj.svg
        .select('.y-axis-label')
        .attr('transform', `translate(${yAxisShift}, 0)`)
        .append('text')
        .classed('y-axis-label-text', true)
        .attr('x', -obj.chartHeight / 2)
        .attr('y', obj.yAxisLabelOffset)
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(270 0 0)')
        .text(obj.yAxisLabel)
    }

    if (obj.xAxisLabel) {
      if (obj.xAxisLabelEl) {
        obj.xAxisLabelEl.remove()
      }

      obj.xAxisLabelEl = obj.svg
        .select('.x-axis-label')
        .attr('transform', `translate(0,${obj.chartHeight})`)
        .append('text')
        .attr('y', obj.xAxisLabelOffset)
        .attr('text-anchor', 'middle')
        .classed('x-axis-label-text', true)
        .attr('x', obj.chartWidth / 2)
        .text(obj.xAxisLabel)
    }
  }

  function drawLegends() {
    if (obj.legend == null) {
      return
    }
    obj.legend(obj, plots)
  }

  const chart: any = toExport

  function generateAccessor(attr: any) {
    function accessor(value: any) {
      if (!arguments.length) {
        return obj[attr]
      }
      obj[attr] = value

      return chart
    }
    return accessor
  }

  // generate the chart attributes
  for (const attr in obj) {
    if (!chart[attr] && obj.hasOwnProperty(attr)) {
      chart[attr] = generateAccessor(attr)
    }
  }

  toExport.on = function (_x: any) {
    const value = dispatcher.on.apply(dispatcher, arguments)
    return value === dispatcher ? toExport : value
  }

  toExport.attr = function () {
    return obj
  }

  toExport.plot = function (_x: any) {
    if (Number.isInteger(_x) && plots.length > 0) {
      return plots[_x]
    }
    if (typeof _x === 'string') {
      const labels = plots.filter((elem: any) => elem.tag() === _x)
      if (labels.length > 0) {
        return labels[0]
      }
      return null
    }
    plots.push(_x)
    return toExport
  }

  return toExport
}
