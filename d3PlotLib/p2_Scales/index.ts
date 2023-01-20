/* eslint-disable @typescript-eslint/no-explicit-any */
// p2_Scales/index.ts
// declare const d3: any
// declare const moment: any
// declare const L: any
// declare const $: any

export default function () {
  const obj: any = {}

  function toExport(containerAttrs: any, plottables: any) {
    const xs: unknown[] = []
    const ys: unknown[] = []

    // create a 2d array - each entry is an array of the y values
    // would not have to do this if plottable provides ys already in 2d array format...
    plottables.forEach((plottable: any) => {
      const plotXS = plottable.xs()
      if (Array.isArray(plotXS)) {
        xs.push(plotXS)
      }

      const plotYS = plottable.ys()

      if (Array.isArray(plotYS)) {
        if (Array.isArray(plotYS[0])) {
          ys.push(...plotYS)
        } else {
          ys.push(plotYS)
        }
      }
    })

    // get/compute the chart width/height (may add padding to this in future)
    const { chartWidth } = containerAttrs
    const { chartHeight } = containerAttrs

    let xScale = obj['xScale']

    if (typeof xScale === 'function') {
      xScale = xScale(xs[0], chartWidth)
    }

    let yScale = obj['yScale']

    if (typeof yScale === 'function') {
      yScale = yScale(ys, chartHeight)
    }

    // check if the user assigned this first
    if(xScale) {
      xScale.rangeRound([0, chartWidth])
    }

    if(yScale) {
      yScale.rangeRound([chartHeight, 0])
    }

    containerAttrs.xScale = xScale
    containerAttrs.yScale = yScale
  }

  let callableObj: any = toExport

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
  for (let attr in obj) {
    if (!callableObj[attr] && obj.hasOwnProperty(attr)) {
      callableObj[attr] = generateAccessor(attr)
    }
  }

  callableObj.attr = function () {
    return obj
  }

  callableObj.xScale = function (_x: any) {
    if (arguments.length) {
      obj['xScale'] = _x
      return callableObj
    }
    return callableObj['xScale']
  }

  callableObj.yScale = function (_x: any) {
    if (arguments.length) {
      obj['yScale'] = _x
      return callableObj
    }
    return callableObj['yScale']
  }

  return callableObj

  //   console.log('P2_plot/index/buildScales: x vals ext. x scale dom. maxhi minlow data\n', xValuesExtent, xScale.domain(), maxHigh, minLow, data)
  //   console.log('hopefully changed the scales: ', typeof(xScale))
}
