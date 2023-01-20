/* eslint-disable @typescript-eslint/no-explicit-any */
// BarChart/index.ts

import * as d3 from 'd3'
import { dispatch } from 'd3-dispatch'
import { plotAttrs, barsAttrs } from '../ChartAttribs'

const publicAttrs = {
  ...plotAttrs,
  ...barsAttrs,
}

export default function () {
  // console.log('BarChart/index:21: what is public attrs: ', publicAttributes)
  let container: any = null

  const obj: any = JSON.parse(JSON.stringify(publicAttrs))

  // Dispatcher object to broadcast the mouse events
  const dispatcher = dispatch(
    'customMouseOver',
    'customMouseMove',
    'customMouseOut',
    'customMouseClick'
  )

  function buildContainerGroups() {
    // console.log('what is container when build groups: ', _container)
    const { svg } = container

    const chartGroup = svg.select('g.chart-group')
    const children = chartGroup.selectAll(function () {
      return this.childNodes
    })

    const existingElements = children.filter(`g.${obj.plotID}`)
    if (existingElements.size() > 0) {
      return
    }

    obj.index = children.size()
    obj.plotID = `bars-${children.size()}`
    chartGroup.append('g').classed(`${obj.plotID}`, true)
    // console.log('chart-group/children : ', chartGroup, children)
  }

  function drawData() {
    const { ys } = obj
    const { xs } = obj
    const { xScale } = container
    const { yScale } = container
    const { chartHeight } = container
    const { svg } = container
    const { alpha } = obj

    // alpha is currently an array and somehow works
    // probably could be modified so the array length = data array length

    const chartGroup = svg.select(`.${obj.plotID}`)

    // select all rect in svg.chart-group with the class bar
    let bars = chartGroup.selectAll('.bar').data(xs)

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    bars.exit().style('opacity', 0).remove()

    // Enter - add the shapes to this data point
    const enterGroup = bars.enter().append('rect').classed('bar', true)

    // join the new data points with existing
    bars = bars.merge(enterGroup)

    // now position and colour what exists on the dom
    bars
      .attr('x', (x: unknown) => xScale(x))
      .attr('y', (x: unknown, idx: number) => {
        const yValue = yScale(ys[idx])
        return yValue
      })
      .attr('width', xScale.bandwidth())
      .attr('height', (x: unknown, idx: number) => {
        const height = chartHeight - yScale(ys[idx])
        return height
      })
      .attr('fill', () => 'red')
      .style('opacity', alpha)
      .on('mouseover', function (d: unknown) {
        d3.select(this).style('cursor', 'pointer')
        dispatcher.call('customMouseOver', this, d)
      })
      .on('mousemove', function (d: unknown) {
        d3.select(this).style('cursor', 'pointer')
        dispatcher.call('customMouseMove', this, d)
      })
      .on('mouseout', function (d: unknown) {
        dispatcher.call('customMouseOut', this, d)
      })
      .on('click', function (d: unknown) {
        dispatcher.call('customMouseClick', this, d)
      })
  }

  function plot(_container: unknown) {
    container = _container
    buildContainerGroups()
    drawData()
  }

  const callableObj: any = plot

  // callableObj.on = function (_x: unknown) {
  //   const value = dispatcher.on.apply(dispatcher, arguments)
  //   return value === dispatcher ? callableObj : value
  // }

  /**
   * Gets or Sets the text of the yAxisLabel on the chart
   * @param  {String} _x Desired text for the label
   * @return {String | module} label or Chart module to chain calls
   * @public
   */

  function generateAccessor(attr: any) {
    function accessor(value: unknown) {
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
  //   if (!callableObj[attr] && obj.hasOwnProperty(attr)) {
  //     callableObj[attr] = generateAccessor(attr)
  //   }
  // }
  Object.keys(obj).forEach((attr: any) => {
    if (!callableObj[attr] && Object.prototype.hasOwnProperty.call(obj, attr)) {
      callableObj[attr] = generateAccessor(attr)
    }
  })

  return callableObj
}
