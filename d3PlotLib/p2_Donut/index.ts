// p2_Donut/index.ts
import * as d3 from 'd3'
import { dispatch } from 'd3-dispatch'
import { plotAttrs } from '../ChartAttribs'

const colorScheme = ['red', 'green', 'blue', 'grey']

export default function () {
  let obj: any = JSON.parse(JSON.stringify(plotAttrs))
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
    // prepareData()
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

  function preprocessData(ys: number[]) {

    // Compute the position of each group on the pie:
    let pieGen = d3.pie()
    let data_ready = pieGen(ys)
    return data_ready
  }

  function drawData() {
    let ys = obj.ys
    let labels = obj.labels

    let chartWidth = _container.chartWidth
    let chartHeight = _container.chartHeight
    let margin = 0

    let svg = _container.svg
    let chartGroup = svg.select(`.${obj.plotID}`)

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    let radius: number = Math.min(chartWidth, chartHeight) / 2 - margin

    let centre = chartGroup.attr('transform', `translate(${chartWidth / 2}, ${chartHeight / 2})`)

    // set the color scale
    let color = d3.scaleOrdinal().domain(labels).range(d3.schemeDark2)

    let data_ready = preprocessData(ys)

    // The arc generator
    let arc = d3
      .arc()
      .innerRadius(radius * 0.5) // This is the size of the donut hole
      .outerRadius(radius * 0.8)

    // Another arc that won't be drawn. Just for labels positioning
    let outerArc = d3
      .arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9)

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    let slices = centre
    .selectAll('allSlices')
    .data(data_ready)

    slices.exit().remove()

    let enterSlices =  slices.enter()
    .append('path')

    slices = slices.merge(enterSlices)

    slices  
    .attr('d', arc)
    .attr('fill', function (d: any, ith: number) {
        return color(labels[ith])
    })
    .attr('stroke', 'white')
    .style('stroke-width', '2px')
    .style('opacity', 0.7)

    // Add the polylines between chart and labels:
    let polyLines = centre
    .selectAll('allPolylines')
    .data(data_ready)

    polyLines.exit().remove()

    let polyLinesEnter = polyLines
    .enter()
    .append('polyline')

    polyLines = polyLines.merge(polyLinesEnter)

    polyLines
    .attr('stroke', 'black')
    .style('fill', 'none')
    .attr('stroke-width', 1)
    .attr('points', function (d: any) {
      let posA = arc.centroid(d) // line insertion in the slice
      let posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
      let posC = outerArc.centroid(d) // Label position = almost the same as posB
      let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
      posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1) // multiply by 1 or -1 to put it on the right or on the left
      return [posA, posB, posC]
    })

    // Add the polylines between chart and labels:
    let pieLabels = centre
    .selectAll('allLabels')
    .data(data_ready)

    pieLabels.exit().remove()

    let pieLabelsEnter = pieLabels
    .enter()
    .append('text')

    pieLabels = pieLabels.merge(pieLabelsEnter)

    pieLabels  
    .text(function (d: any, ith: number) {
        return labels[ith]
    })
    .attr('transform', function (d: any) {
      var pos = outerArc.centroid(d)
      var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
      pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1)
      return `translate(${pos})`
    })
    .style('text-anchor', function (d: any) {
      var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
      return midangle < Math.PI ? 'start' : 'end'
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

  callable_obj.extent = function () {
    // console.log('obj xs and ys: ', obj.xs, obj.ys)

    let x_extent = d3.extent(obj.xs, (elem: any) => {
      return elem
    })

    let y_extent = d3.extent(obj.ys, (elem: any) => {
      return elem
    })

    return {
      x: x_extent,
      y: y_extent,
    }
  }

  return callable_obj
}
