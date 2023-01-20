import * as d3Dispatch from 'd3-dispatch'
import { legendAttrs } from '../ChartAttribs'

export default function () {
  const obj: any = JSON.parse(JSON.stringify(legendAttrs))
  let _container: any = null

  // Dispatcher object to broadcast the mouse events
  const dispatcher = d3Dispatch.dispatch(
    'customMouseOver',
    'customMouseMove',
    'customMouseOut',
    'customMouseClick'
  )

  function plot(container: any, plottables: any) {
    _container = container
    buildContainerGroups()
    buildLegendData(plottables)
    drawData()
  }

  function buildContainerGroups() {
    const { svg } = _container

    const metadataGroup = svg.select('g.metadata-group')
    const children = metadataGroup.selectAll(function () {
      return this.childNodes
    })

    const existingElement = children.filter(`g.${obj.legendID}`)
    if (existingElement.size()) {
      return
    }

    obj.index = children.size()
    obj.legendID = `legend-${obj.index}`

    const legend_id = metadataGroup.append('g').classed(`${obj.legendID}`, true)
    const legend_id_ap = legend_id.append('g').classed('anchorpoint', true)
    legend_id_ap.append('rect').classed('background', true)
    legend_id_ap.append('g').classed('innermargin', true)
  }

  function buildLegendData(plottables: any) {
    const all_entries = plottables.map((plot: any) => {
      const labels = plot.labels() ? plot.labels() : ['none']
      const colours = plot.colours() ? plot.colours() : ['white']

      const entries = labels.map((element: any, ith: number) => ({
        label: element,
        colour: colours[ith],
      }))
      return entries
    })

    obj.legendData = [].concat.apply([], all_entries)
  }

  function repositionAnchorPoint(
    position: string,
    chartWidth: number,
    chartHeight: number
  ): [number, number] {
    let xPos = 0
    let yPos = 0

    switch (position) {
      case 'topleft':
        xPos = 0
        yPos = 0
        break
      case 'topright':
        xPos = chartWidth * 0.6
        yPos = 0
        break
      case 'middleleft':
        xPos = 0
        yPos = chartHeight * 0.5
        break
      case 'middleright':
        xPos = chartWidth * 0.6
        yPos = chartHeight * 0.5
        break
      case 'bottomleft':
        xPos = 0
        yPos = chartHeight * 0.6
        break
      case 'bottomright':
        xPos = chartWidth * 0.6
        yPos = chartHeight * 0.6
      default:
        break
    }
    return [xPos, yPos]
  }

  function drawData() {
    const { svg } = _container
    const metadataGroup = svg.select(`.${obj.legendID}`)
    const anchorPoint = metadataGroup.select('g.anchorpoint')
    const rectBackground = anchorPoint.select('rect.background')
    const innerMargin = anchorPoint.select('g.innermargin')
    const keys = obj.legendData
    const size = 10
    const position = obj.position ?? 'topleft'
    const { chartWidth } = _container
    const { chartHeight } = _container
    const margin = 5

    let [xOffset, yOffset] = repositionAnchorPoint(position, chartWidth, chartHeight)
    xOffset += chartWidth * 0.05
    yOffset += chartHeight * 0.05

    // console.log('x offset + margin: ', xOffset, xOffset + margin)

    // position the anchor point
    anchorPoint.attr('transform', `translate(${xOffset},${yOffset})`)
    innerMargin.attr('transform', `translate(${margin},${margin})`)

    rectBackground
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 100)
      .attr('height', 100)
      .style('fill', 'white')
      .style('stroke', 'lightgrey')
      .style('opacity', 0.95)

    //-----------------------------------------------------
    // select all rect in svg.chart-group with the class bar
    let legendSymbols = innerMargin.selectAll('rect').data(keys)

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    legendSymbols.exit().style('opacity', 0).remove()

    // Enter - add the shapes to this data point
    const enterGroupSymbols = legendSymbols.enter().append('rect')

    // join the new data points with existing
    legendSymbols = legendSymbols.merge(enterGroupSymbols)

    legendSymbols
      .attr('x', 0)
      .attr('y', (d: any, i: number) => i * (size + 5)) // 100 is where the first dot appears. 25 is the distance between dots
      .attr('width', size)
      .attr('height', size)
      .style('fill', (d: any) => d.colour)

    let legendLabels = innerMargin.selectAll('text').data(keys)

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    legendLabels.exit().style('opacity', 0).remove()

    // Enter - add the shapes to this data point
    const enterGroupLabels = legendLabels.enter().append('text')

    // join the new data points with existing
    legendLabels = legendLabels.merge(enterGroupLabels)

    legendLabels
      .attr('x', size * 1.2)
      .attr('y', (d: any, i: number) => i * (size + 5) + size / 2) // 100 is where the first dot appears. 25 is the distance between dots
      .style('fill', (d: any) => d.colour)
      .text((d: any) => d.label)
      .attr('text-anchor', 'left')
      .style('alignment-baseline', 'middle')
      .style('font-size', '.8em')
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

  return callable_obj
}
