import * as d3 from 'd3'
import { scaleAttrs, containerAttrs, axisAttrs } from '../ChartAttribs'

const publicAttributes = {
  ...scaleAttrs,
  ...containerAttrs,
  ...axisAttrs,
}

type containerObj = typeof publicAttributes | null

function GridGenerator() {
  let obj: containerObj = null

  function buildGrid() {
    obj.xGrid = null
    obj.yGrid = null

    if (obj.xScale === null || obj.yScale === null) {
      return
    }

    obj.xGrid = d3.axisBottom(obj.xScale).tickSize(-obj.chartHeight).tickFormat(null).ticks(10)

    if (obj.yAxisPosition === 'right') {
      obj.yGrid = d3.axisRight(obj.yScale)
    } else {
      obj.yGrid = d3.axisLeft(obj.yScale)
    }

    obj.yGrid.tickSize(-obj.chartWidth).tickFormat(null).ticks(10)
  }

  function drawGrid() {
    let yAxisShift = 0
    if (obj.yAxisPosition === 'right') {
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

  function toExport(container: containerObj) {
    obj = container
    buildGrid()
    drawGrid()
  }
  return toExport
}

export default GridGenerator
