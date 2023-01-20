/* eslint-disable @typescript-eslint/no-explicit-any */
// p2_FillArea/index.ts
import * as d3 from 'd3'
// import * as d3Dispatch from 'd3-dispatch'

import { plotAttrs } from '../ChartAttribs'
import interpolator from './interpolator'

const colorScheme = ['red', 'green', 'blue', 'grey']

export default function () {
  const obj: any = JSON.parse(JSON.stringify(plotAttrs))
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

    const existingElements = children.filter(`g.${obj.plotID}`)
    if (existingElements.size() > 0) {
      return
    }

    obj.index = children.size()
    obj.plotID = `plot-${obj.index}`
    chartGroup.append('g').classed(`${obj.plotID}`, true)

    // console.log('p2_Plot : obj/chart-group/children : ', obj, chartGroup, children)

    // set the colour etc
    const index = obj.index % colorScheme.length
    obj.colour = colorScheme[index]
  }

  function drawData() {
    const { xs } = obj
    const { ys } = obj
    const whereFtn = obj.where
    const { labels } = obj
    const { colours } = obj
    const { xScale } = container
    const { yScale } = container

    const ipltr = interpolator({
      xs,
      ys,
      where: whereFtn,
    })

    const { newXs, newYs } = ipltr()

    const { alpha } = obj
    // const { style } = obj
    // let lineEffect = ''

    // set the line style
    // if (style === '--') {
    //   lineEffect = 'stroke-dasharray'
    // }

    const { svg } = container

    const chartGroup = svg.select(`.${obj.plotID}`)

    const colors = d3.scaleOrdinal().domain(labels).range(colours)

    // console.log('after interpolate: newXs, newYs, newStartX, isWithin', newXs, newYs, newStartX, isWithin)

    // begin stacked area
    const area = d3
      .area()
      .x((d: any, i: number) => {
        const scaled = xScale(newXs[i])
        return scaled
      })
      .y0(() => {
        const minY = yScale.domain()[0]
        return yScale(minY)
      })
      .y1((d: any) => yScale(d))

    let selectionUpdate = chartGroup.selectAll('path').data([newYs])

    selectionUpdate.exit().remove()

    const enterSelection = selectionUpdate.enter().append('path').attr('class', 'fill_between')

    selectionUpdate = selectionUpdate.merge(enterSelection)

    selectionUpdate
      .style('fill', (d: any) => colors(d.key))
      .style('opacity', alpha)
      // ! previously was this: .attr('d', (d: any, i: number) => area(d, i))
      .attr('d', (d: any) => area(d))
  }

  function plot(_container: any) {
    container = _container
    buildContainerGroups()
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
  Object.keys(obj).forEach((attr: any) => {
    if (!callableObj[attr] && Object.prototype.hasOwnProperty.call(obj, attr)) {
      callableObj[attr] = generateAccessor(attr)
    }
  })

  // callableObj.on = function (_x: any) {
  //   const value = dispatcher.on.apply(dispatcher, arguments)
  //   return value === dispatcher ? callableObj : value
  // }

  callableObj.attr = function () {
    return obj
  }

  callableObj.where = function (_x: any) {
    if (arguments.length) {
      obj.where = _x
      return callableObj
    }
    return obj.where
  }
  return callableObj
}
