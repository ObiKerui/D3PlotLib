import * as d3 from 'd3'
import { scaleAttrs, containerAttrs, axisAttrs } from '../ChartAttribs'

const publicAttributes = {
  ...scaleAttrs,
  ...containerAttrs,
  ...axisAttrs,
}

type containerObj = typeof publicAttributes | null

function AxisGenerator() {
  let obj: containerObj = null

  function buildAxes() {
    obj.xAxis = null
    obj.yAxis = null

    if (obj.xScale === null || obj.yScale === null) {
      return
    }

    obj.xAxis = d3.axisBottom(obj.xScale)

    if (obj.yAxisPosition === 'right') {
      obj.yAxis = d3.axisRight(obj.yScale)
    } else {
      obj.yAxis = d3.axisLeft(obj.yScale)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    obj.yAxis.ticks(10, '%').tickFormat((d: any) => {
      let toRet = d
      if (toRet / 1000 >= 1) {
        toRet = `${d / 1000}K`
      }
      return toRet
    })
  }

  function drawAxes() {
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
    // const yAxisTextAnchor = 'end'
    // const yAxisTextDX = '0em'
    // let yAxisTextDY = '0em'

    if (yAxisTextRotation !== 0) {
      // yAxisTextAnchor = "start"
      // yAxisTextDX = ".8em"
      // yAxisTextDY = '.15em'
    }

    let yAxisShift = 0
    if (obj.yAxisPosition === 'right') {
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

  function toExport(container: containerObj) {
    obj = container
    buildAxes()
    drawAxes()
  }

  return toExport
}

export default AxisGenerator
