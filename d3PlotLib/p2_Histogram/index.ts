/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3'
import * as d3Array from 'd3-array'
import { dispatch } from 'd3-dispatch'
import { plotAttrs, barsAttrs } from '../ChartAttribs'

const publicAttrs = {
  ...plotAttrs,
  ...barsAttrs,
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function histogramScaling() {
  let useDensity = false
  let totalCounts = 0
  let ys: number[] = []
  let bins = 0
  let binWidth = 0
  let domain: any = null

  function toExport(x: any) {
    if (useDensity) {
      const density = x.length / (totalCounts * (x.x1 - x.x0))
      // console.log('called hist scal: ', useDensity, totalCounts, density)
      return density
    }
    // console.log('called hist scal: ', useDensity, totalCounts, x.length)
    return x.length
  }

  const callableObj: any = toExport

  callableObj.density = function (_x: boolean) {
    if (arguments) {
      useDensity = _x
      return callableObj
    }
    return useDensity
  }

  callableObj.counts = function (_x: number) {
    if (arguments) {
      totalCounts = _x
      return callableObj
    }
    return totalCounts
  }

  callableObj.domain = function (_x: any) {
    if (arguments) {
      domain = _x
      return callableObj
    }
    return domain
  }

  callableObj.ys = function (_x: number[]) {
    if (arguments) {
      ys = _x
      return callableObj
    }
    return ys
  }

  callableObj.bins = function (_x: number) {
    if (arguments) {
      bins = _x
      return callableObj
    }
    return bins
  }

  callableObj.binWidth = function (_x: number) {
    if (arguments) {
      binWidth = _x
      return callableObj
    }
    return binWidth
  }

  return callableObj
}

export default function () {
  // console.log('BarChart/index:21: what is public attrs: ', publicAttributes)
  let container: any = null

  const obj: any = JSON.parse(JSON.stringify(publicAttrs))

  // Dispatcher object to broadcast the mouse events
  const dispatcher = dispatch(
    'customMouseOver',
    'customMouseMove',
    'customMouseOut',
    'customMouseClick'
  )

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

  function makeBins(arr: number[], bins: number) {
    // const { xs } = obj
    const { xScale } = container
    // const extents: number[] = d3.extent(arr)
    // const range: number = extents[1] - extents[0]
    // const binSize: number = range / bins

    const binFtn = d3Array.bin().domain(xScale.domain()).thresholds(bins)

    const binObjs = binFtn(arr)

    // console.log('extent / range / binsize: ', extents, range, binSize)
    // console.log('bins / x scale domain / results: ', bins, xScale.domain(), binObjs)
    // return counts and bins

    return binObjs
  }

  function drawData() {
    const { ys } = obj
    // const { xs } = obj
    const { xScale } = container
    const { yScale } = container
    const { chartHeight } = container
    // const { chartWidth } = container
    const { svg } = container
    const { bins } = obj
    const { alpha } = obj
    // const normalize = false
    const useDensity: boolean = obj.density

    const chartGroup = svg.select(`.${obj.plotID}`)

    // calculate the bin objects and yscale domain
    const binsObjs: any[] = makeBins(ys, bins)
    const maxLength = d3Array.reduce(binsObjs, (p: any, v: []) => (v.length > p ? v.length : p), 0)

    // let normaliser: number = (normalize ? 1.0 / maxLength : 1.0)

    let maxHeight: number = maxLength

    if (useDensity) {
      let binWidth = 0

      if (binsObjs.length > 0) {
        const firstBin: any = binsObjs[0]
        binWidth = firstBin.x1 - firstBin.x0
      }

      maxHeight = maxLength / (ys.length * binWidth)
    }

    const currMaxHeight: number = yScale.domain()[1]
    if (currMaxHeight < maxHeight) {
      // yScale.domain([0, maxLength * normaliser])
      yScale.domain([0, maxHeight])
    }

    // console.log('max height is : ', maxHeight)

    // select all rect in svg.chart-group with the class bar
    let bars = chartGroup.selectAll('.bar').data(binsObjs)

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    bars.exit().style('opacity', 0).remove()

    // Enter - add the shapes to this data point
    const enterGroup = bars.enter().append('rect').classed('bar', true)

    // join the new data points with existing
    bars = bars.merge(enterGroup)

    // now position and colour what exists on the dom
    bars
      .attr('x', (x: any) =>
        // console.log('what is x1 / domain / range / xscaled x: ', x.x0, xScale.domain(), xScale.range(), xScale(x.x0))
        xScale(x.x0)
      )
      .attr('y', (x: any) => {
        let yPos = x.length
        if (useDensity) {
          yPos = x.length / (ys.length * (x.x1 - x.x0))
        }
        const yValue = yScale(yPos)
        return yValue
      })
      .attr('width', (x: any) => {
        const width = xScale(x.x1) - xScale(x.x0)
        return width
      })
      .attr('height', (x: any) => {
        // to compute density so that area under curve integrates to 1
        // density = x.length / total-no-counts * bin-width
        let height = x.length
        if (useDensity) {
          height = x.length / (ys.length * (x.x1 - x.x0))
        }

        // let height = histscale(x)
        height = chartHeight - yScale(height)
        return height
      })
      .attr('fill', () => 'red')
      .style('opacity', alpha)
      .on('mouseover', function (d: any) {
        d3.select(this).style('cursor', 'pointer')
        dispatcher.call('customMouseOver', this, d)
      })
      .on('mousemove', function (d: any) {
        d3.select(this).style('cursor', 'pointer')
        dispatcher.call('customMouseMove', this, d)
      })
      .on('mouseout', function (d: any) {
        dispatcher.call('customMouseOut', this, d)
      })
      .on('click', function (d: any) {
        dispatcher.call('customMouseClick', this, d)
      })

    // calculate and check == 1
    // let sum: number = 0
    // for(let i = 0; i < density_check_array.length; i++) {
    //   let curr: number = (density_check_array[i] * diff_check_array[i])
    //   sum += curr
    // }

    // console.log('what is the sum now: ', sum)
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
