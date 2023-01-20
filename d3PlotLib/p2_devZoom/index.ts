/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3'
// import * as d3Dispatch from 'd3-dispatch'

export default function () {
  const obj: any = {}
  let zoomDetails: any = null

  // initialize throttlePause variable outside throttle function
  let throttlePause: boolean

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

  function toExport(containerAttrs: any) {
    const { mapWidth } = containerAttrs
    const { mapHeight } = containerAttrs
    const mapGroup = containerAttrs.svg.select('g.map-group')
    const metaGroup = containerAttrs.svg.select('g.metadata-group')

    function handleZoom() {
      const { transform } = d3.event
      throttle(() => {
        // console.log('what is transform: ', transform)
        mapGroup.attr('transform', transform)
      }, 10)
    }

    // let zoomDetails = metaGroup.select("g.zoom-details")
    // console.log('what are zoom details: ', zoomDetails)

    if (zoomDetails === null) {
      const zoom = d3
        .zoom()
        .on('zoom', handleZoom)
        .scaleExtent([1, 5])
        .translateExtent([
          [0, 0],
          [mapWidth, mapHeight],
        ])

      // console.log('what is map group here: ', mapGroup)
      mapGroup.call(zoom)

      // console.log('zoom params: ', containerAttrs, plottables, mapGroup)
      metaGroup.append('g').classed('zoom-details', true)

      zoomDetails = {}
    }
  }

  const callableObj: any = toExport

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

  callableObj.attr = function () {
    return obj
  }

  return callableObj
}
