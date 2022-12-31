// BarChart/index.ts
"use strict";
import * as d3 from 'd3'
import { plotAttrs, barsAttrs } from '../ChartAttribs';
import * as scaler from '../p2_Scales';

const publicAttrs = {
  ...plotAttrs,
  ...barsAttrs
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

  function plot(container: unknown) {
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

  function drawData() {
    let ys = obj.ys
    let xs = obj.xs
    let xScale = _container.xScale
    let yScale = _container.yScale
    let chartHeight = _container.chartHeight
    let svg = _container.svg
    let alpha = obj.alpha

    // alpha is currently an array and somehow works 
    // probably could be modified so the array length = data array length 

    let chartGroup = svg.select(`.${obj.plotID}`)

    // select all rect in svg.chart-group with the class bar
    let bars = chartGroup
      .selectAll(".bar")
      .data(xs)

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
      .attr("x", (x: unknown) => {
        return xScale(x)
      })
      .attr("y", (x: unknown, idx: number) => {
        let yValue = yScale(ys[idx])
        return yValue
      })
      .attr("width", xScale.bandwidth())
      .attr("height", (x: unknown, idx: number) => {
        let height = (chartHeight - yScale(ys[idx]))
        return height
      })
      .attr("fill", ({ value }: any) => {
        return "red"
      })
      .style("opacity", alpha)
      .on("mouseover", function (d: unknown) {
        d3.select(this).style("cursor", "pointer")
        dispatcher.call("customMouseOver", this, d);
      })
      .on("mousemove", function (d: unknown) {
        d3.select(this).style("cursor", "pointer")
        dispatcher.call("customMouseMove", this, d);
      })
      .on("mouseout", function (d: unknown) {
        dispatcher.call("customMouseOut", this, d);
      })
      .on("click", function (d: unknown) {
        dispatcher.call("customMouseClick", this, d);
      });
  }

  let callable_obj: any = plot

  callable_obj.on = function (_x: unknown) {
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
    function accessor(value: unknown) {
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
