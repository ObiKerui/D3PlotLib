/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3Dispatch from 'd3-dispatch'
import * as d3 from 'd3'
import { plotAttrs } from '../ChartAttribs'

const colorScheme = ['red', 'green', 'blue', 'grey']

export default function () {
  const obj: any = JSON.parse(JSON.stringify(plotAttrs))
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    // const { labels } = obj
    // const { index } = obj
    // const strokeColour = obj.colour
    const { xScale } = container
    const { yScale } = container

    // console.log('stacked area draw : obj / xs / ys / test xscale / test yscale ', obj, xs, ys, xScale(xs[0]), yScale(ys[0]))

    // let alpha = obj.alpha
    // let style = obj.style
    // let lineEffect = ''

    // // set the line style
    // if (style == '--') {
    //   lineEffect = 'stroke-dasharray'
    // }

    const { svg } = container
    const chartGroup = svg.select(`.${obj.plotID}`)

    // select all rect in svg.chart-group with the class bar
    let bars = chartGroup.selectAll('.bar').data(ys)

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    bars.exit().style('opacity', 0).remove()

    // Enter - add the shapes to this data point
    const enterGroup = bars.enter().append('rect').classed('bar', true)

    // join the new data points with existing
    bars = bars.merge(enterGroup)

    // now position and colour what exists on the dom
    bars
      .attr('x', (d: any, idx: number) => xScale(xs[idx]))
      .attr('y', ({ open, close }: any) => yScale(Math.max(open, close)))
      .attr('width', 10)
      .attr('height', ({ open, close }: any) => {
        if (open === close) {
          return 1
        }
        const height = yScale(Math.min(open, close)) - yScale(Math.max(open, close))
        return height
      })
      .attr('fill', ({ open, close }: any) =>
        // eslint-disable-next-line no-nested-ternary
        open === close ? 'silver' : open > close ? 'red' : 'green'
      )
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

    // Select all lines in svg.chart-group with the class sticks
    let sticks = chartGroup.selectAll('.sticks').data(ys)

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    sticks.exit().style('opacity', 0).remove()

    // Enter - add the shapes to this data point
    const sticksEnterGroup = sticks.enter().append('line').attr('class', 'sticks')

    // join the new data points with existing
    sticks = sticks.merge(sticksEnterGroup)

    // now position and colour what exists on the dom
    sticks
      .attr('x1', (d: any) => {
        const startPoint = xScale(d.date)
        return startPoint + 10 / 2
      })
      .attr('x2', (d: any) => {
        const startPoint: number = xScale(d.date)
        return startPoint + 10 / 2
      })
      .attr('y1', (d: any) => yScale(d.high))
      .attr('y2', (d: any) => yScale(d.low))
      .attr('stroke', (d: any) =>
        // eslint-disable-next-line no-nested-ternary
        d.open === d.close ? 'white' : d.open > d.close ? 'red' : 'green'
      )
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

  return callableObj
}
