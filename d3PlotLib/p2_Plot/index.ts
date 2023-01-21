import * as d3 from 'd3'
import * as d3Dispatch from 'd3-dispatch'
import { plotAttrs } from '../ChartAttribs'

const colorScheme = ['red', 'green', 'blue', 'grey']

export default function () {
  const obj: any = JSON.parse(JSON.stringify(plotAttrs))
  let _container: any = null

  // Dispatcher object to broadcast the mouse events
  const dispatcher = d3Dispatch.dispatch(
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

    const existingElements = children.filter(`g.${obj.plotID}`)
    if (existingElements.size() > 0) {
      return
    }

    obj.index = children.size()
    obj.plotID = `plot-${obj.index}`
    const plotGroup = chartGroup.append('g').classed(`${obj.plotID}`, true)

    const containerWidth = _container.chartWidth
    const containerHeight = _container.chartHeight
    obj.clipPathId = `${obj.plotID}-clippath`

    plotGroup
      .append('clipPath')
      .attr('id', obj.clipPathId)
      .append('rect')
      .attr('width', containerWidth + 30)
      .attr('height', containerHeight)

    // console.log('p2_Plot : obj/chart-group/children : ', obj, chartGroup, children)

    // set the colour etc
    const index = obj.index % colorScheme.length

    obj.colours = obj.colours.length === 0 ? colorScheme : obj.colours
    // obj.colours = colorScheme
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

    const { index } = obj
    const strokeColours = obj.colours
    const { xScale } = _container
    const { yScale } = _container
    const containerWidth = _container.width
    const containerHeight = _container.height

    // console.log('plot draw : obj / xs / ys / test xscale / test yscale ', obj, xs, ys, xScale(xs[0]), yScale(ys[0]))

    const { alpha } = obj
    const { styles } = obj
    const lineEffect = ''
    const curveType = obj.curve ?? d3.curveLinear

    // set the line style
    // if(styles.length > 0 && styles[0] === "--") {
    //   lineEffect = "stroke-dasharray"
    // }

    const { svg } = _container

    const chartGroup = svg.select(`.${obj.plotID}`)

    // select all rect in svg.chart-group with the class bar
    let lines = chartGroup.selectAll('.lines').data(ys)

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    lines.exit().style('opacity', 0).remove()

    // Enter - add the shapes to this data point
    const enterGroup = lines
      .enter()
      .append('path')
      .classed('lines', true)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)

    // join the new data points with existing
    lines = lines.merge(enterGroup)

    // now position and colour what exists on the dom
    lines
      .attr(
        'd',
        d3
          .line()
          .curve(curveType)
          .x((d: any, i: any) =>
            // console.log('d value / xs[i] / xs[i] with scale ', d, xs[i], xScale(xs[i]))
            xScale(xs[i])
          )
          .y((d: any) =>
            // console.log('d value / ys[i] / ys[i] with scale ', d, ys, yScale(d))
            yScale(d)
          )
      )
      .attr('clip-path', `url(#${obj.clipPathId})`)
      .attr(
        'stroke',
        (d: any, i: number) =>
          // console.log('stroke colours / d / i ', strokeColours, d, i)
          strokeColours[i]
      )
      .style(
        'opacity',
        (d: any, i: number) =>
          // console.log('alpha / d / i ', alpha, d, i)
          alpha[i]
      )
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
    // console.log('obj xs and ys: ', obj.xs, obj.ys)

    const x_extent = d3.extent(obj.xs, (elem: any) => elem)

    const y_extent = d3.extent(obj.ys, (elem: any) => elem)

    return {
      x: x_extent,
      y: y_extent,
    }
  }

  return callable_obj
}
