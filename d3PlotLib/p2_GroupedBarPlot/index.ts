/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3'
// import { dispatch } from 'd3-dispatch'
import { plotAttrs, barsAttrs } from '../ChartAttribs'

const publicAttrs = {
  ...plotAttrs,
  ...barsAttrs,
}

export default function () {
  // console.log('BarChart/index:21: what is public attrs: ', publicAttributes)
  let container: any = null

  const obj: any = JSON.parse(JSON.stringify(publicAttrs))

  // Dispatcher object to broadcast the mouse events
  // const dispatcher = dispatch(
  //   'customMouseOver',
  //   'customMouseMove',
  //   'customMouseOut',
  //   'customMouseClick'
  // )

  function buildContainerGroups() {
    // console.log('what is container when build groups: ', _container)
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
    obj.plotID = `bars-${children.size()}`
    chartGroup.append('g').classed(`${obj.plotID}`, true)
    // console.log('chart-group/children : ', chartGroup, children)
  }

  function drawData() {
    const { ys } = obj
    // const { xs } = obj
    const { xScale } = container
    const { yScale } = container
    const { chartHeight } = container
    const { svg } = container
    const subgroups: any[] = ['Nitrogen', 'normal', 'stress']

    const chartGroup = svg.select(`.${obj.plotID}`)

    const xScaleSubgroup = d3
      .scaleBand()
      .domain(subgroups)
      .range([0, xScale.bandwidth()])
      .padding(0.05)

    // color palette = one color per subgroup
    const color = d3.scaleOrdinal().domain(subgroups).range(['#e41a1c', '#377eb8', '#4daf4a'])

    // Show the bars
    let outerBars = chartGroup.selectAll('g').data(ys)

    const enterOuterBars = outerBars.enter().append('g')

    outerBars.exit().remove()

    outerBars = outerBars.merge(enterOuterBars)

    outerBars.attr('transform', (d: any) => `translate(${xScale(d.group)},0)`)

    let innerBars = outerBars.selectAll('rect').data((d: any) => {
      const toRet = subgroups.map((key) => ({
        key,
        value: d[key],
      }))
      return toRet
    })

    const innerBarsEnter = innerBars.enter().append('rect')

    innerBars = innerBars.merge(innerBarsEnter)

    innerBars
      .attr('x', (d: any) => xScaleSubgroup(d.key))
      .attr('y', (d: any) => yScale(d.value))
      .attr('width', xScaleSubgroup.bandwidth())
      .attr('height', (d: any) => chartHeight - yScale(d.value))
      .attr('fill', (d: any) =>
        // return 'red'
        color(d.key)
      )
  }

  function plot(_container: any) {
    container = _container
    buildContainerGroups()
    drawData()
  }

  const callableObj: any = plot

  // callableObj.on = function (_x: any) {
  //   const value = dispatcher.on.apply(dispatcher, arguments)
  //   return value === dispatcher ? callableObj : value
  // }

  /**
   * Gets or Sets the text of the yAxisLabel on the chart
   * @param  {String} _x Desired text for the label
   * @return {String | module} label or Chart module to chain calls
   * @public
   */

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

  return callableObj
}
