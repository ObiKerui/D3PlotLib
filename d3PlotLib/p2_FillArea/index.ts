// p2_FillArea/index.ts
'use strict'
import { plotAttrs } from '../ChartAttribs'
import interpolator from './interpolator'

declare const d3: any
declare const moment: any
declare const L: any
declare const $: any

const colorScheme = ['red', 'green', 'blue', 'grey']

export default function () {
  let obj: any = JSON.parse(JSON.stringify(plotAttrs))
  let _container: any = null

  // Dispatcher object to broadcast the mouse events
  const dispatcher = d3.dispatch(
    'customMouseOver',
    'customMouseMove',
    'customMouseOut',
    'customMouseClick'
  )

  function plot(container: any) {
    _container = container
    buildContainerGroups()
    drawData()
  }

  function buildContainerGroups() {
    let svg = _container.svg

    let chartGroup = svg.select('g.chart-group')
    let children = chartGroup.selectAll(function () {
      return this.childNodes
    })

    let existingElements = children.filter(`g.${obj.plotID}`)
    if (existingElements.size() > 0) {
      return
    }

    obj.index = children.size()
    obj.plotID = `plot-${obj.index}`
    chartGroup.append('g').classed(`${obj.plotID}`, true)

    // console.log('p2_Plot : obj/chart-group/children : ', obj, chartGroup, children)

    // set the colour etc
    let index = obj.index % colorScheme.length
    obj.colour = colorScheme[index]
  }

  function drawData() {
    let xs = obj.xs
    let ys = obj.ys
    let whereFtn = obj.where
    let labels = obj.labels
    let colours = obj.colours
    let xScale = _container.xScale
    let yScale = _container.yScale

    let ipltr = interpolator({
      xs: xs,
      ys: ys,
      where: whereFtn
    })

    let { newXs, newYs } = ipltr()

    let alpha = obj.alpha
    let style = obj.style
    let lineEffect = ''

    // set the line style
    if (style == '--') {
      lineEffect = 'stroke-dasharray'
    }

    let svg = _container.svg

    let chartGroup = svg.select(`.${obj.plotID}`)

    let colors = d3
    .scaleOrdinal()
    .domain(labels)
    .range(colours)

    // console.log('after interpolate: newXs, newYs, newStartX, isWithin', newXs, newYs, newStartX, isWithin)

    // begin stacked area
    let area = d3
      .area()
      .x((d: any, i: number) => {
        let scaled = xScale(newXs[i]) 
        return scaled
      })
      .y0((d: any, i: number) => {
        let minY = yScale.domain()[0]
        return yScale(minY)
      })
      .y1((d: any, i: number) => {
        return yScale(d)
      })

    let selectionUpdate = chartGroup.selectAll('path')
    .data([newYs])

    selectionUpdate
    .exit()
    .remove()

    let enterSelection = selectionUpdate
    .enter()
    .append('path')
    .attr('class', 'fill_between')

    selectionUpdate = selectionUpdate.merge(enterSelection)

    selectionUpdate
      .style('fill', (d: any) => {
        return colors(d.key)
      })
      .style('opacity', alpha)
      .attr('d', (d: any, i: number) => {
        return area(d, i)
      })
  }

  let callable_obj: any = plot

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
  for (let attr in obj) {
    if (!callable_obj[attr] && obj.hasOwnProperty(attr)) {
      callable_obj[attr] = generateAccessor(attr)
    }
  }

  callable_obj.on = function (_x: any) {
    let value = dispatcher.on.apply(dispatcher, arguments)
    return value === dispatcher ? callable_obj : value
  }

  callable_obj.attr = function () {
    return obj
  }

  callable_obj.where = function(_x: any) {
    if(arguments.length) {
      obj['where'] = _x
      return callable_obj
    }
    return obj['where']
  }
  return callable_obj
}
