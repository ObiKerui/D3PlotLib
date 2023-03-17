/* eslint-disable @typescript-eslint/no-explicit-any */
// import * as d3Dispatch from 'd3-dispatch'
import * as d3 from 'd3'
import { lineAttrs } from '../ChartAttribs'

const colorScheme = ['red', 'green', 'blue', 'grey']

export default function () {
  const obj: any = JSON.parse(JSON.stringify(lineAttrs))
  let container: any = null

  // Dispatcher object to broadcast the mouse events
  // const dispatcher = d3Dispatch.dispatch(
  //   'customMouseOver',
  //   'customMouseMove',
  //   'customMouseOut',
  //   'customMouseClick'
  // )

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
      .classed('clip-path', true)
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
    // const { xs } = obj
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

    const ysValidated = Array.isArray(ys) ? ys : []

    xScale = d3
      .scaleLinear()
      .domain(d3.extent(xScale.domain() as number[]))
      .range(xScale.range())

    const chartGroup = svg.select(`.${obj.lineID}`)

    let lines = chartGroup.selectAll('.lines').data(ysValidated)

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
      .attr('x1', () => xScale(xStart))
      .attr('x2', () => xScale(xEnd))
      .attr('y1', (d: any) =>
        // console.log('what is y1 : ', d, i)
        yScale(d)
      )
      .attr('y2', (d: any) => yScale(d))
      .attr('clip-path', `url(#${obj.clipPathId})`)
      .attr('stroke', strokeColour)
      .style('opacity', alpha)
      .style(lineEffect, '3, 3')
      .on('mouseover', function () {
        d3.select(this).style('cursor', 'pointer')
        // dispatcher.call('customMouseOver', this, d)
      })
      .on('mousemove', () => {
        // dispatcher.call('customMouseMove', this, d)
      })
      .on('mouseout', () => {
        // dispatcher.call('customMouseOut', this, d)
      })
      .on('click', () => {
        // dispatcher.call('customMouseClick', this, d)
      })
  }

  function plot(_container: any) {
    container = _container
    buildContainerGroups()
    prepareData()
    drawData()
  }

  const callableObj: any = plot

  function generateAccessor<Type>(attr: string) {
    function accessor(value: Type): any {
      if (!arguments.length) {
        return obj[attr]
      }
      obj[attr] = value

      return callableObj
    }
    return accessor
  }

  callableObj.tag = generateAccessor<string | null>('tag')
  callableObj.xs = generateAccessor<unknown>('xs')
  callableObj.ys = generateAccessor<unknown>('ys')
  callableObj.lineID = generateAccessor<string | null>('lineID')
  callableObj.index = generateAccessor<number | null>('index')
  callableObj.alpha = generateAccessor<number | null>('alpha')
  callableObj.colours = generateAccessor<unknown>('colours')
  callableObj.labels = generateAccessor<unknown>('labels')
  callableObj.styles = generateAccessor<string | null>('styles')

  return callableObj
}
