/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3'
// import * as d3Dispatch from 'd3-dispatch'
import { plotAttrs } from '../ChartAttribs'

const colorScheme = ['red', 'green', 'blue', 'grey']

export default function () {
  const obj: any = JSON.parse(JSON.stringify(plotAttrs))
  let _container: any = null

  // Dispatcher object to broadcast the mouse events
  // const dispatcher = d3Dispatch.dispatch(
  //   'customMouseOver',
  //   'customMouseMove',
  //   'customMouseOut',
  //   'customMouseClick'
  // )

  function buildContainerGroups() {
    const { svg } = _container

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
    obj.colours = colorScheme
  }

  function buildDataSet(xs: any, ys: any, keys: string[]) {
    const nbrRows = ys.length
    const nbrCols = ys[0].length
    const dataset = []

    for (let col = 0; col < nbrCols; col++) {
      const column_obj: any = {}

      for (let row = 0; row < nbrRows; row++) {
        const row_elem = ys[row]
        const label: string = keys[row]
        column_obj[label as keyof typeof column_obj] = row_elem[col]
      }
      dataset.push(column_obj)
    }

    // console.log('what dataset did we build? ', arr)
    return dataset
  }

  function drawData() {
    const { xs } = obj
    const { ys } = obj
    const { labels } = obj
    const { index } = obj
    const strokeColour = obj.colour
    const { xScale } = _container
    const { yScale } = _container

    // console.log('stacked area draw : obj / xs / ys / test xscale / test yscale ', obj, xs, ys, xScale(xs[0]), yScale(ys[0]))

    const { alpha } = obj
    const { style } = obj
    let lineEffect = ''

    // set the line style
    if (style == '--') {
      lineEffect = 'stroke-dasharray'
    }

    const { svg } = _container

    const chartGroup = svg.select(`.${obj.plotID}`)

    // let stackchartdataObj = data[0]
    // let categories = Object.keys(stackchartdataObj)
    // categories = categories.slice(1, categories.length)

    const colors = d3.scaleOrdinal().domain(labels).range(obj.colours)

    // .range(['#e41a1c', '#377eb8', '#4ddd4a', '#4aaa1b', '#4aaa5c'])

    // format the data into stacked coordinates using d3.stack
    const data = buildDataSet(xs, ys, labels)
    const stack = d3.stack().keys(labels).order(d3.stackOrderDescending)
    const stackedDataset = stack(data)

    // console.log('stacked area what is dataset: ', stackedDataset)
    // console.log('xscale domains: ', xScale.domain()[0], xScale.domain()[1])
    // xScale.domain([1, 5])
    // yScale.domain([0, 100])
    // console.log('test the scales: ', xScale, xScale(1), xScale(2), xScale(5))
    // console.log('test the scales y: ', yScale, yScale(3), yScale(35))

    // begin stacked area
    const area = d3
      .area()
      .x((_d: any, i: number) => {
        // console.log('what is d / xs ith : ', d, xs[i])
        const scaled = xScale(xs[i])
        return scaled
        // console.log('what is created for x in area: ', d, xScale(d.data.year))
        // return xScale(d.data.year)
      })
      .y0((d: any) => yScale(d[0]))
      .y1((d: any) => yScale(d[1]))

    const selectionUpdate = chartGroup.selectAll('.layer').data(stackedDataset)

    selectionUpdate.exit().remove()

    selectionUpdate
      .enter()
      .append('g')
      .attr('class', 'layer')
      .append('path')
      .attr('class', 'area')
      .style('fill', (d: any) => colors(d.key))
      .attr('d', (d: any) => area(d))
  }

  function plot(container: any) {
    _container = container
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

  // callableObj.on = function (_x: any) {
  //   const value = dispatcher.on.apply(dispatcher, arguments)
  //   return value === dispatcher ? callableObj : value
  // }

  callableObj.attr = function () {
    return obj
  }

  // callable_obj.extent = function (_x: any) {
  //   if (arguments.length) {
  //     obj['extent'] = _x
  //     return callable_obj
  //   }

  //   // console.log('obj xs and ys: ', obj.xs, obj.ys)

  //   let x_extent = d3.extent(obj.xs, (elem: any) => {
  //     return elem
  //   })

  //   let y_extent = d3.extent(obj.ys, (elem: any) => {
  //     return elem
  //   })

  //   return {
  //     x: x_extent,
  //     y: y_extent,
  //   }
  // }

  return callableObj
}
