/* eslint-disable @typescript-eslint/no-explicit-any */
// p2_StackedBar/index.ts
import * as d3 from 'd3'
// import * as d3Dispatch from 'd3-dispatch'
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

  function buildDataSet(xs: any, ys: any, keys: string[]) {
    const nbrRows = ys.length
    const nbrCols = ys[0].length
    const dataset = []

    for (let col = 0; col < nbrCols; col += 1) {
      const columnObj: any = {}

      for (let row = 0; row < nbrRows; row += 1) {
        const rowElem = ys[row]
        const label: string = keys[row]
        columnObj[label as keyof typeof columnObj] = rowElem[col]
      }
      dataset.push(columnObj)
    }

    // console.log('what dataset did we build? ', arr)
    return dataset
  }

  function drawData() {
    const { xs } = obj
    const { ys } = obj
    const { labels } = obj
    // const { index } = obj
    // const strokeColour = obj.colour
    const { xScale } = container
    const { yScale } = container

    // console.log('stacked area draw : obj / xs / ys / test xscale / test yscale ', obj, xs, ys, xScale(xs[0]), yScale(ys[0]))

    // const { alpha } = obj
    const { style } = obj
    // let lineEffect = ''

    // set the line style
    if (style === '--') {
      // lineEffect = 'stroke-dasharray'
    }

    const { svg } = container

    const chartGroup = svg.select(`.${obj.plotID}`)

    // let stackchartdataObj = data[0]
    // let categories = Object.keys(stackchartdataObj)
    // categories = categories.slice(1, categories.length)

    const colors = d3.scaleOrdinal().domain(labels).range(obj.colours)

    // format the data into stacked coordinates using d3.stack
    const data = buildDataSet(xs, ys, labels)
    const stack = d3.stack().keys(labels).order(d3.stackOrderDescending)
    const stackedDataset = stack(data)

    const selectionUpdate = chartGroup.selectAll('.layer').data(stackedDataset)

    const layer = selectionUpdate
      .enter()
      .append('g')
      .attr('class', 'layer')
      .style('fill', (d: any) => colors(d.key))

    layer
      .selectAll('rect')
      .data((d: any) => d)
      .enter()
      .append('rect')
      .attr('x', (d: any, i: number) => xScale(xs[i]))
      .attr('y', (d: any) => yScale(d[1]))
      .attr('height', (d: any) => {
        const height = yScale(d[0]) - yScale(d[1])
        return height
      })
      .attr('width', xScale.bandwidth())

    selectionUpdate.exit().remove()
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
  //   let value = dispatcher.on.apply(dispatcher, arguments)
  //   return value === dispatcher ? callableObj : value
  // }

  callableObj.attr = function () {
    return obj
  }

  return callableObj
}
