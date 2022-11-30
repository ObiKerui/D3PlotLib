// p2_Scales/index.ts
'use strict'

declare const d3: any
declare const moment: any
declare const L: any
declare const $: any

export default function () {
  let obj: any = {}

  function toExport(containerAttrs: any, plottables: any) {

    let xs : any = []
    let ys : any = []

    // create a 2d array - each entry is an array of the y values
    // would not have to do this if plottable provides ys already in 2d array format...
    plottables.forEach((plottable: any) => {

      let plot_xs = plottable.xs()
      xs.push(plot_xs)

      let plot_ys = plottable.ys()
      if(Array.isArray(plot_ys[0])) {
        ys.push(...plot_ys)
      } else {
        ys.push(plot_ys)
      }
    })

    // get/compute the chart width/height (may add padding to this in future)
    let chartWidth = containerAttrs.chartWidth
    let chartHeight = containerAttrs.chartHeight

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
