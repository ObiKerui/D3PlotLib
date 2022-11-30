// Histogram/index.ts
"use strict";
import { plotAttrs, barsAttrs } from '../ChartAttribs';

declare const d3: any;
declare const moment: any;
declare const L: any;
declare const $: any;

const publicAttrs = {
  ...plotAttrs,
  ...barsAttrs
}

function histogram_scaling() {
  
  let useDensity: boolean = false
  let totalCounts: number = 0
  let ys: number[] = []
  let bins: number = 0
  let binWidth: number = 0
  let domain: any = null

  function toExport(x: any) {
    if(useDensity) {
      let density = x.length / (totalCounts * (x.x1 - x.x0))
      // console.log('called hist scal: ', useDensity, totalCounts, density)
      return density
    } else {
      // console.log('called hist scal: ', useDensity, totalCounts, x.length)
      return x.length
    }
  }

  let callable_obj: any = toExport

  callable_obj.density = function(_x: boolean) {
    if(arguments) {
      useDensity = _x
      return callable_obj
    }
    return useDensity
  }

  callable_obj.counts = function(_x: number) {
    if(arguments) {
      totalCounts = _x
      return callable_obj
    }
    return totalCounts
  }

  callable_obj.domain = function(_x: any) {
    if(arguments) {
      domain = _x
      return callable_obj
    }
    return domain
  }

  callable_obj.ys = function(_x: number[]) {
    if(arguments) {
      ys = _x
      return callable_obj
    }
    return ys
  }

  callable_obj.bins = function(_x: number) {
    if(arguments) {
      bins = _x
      return callable_obj
    }
    return bins
  }

  callable_obj.binWidth = function(_x: number) {
    if(arguments) {
      binWidth = _x
      return callable_obj
    }
    return binWidth
  }

  return callable_obj
}

export default function () {

  // console.log('BarChart/index:21: what is public attrs: ', publicAttributes)
  let _container: any = null

  let obj: any = JSON.parse(JSON.stringify(publicAttrs))

  // Dispatcher object to broadcast the mouse events
  const dispatcher = d3.dispatch(
    "customMouseOver",
    "customMouseMove",
    "customMouseOut",
    "customMouseClick"
  );

  function plot(container: any) {
    _container = container
    buildContainerGroups()
    drawData()
  }

  function buildContainerGroups() {
    // console.log('what is container when build groups: ', _container)
    let svg = _container.svg

    let chartGroup = svg.select("g.chart-group")
    let children = chartGroup
      .selectAll(function () { return this.childNodes })

    let existingElements = children.filter(`g.${obj.plotID}`)
    if(existingElements.size() > 0) {
      return
    }

    obj.index = children.size()
    obj.plotID = `bars-${children.size()}`
    chartGroup.append("g").classed(`${obj.plotID}`, true)
    // console.log('chart-group/children : ', chartGroup, children)
  }

  function makeBins(arr: number[], bins: number) {
    let xs = obj.xs
    let xScale = _container.xScale
    let extents : number[] = d3.extent(arr)
    let range: number = extents[1] - extents[0]
    let binSize: number = range / bins

    let binFtn = d3.bin()
    .domain(xScale.domain())
    .thresholds(bins)

    let binObjs: [] = binFtn(arr)

    // console.log('extent / range / binsize: ', extents, range, binSize)
    // console.log('bins / x scale domain / results: ', bins, xScale.domain(), binObjs)
    // return counts and bins

    return binObjs
  }


  function drawData() {
    let ys = obj.ys
    let xs = obj.xs
    let xScale = _container.xScale
    let yScale = _container.yScale
    let chartHeight = _container.chartHeight
    let chartWidth = _container.chartWidth
    let svg = _container.svg
    let bins = obj.bins
    let alpha = obj.alpha
    let normalize: boolean = false
    let useDensity: boolean = obj.density

    let chartGroup = svg.select(`.${obj.plotID}`)

    // calculate the bin objects and yscale domain
    let binsObjs: any[] = makeBins(ys, bins)
    let maxLength = d3.reduce(binsObjs, (p: any, v: []) => {
      return (v.length > p ? v.length : p) 
    }, 0)

    // let normaliser: number = (normalize ? 1.0 / maxLength : 1.0)

    let maxHeight: number = maxLength

    if(useDensity) {

      let binWidth: number = 0
      
      if(binsObjs.length > 0) {
        let firstBin: any = binsObjs[0]
        binWidth = (firstBin.x1 - firstBin.x0)  
      }

      maxHeight = maxLength / (ys.length * (binWidth))
    }
    
    let currMaxHeight: number = yScale.domain()[1]
    if(currMaxHeight < maxHeight) {
      // yScale.domain([0, maxLength * normaliser])
      yScale.domain([0, maxHeight])
    }

    // console.log('max height is : ', maxHeight)

    // select all rect in svg.chart-group with the class bar
    let bars = chartGroup
      .selectAll(".bar")
      .data(binsObjs)

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    bars.exit()
      .style("opacity", 0)
      .remove()

    // Enter - add the shapes to this data point
    let enterGroup = bars
      .enter()
      .append("rect")
      .classed("bar", true)

    // join the new data points with existing 
    bars = bars.merge(enterGroup)

    // now position and colour what exists on the dom
    bars
      .attr("x", (x: any) => {
        // console.log('what is x1 / domain / range / xscaled x: ', x.x0, xScale.domain(), xScale.range(), xScale(x.x0))
        return xScale(x.x0)
      })
      .attr("y", (x: any, idx: number) => {
        let yPos = x.length
        if(useDensity) {
          yPos = x.length / (ys.length * (x.x1 - x.x0))
        }
        let yValue = yScale(yPos)
        return yValue
      })
      .attr("width", (x: any) => {
        let width = xScale(x.x1) - xScale(x.x0)
        return width
      })
      .attr("height", (x: any, idx: number) => {
        // to compute density so that area under curve integrates to 1
        // density = x.length / total-no-counts * bin-width
        let height = x.length
        if(useDensity){
          height = x.length / (ys.length * (x.x1 - x.x0))
        }

        // let height = histscale(x)
        height = chartHeight - yScale(height)
        return height
      })
      .attr("fill", ({ value }: any) => {
        return "red"
      })
      .style("opacity", alpha)
      .on("mouseover", function (d: any) {
        d3.select(this).style("cursor", "pointer")
        dispatcher.call("customMouseOver", this, d);
      })
      .on("mousemove", function (d: any) {
        d3.select(this).style("cursor", "pointer")
        dispatcher.call("customMouseMove", this, d);
      })
      .on("mouseout", function (d: any) {
        dispatcher.call("customMouseOut", this, d);
      })
      .on("click", function (d: any) {
        dispatcher.call("customMouseClick", this, d);
      });

      // calculate and check == 1 
      // let sum: number = 0
      // for(let i = 0; i < density_check_array.length; i++) {
      //   let curr: number = (density_check_array[i] * diff_check_array[i])
      //   sum += curr
      // }

      // console.log('what is the sum now: ', sum)
  }

  let callable_obj: any = plot

  callable_obj.on = function (_x: any) {
    let value = dispatcher.on.apply(dispatcher, arguments);
    return value === dispatcher ? callable_obj : value;
  }

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

  callable_obj.extent = function() {
    let x_extent = d3.extent(obj.xs, (elem : any) =>  {
      return elem
    })

    let y_extent = d3.extent(obj.ys, (elem : any) => {
      return elem
    })

    return {
      x : x_extent,
      y : y_extent
    }
  }

  return callable_obj;
}
