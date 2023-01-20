import { dispatch } from 'd3-dispatch'
import * as d3 from 'd3'
import { lineAttrs } from '../ChartAttribs'

const colorScheme = ['red', 'green', 'blue', 'grey']

export default function () {
  const obj: any = JSON.parse(JSON.stringify(lineAttrs))
  let _container: any = null

  // Dispatcher object to broadcast the mouse events
  const dispatcher = dispatch(
    'customMouseOver',
    'customMouseMove',
    'customMouseOut',
    'customMouseClick'
  )

  function plot(container: any) {
    _container = container
    buildContainerGroups()
    prepareData()
    drawData()
  }

  function buildContainerGroups() {
    const { svg } = _container

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

    const containerWidth = _container.chartWidth
    const containerHeight = _container.chartHeight
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
    obj.ys = Array.isArray(obj.ys[0]) ? obj.ys : [obj.ys]

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
    const { xScale } = _container
    const { yScale } = _container
    const { alpha } = obj
    const { style } = obj
    let lineEffect = ''
    const { svg } = _container

    // set the line style
    if (style == '--') {
      lineEffect = 'stroke-dasharray'
    }

    // get start / end y value
    const yStart = yScale.domain()[0]
    const yEnd = yScale.domain()[1]
    const xPoints = xs

    // console.log('show yStart / yEnd / xs / ys / xPoints / ypoints: ', yStart, yEnd, xs, ys, xPoints, yPoints)

    const chartGroup = svg.select(`.${obj.lineID}`)

    let lines = chartGroup.selectAll('.lines').data(xPoints)

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
      .attr('x1', (d: any, i: any) => xScale(d))
      .attr('x2', (d: any, i: any) => xScale(d))
      .attr('y1', (d: any, i: any) => yScale(yStart))
      .attr('y2', (d: any, i: any) => yScale(yEnd))
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

  const callable_obj: any = plot

  function generateAccessor(attr: any) {
    function accessor(value: any) {
      if (!arguments.length) {
        return obj[attr]
      }
      obj[attr] = value

      return callable_obj
    }
    return accessor
  }

  // generate the chart attributes
  for (const attr in obj) {
    if (!callable_obj[attr] && obj.hasOwnProperty(attr)) {
      callable_obj[attr] = generateAccessor(attr)
    }
  }

  callable_obj.on = function (_x: any) {
    const value = dispatcher.on.apply(dispatcher, arguments)
    return value === dispatcher ? callable_obj : value
  }

  callable_obj.attr = function () {
    return obj
  }

  callable_obj.extent = function () {
    const x_extent = d3.extent(obj.xs, (elem: any) => elem)

    const y_extent = d3.extent(obj.ys, (elem: any) => elem)

    return {
      x: x_extent,
      y: y_extent,
    }
  }

  // // TODO needs to be more well thought out
  // callable_obj.x = function() {
  //   return d3.extent(obj.xs, (elem : any) =>  {
  //     return elem
  //   })
  // }

  // // TODO needs to be more well thought out
  // callable_obj.y = function() {
  //   return d3.extent(obj.ys, (elem : any) => {
  //     return elem
  //   })
  // }

  return callable_obj
}
