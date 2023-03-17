/* eslint-disable @typescript-eslint/no-explicit-any */
// import * as d3Dispatch from 'd3-dispatch'
import { legendAttrs } from '../ChartAttribs'

function Legend() {
  const obj: any = JSON.parse(JSON.stringify(legendAttrs))
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

    const legendId = metadataGroup.append('g').classed(`${obj.legendID}`, true)
    const legendIdAp = legendId.append('g').classed('anchorpoint', true)
    legendIdAp.append('rect').classed('background', true)
    legendIdAp.append('g').classed('innermargin', true)
  }

  function buildLegendData(plottables: any) {
    const allEntries = plottables.map((_plot: any) => {
      const labels = _plot.labels() ? _plot.labels() : ['none']
      const colours = _plot.colours() ? _plot.colours() : ['white']

      const entries = labels.map((element: any, ith: number) => ({
        label: element,
        colour: colours[ith],
      }))
      return entries
    })

    obj.legendData = [].concat([], ...allEntries)
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
        break
      default:
        break
    }
    return [xPos, yPos]
  }

  function drawData() {
    const { svg } = container
    const metadataGroup = svg.select(`.${obj.legendID}`)
    const anchorPoint = metadataGroup.select('g.anchorpoint')
    const rectBackground = anchorPoint.select('rect.background')
    const innerMargin = anchorPoint.select('g.innermargin')
    const keys = obj.legendData
    const size = 10
    const position = obj.position ?? 'topleft'
    const { chartWidth } = container
    const { chartHeight } = container
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

  function plot(_container: any, plottables: any) {
    container = _container
    buildContainerGroups()
    buildLegendData(plottables)
    drawData()
  }

  const callableObj: any = plot

  function generateAccessor<Type>(attr: string) {
    function accessor(value: Type): any {
      if (!arguments.length) {
        return obj[attr]
      }
      obj[attr] = value

      return callableObj
    }
    return accessor
  }

  callableObj.legendID = generateAccessor<string | null>('legendID')
  callableObj.index = generateAccessor<number | null>('index')
  callableObj.data = generateAccessor<unknown>('data')
  callableObj.position = generateAccessor<string | null>('position')

  return callableObj
}

export default Legend
