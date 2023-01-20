/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3'

// import * as d3Selection from 'd3-selection'
// import * as d3Dispatch from 'd3-dispatch'
import { plotAttrs } from '../ChartAttribs'

export default function () {
  const obj: any = JSON.parse(JSON.stringify(plotAttrs))
  let container: any = null
  // const zoomDetails: any = null

  // initialize throttlePause variable outside throttle function
  let throttlePause: boolean

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const throttle = (callback: any, time: number) => {
    if (throttlePause) return

    // set throttlePause to true after the if condition. This allows the function to be run once
    throttlePause = true

    // setTimeout runs the callback within the specified time
    setTimeout(() => {
      callback()

      // throttlePause is set to false once the function has been called, allowing the throttle function to loop
      throttlePause = false
    }, time)
  }

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
    obj.legendID = `brush-${obj.index}`

    const legendId = metadataGroup.append('g').classed(`${obj.legendID}`, true)
    const legendIdAp = legendId.append('g').classed('anchorpoint', true)
    legendIdAp.append('rect').classed('background', true)
    legendIdAp.append('g').classed('innermargin', true)
  }

  function drawData() {
    const { svg } = container
    const metadataGroup = svg.select(`.${obj.legendID}`)
    const anchorPoint = metadataGroup.select('g.anchorpoint')
    const rectBackground = anchorPoint.select('rect.background')
    const innerMargin = anchorPoint.select('g.innermargin')

    // let position = obj.position ?? "topleft"
    const { chartHeight } = container
    const { xScale } = container
    const { onChange } = obj

    const margin = 0

    let isInsideBrush = false
    let isMouseDown = false
    let xDragOffset = 0

    innerMargin.attr('transform', `translate(${margin},${margin})`)

    // width and height need to be set better - should focus on an area of data
    rectBackground
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 100)
      .attr('height', chartHeight)
      .style('fill', 'white')
      .style('stroke', 'blue')
      .style('opacity', 0.45)
      .on('mousemove', (d: any, i: number, node: any) => {
        const rect = d3.select(node[i])
        rect.style('cursor', 'grab')

        if (isMouseDown && isInsideBrush) {
          const mousePosition = d3.mouse(node[i])
          const posOnChartX = xScale.invert(mousePosition[0])
          // const x = xScale.invert(+rect.attr('x'))
          const rectX = +rect.attr('x')
          const rectWidth = +rect.attr('width')

          let newXvalue = xScale(posOnChartX) - xDragOffset

          // get min/max domain bounds
          const minX = xScale.domain()[0]
          const maxX = xScale.domain()[1]

          // check for values outside bounds of domain
          const lessThanXLimit = newXvalue < xScale(minX)
          const greaterThanXLimit = +(newXvalue + rectWidth) > xScale(maxX)

          // correct if necessary
          newXvalue = lessThanXLimit ? rectX : newXvalue
          newXvalue = greaterThanXLimit ? rectX : newXvalue

          // set the rect x attr
          rect.attr('x', newXvalue)

          if (!lessThanXLimit && !greaterThanXLimit) {
            const minDomain = xScale.invert(newXvalue)
            const innerRectWidth = +rect.attr('width')
            const maxDomain = xScale.invert(newXvalue + innerRectWidth)
            const newDomain = [minDomain, maxDomain]
            const newScaleX = xScale.copy()
            newScaleX.domain(newDomain)
            onChange(newScaleX)
          }
        }
      })
      .on('mouseenter', () => {
        isInsideBrush = true
      })
      .on('mouseleave', () => {
        isInsideBrush = false
        isMouseDown = false
      })
      .on('mousedown', (_d: any, i: number, node: any) => {
        isMouseDown = true
        const rect = d3.select(node[i])
        const xPos = +rect.attr('x')
        const mousePosition = d3.mouse(node[i])
        const xPosOnChart = xScale.invert(mousePosition[0])

        xDragOffset = Math.abs(xPos - xScale(xPosOnChart))
      })
      .on('mouseup', () => {
        isMouseDown = false
      })

    const minDomain = xScale.invert(0)
    const rectWidth = +rectBackground.attr('width')
    const maxDomain = xScale.invert(0 + rectWidth)
    const newDomain = [minDomain, maxDomain]
    const newScaleX = xScale.copy()
    newScaleX.domain(newDomain)
    onChange(newScaleX)
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

  callableObj.attr = function () {
    return obj
  }

  callableObj.onChange = function (_x: any) {
    if (arguments.length) {
      obj.onChange = _x
      return callableObj
    }
    return obj.onChange
  }

  return callableObj
}
