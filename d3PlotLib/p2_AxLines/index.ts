// AxLines/index.ts
"use strict";
import { lineAttrs } from '../ChartAttribs';

declare const d3: any;
declare const moment: any;
declare const L: any;
declare const $: any;

const colorScheme = ['red', 'green', 'blue', 'grey']

export default function () {

  let obj: any = JSON.parse(JSON.stringify(lineAttrs))
  let _container: any = null

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
    prepareData()
    drawData()
  }

  function buildContainerGroups() {
    let svg = _container.svg

    let chartGroup = svg.select("g.chart-group")
    let children = chartGroup
      .selectAll(function () { return this.childNodes })

    let existingElements = children.filter(`g.${obj.lineID}`)
    if(existingElements.size() > 0) {
      return
    }
  
    obj.index = children.size()
    obj.lineID = `line-${obj.index}`

    chartGroup.append("g").classed(`${obj.lineID}`, true);

    // console.log('p2_Plot : obj/chart-group/children : ', obj, chartGroup, children)

    // set the colour etc
    let index = (obj.index % colorScheme.length)
    obj.colour = colorScheme[index]
  }

  function prepareData() {
    // check ys for 2d array
    obj.ys = Array.isArray(obj.ys[0]) ? obj.ys : [obj.ys]

    // check labels 
    obj.labels = Array.isArray(obj.labels) ? obj.labels : [obj.labels]

    // check colours
    obj.colours = Array.isArray(obj.colours) ? obj.colours : [obj.colours]

    // check styles
    obj.styles = Array.isArray(obj.styles) ? obj.styles : [obj.styles]

    // check alphas
    obj.alpha = Array.isArray(obj.alpha) ? obj.alpha : [obj.alpha]

  }

  function drawData() {
    let ys = obj.ys
    let xs = obj.xs
    let strokeColour = obj.colour
    let xScale = _container.xScale
    let yScale = _container.yScale
    let alpha = obj.alpha
    let style = obj.style
    let lineEffect = ""
    let svg = _container.svg

    // set the line style
    if(style == "--") {
        lineEffect = "stroke-dasharray"
    }

    // get start / end y value
    let yStart = yScale.domain()[0]
    let yEnd = yScale.domain()[1]
    let xPoints = [xs, xs]
    let yPoints = [yStart, yEnd]

    // console.log('show yStart / yEnd / xs / ys / xPoints / ypoints: ', yStart, yEnd, xs, ys, xPoints, yPoints)

    let chartGroup = svg.select(`.${obj.lineID}`)

    // select all rect in svg.chart-group with the class bar
    let lines = chartGroup
      .selectAll(".lines")
      .data([xPoints])

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    lines.exit()
      .style("opacity", 0)
      .remove();

    // Enter - add the shapes to this data point
    let enterGroup = lines
      .enter()
      .append("path")
      .classed("lines", true)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)

    // join the new data points with existing 
    lines = lines.merge(enterGroup)

    // now position and colour what exists on the dom
    lines.attr("d", d3.line()
      .x(function (d: any, i: any) {
        return xScale(d)
      })
      .y(function (d: any, ith: number) {
        return yScale(yPoints[ith])
      }))
      .attr("stroke", strokeColour)
      .style("opacity", alpha)
      .style(lineEffect, ("3, 3"))
      .on("mouseover", function (d: any) {
        d3.select(this).style("cursor", "pointer")
        dispatcher.call("customMouseOver", this, d);
      })
      .on("mousemove", function (d: any) {
        dispatcher.call("customMouseMove", this, d);
      })
      .on("mouseout", function (d: any) {
        dispatcher.call("customMouseOut", this, d);
      })
      .on("click", function (d: any) {
        dispatcher.call("customMouseClick", this, d);
      });
  }

  let callable_obj: any = plot

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

  callable_obj.on = function (_x: any) {
    let value = dispatcher.on.apply(dispatcher, arguments);
    return value === dispatcher ? callable_obj : value;
  }

  callable_obj.attr = function () {
    return obj
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

  // // TODO needs to be more well thought out
  // callable_obj.x = function() {
  //   return d3.extent(obj.xs, (elem : any) =>  {
  //     return elem
  //   })
  // } 

  // // TODO needs to be more well thought out
  // callable_obj.y = function() {
  //   return d3.extent(obj.ys, (elem : any) => {
  //     return elem
  //   })
  // }

  return callable_obj;
}