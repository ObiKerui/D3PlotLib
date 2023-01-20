/* eslint-disable @typescript-eslint/no-explicit-any */
// import * as d3Dispatch from 'd3-dispatch'
import * as d3 from 'd3'
import { plotAttrs } from '../ChartAttribs'

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
    // const index = obj.index % colorScheme.length
    obj.colours = colorScheme
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
    // const { xs } = obj

    // const { index } = obj
    // const strokeColours = obj.colours
    const { xScale } = container
    const { yScale } = container

    // const cellSize = 20

    // console.log('plot draw : obj / xs / ys / test xscale / test yscale ', obj, xs, ys, xScale(xs[0]), yScale(ys[0]))

    // const { alpha } = obj
    // const { styles } = obj
    // const lineEffect = ''
    // const curveType = obj.curve ?? d3.curveLinear
    // const itemSize = 10

    const colorScale = d3
      .scaleThreshold<number, string>()
      .domain([0.85, 1])
      .range(['#2980B9', '#E67E22', '#27AE60', '#27AE60'])

    const { svg } = container

    const chartGroup = svg.select(`.${obj.plotID}`)

    // console.log('what is data for heatmap: ', ys.length)

    let cells = chartGroup.selectAll('g').data(ys)

    const enterCells = cells.enter().append('g').append('rect')

    cells.exit().remove()

    cells = cells.merge(enterCells)

    cells
      .attr('class', 'cell')
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .attr('y', (d: any) =>
        // console.log('what is y data for hm: ', d)
        yScale(d.country)
      )
      .attr('x', (d: any) =>
        // console.log('what is x data for hm: ', d)
        xScale(d.product)
      )
      .attr('fill', (d: any) => colorScale(d.value))
  }

  function plot(_container: any) {
    container = _container
    buildContainerGroups()
    // prepareData()
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
  //   if (!callableObj[attr] && obj.hasOwnProperty(attr)) {
  //     callableObj[attr] = generateAccessor(attr)
  //   }
  // }
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

  return callableObj
}
