/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3Dispatch from 'd3-dispatch'
import * as d3 from 'd3'
import { lineAttrs } from '../ChartAttribs'

const colorScheme = ['red', 'green', 'blue', 'grey']

export default function () {
  const obj: any = JSON.parse(JSON.stringify(lineAttrs))
  let container: any = null

  // Dispatcher object to broadcast the mouse events
  const dispatcher = d3Dispatch.dispatch(
    'customMouseOver',
    'customMouseMove',
    'customMouseOut',
    'customMouseClick'
  )

  function buildContainerGroups() {
    const { svg } = container

    const chartGroup = svg.select('g.chart-group')
    const children = chartGroup.selectAll(function () {
      return this.childNodes
    })

    const existingElements = children.filter(`g.${obj.lineID}`)
    if (existingElements.size() > 0) {
      return
    }

    obj.index = children.size()
    obj.lineID = `line-${obj.index}`

    chartGroup.append('g').classed(`${obj.lineID}`, true)

    const containerWidth = container.chartWidth
    const containerHeight = container.chartHeight
    obj.clipPathId = `${obj.plotID}-clippath`

    chartGroup
      .append('clipPath')
      .attr('id', obj.clipPathId)
      .append('rect')
      .attr('width', containerWidth + 30)
      .attr('height', containerHeight)

    // console.log('p2_Plot : obj/chart-group/children : ', obj, chartGroup, children)

    // set the colour etc
    const index = obj.index % colorScheme.length
    obj.colour = colorScheme[index]
  }

  function prepareData() {
    // check ys for 2d array
    // obj.ys = Array.isArray(obj.ys[0]) ? obj.ys : [obj.ys]

    // check labels
    obj.labels = Array.isArray(obj.labels) ? obj.labels : [obj.labels]

    // check colours
    obj.colours = Array.isArray(obj.colours) ? obj.colours : [obj.colours]

    // check styles
    obj.styles = Array.isArray(obj.styles) ? obj.styles : [obj.styles]

    // check alphas
    obj.alpha = Array.isArray(obj.alpha) ? obj.alpha : [obj.alpha]
  }

  function drawData() {
    const { ys } = obj
    const { xs } = obj
    const strokeColour = obj.colour
    let { xScale } = container
    const { yScale } = container
    const { alpha } = obj
    const { style } = obj
    let lineEffect = ''
    const { svg } = container

    // set the line style
    if (style === '--') {
      lineEffect = 'stroke-dasharray'
    }

    const extent = d3.extent(xScale.domain())
    const xStart = extent[0]
    const xEnd = extent[1]

    const yPoints = ys

    xScale = d3
      .scaleLinear()
      .domain(d3.extent(xScale.domain() as Iterable<d3.Numeric>))
      .range(xScale.range())

    // console.log('x start / x end: ', xStart, xEnd, xScale.domain(), xScale.range())
    // console.log('y points: ', yPoints)
    // console.log('show yStart / yEnd / xs / ys / xPoints / ypoints: ', xStart, xEnd, xs, ys, yPoints)

    const chartGroup = svg.select(`.${obj.lineID}`)

    let lines = chartGroup.selectAll('.lines').data(yPoints)

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    lines.exit().style('opacity', 0).remove()

    // Enter - add the shapes to this data point
    const enterGroup = lines
      .enter()
      .append('line')
      .classed('lines', true)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)

    // join the new data points with existing
    lines = lines.merge(enterGroup)

    // now position and colour what exists on the dom
    lines
      .attr('x1', (d: any, i: any) => xScale(xStart))
      .attr('x2', (d: any, i: any) => xScale(xEnd))
      .attr('y1', (d: any, i: any) =>
        // console.log('what is y1 : ', d, i)
        yScale(d)
      )
      .attr('y2', (d: any, i: any) => yScale(d))
      .attr('clip-path', `url(#${obj.clipPathId})`)
      .attr('stroke', strokeColour)
      .style('opacity', alpha)
      .style(lineEffect, '3, 3')
      .on('mouseover', function (d: any) {
        d3.select(this).style('cursor', 'pointer')
        dispatcher.call('customMouseOver', this, d)
      })
      .on('mousemove', function (d: any) {
        dispatcher.call('customMouseMove', this, d)
      })
      .on('mouseout', function (d: any) {
        dispatcher.call('customMouseOut', this, d)
      })
      .on('click', function (d: any) {
        dispatcher.call('customMouseClick', this, d)
      })
  }

  function plot(_container: any) {
    container = _container
    buildContainerGroups()
    prepareData()
    drawData()
  }

  const callableObj: any = plot

  function generateAccessor(attr: any) {
    function accessor(value: any) {
      if (!arguments.length) {
        return obj[attr]
      }
      obj[attr] = value

      return callableObj
    }
    return accessor
  }

  // generate the chart attributes
  // for (const attr in obj) {
  //   if (!callable_obj[attr] && obj.hasOwnProperty(attr)) {
  //     callable_obj[attr] = generateAccessor(attr)
  //   }
  // }
  Object.keys(obj).forEach((attr: any) => {
    if (!callableObj[attr] && Object.prototype.hasOwnProperty.call(obj, attr)) {
      callableObj[attr] = generateAccessor(attr)
    }
  })

  callableObj.on = function () {
    const value = dispatcher.on.apply(dispatcher, arguments)
    return value === dispatcher ? callableObj : value
  }

  callableObj.attr = function () {
    return obj
  }

  return callableObj
}
