// p2_Boxplot/index.ts
"use strict";
import { plotAttrs } from '../ChartAttribs';

declare const d3: any;

const colorScheme = ['red', 'green', 'blue', 'grey']

type boxplotdata = {
  q1: number;
  median: number;
  q3: number;
  interQuantileRange: number;
  min: number;
  max: number
}

export default function () {

  let obj: any = JSON.parse(JSON.stringify(plotAttrs))
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
    // prepareData()
    drawData()
    drawPoints()
  }

  function buildContainerGroups() {
    let svg = _container.svg

    let chartGroup = svg.select("g.chart-group")
    let children = chartGroup
      .selectAll(function () { return this.childNodes })

    let existingElements = children.filter(`g.${obj.plotID}`)
    if(existingElements.size() > 0) {
      return
    }

    obj.index = children.size()
    obj.plotID = `plot-${obj.index}`
    chartGroup.append("g").classed(`${obj.plotID}`, true);

    // console.log('p2_Plot : obj/chart-group/children : ', obj, chartGroup, children)

    // set the colour etc
    let index = (obj.index % colorScheme.length)
    obj.colours = colorScheme
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

  // function preprocessData(ys: any[]) {

  //   // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
  //   let sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
  //       .key(function(d: any) { 
  //           return d.Species
  //       })
  //       .rollup(function(d: any) {
  //           let q1 = d3.quantile(d.map(function(g: any) { 
  //               return g.Sepal_Length;
  //           }).sort(d3.ascending),.25)

  //           let median = d3.quantile(d.map(function(g: any) { 
  //               return g.Sepal_Length;
  //           }).sort(d3.ascending),.5)

  //           let q3 = d3.quantile(d.map(function(g: any) { 
  //               return g.Sepal_Length;
  //           }).sort(d3.ascending),.75)

  //           let interQuantileRange = q3 - q1
  //           let min = q1 - 1.5 * interQuantileRange
  //           let max = q3 + 1.5 * interQuantileRange

  //           return({
  //               q1: q1, 
  //               median: median, 
  //               q3: q3, 
  //               interQuantileRange: interQuantileRange, 
  //               min: min, 
  //               max: max
  //           })
  //       })
  //       .entries(ys)    

  //   return sumstat
  // }

  function preprocessData(ys: number[][]): boxplotdata[] {

    let result: boxplotdata[] = ys.map((d: number[]) => {
      let sorted = d.sort(d3.ascending)
      let q1 = d3.quantile(sorted, .25)
      let median = d3.quantile(sorted, .5)
      let q3 = d3.quantile(sorted, .75)
      let interQuantileRange = q3 - q1
      let min = q1 - 1.5 * interQuantileRange
      let max = q3 + 1.5 * interQuantileRange

      return({
          q1: q1, 
          median: median, 
          q3: q3, 
          interQuantileRange: interQuantileRange, 
          min: min, 
          max: max
      })
    })
    return result
  }

  function drawData() {
    let ys: number[][] = obj.ys
    let labels: string[] = obj.labels

    let xScale = _container.xScale
    let yScale = _container.yScale

    let svg = _container.svg
    let chartGroup = svg.select(`.${obj.plotID}`)

    // preprocess the data
    let sumstat: boxplotdata[] = preprocessData(ys)

    // Show the main vertical line
    let vertLines = chartGroup
    .selectAll("vertLines")
    .data(sumstat)

    vertLines
    .exit()
    .remove()

    let enterLines = vertLines
    .enter()
    .filter((d: any) => {
      let filterthis = Number.isNaN(d.min) === false
      return filterthis
    })
    .append("line")

    vertLines = vertLines.merge(enterLines)

    vertLines
    .attr("x1", function(d: any, ith: number) {
        return(xScale(labels[ith]))
    })
    .attr("x2", function(d: any, ith: number) {
        return(xScale(labels[ith]))
    })
    .attr("y1", function(d: any){
      return(yScale(d.min))
    })
    .attr("y2", function(d: any){
      return(yScale(d.max))
    })
    .attr("stroke", "black")
    .style("width", 40)

    // rectangle for the main box
    let boxWidth = 100
    let boxes = chartGroup
    .selectAll("boxes")
    .data(sumstat)

    boxes
    .exit()
    .remove()

    let enterBoxes = boxes
    .enter()
    .filter((d: any) => {
      let filterthis = Number.isNaN(d.min) === false
      // console.log('what to filter? ', d, filterthis)
      return filterthis
    })
    .append("rect")

    boxes = enterBoxes.merge(enterBoxes)

    boxes
    .attr("x", function(d: any, ith: number) { 
        return(xScale(labels[ith]) - boxWidth / 2 )
    })
    .attr("y", function(d: any){
      return(yScale(d.q3))
    })
    .attr("height", function(d: any){
      return(yScale(d.q1) - yScale(d.q3))
    })
    .attr("width", boxWidth )
    .attr("stroke", "black")
    .style("fill", "#69b3a2")

    // Show the median
    let medianLines = chartGroup
    .selectAll("medianLines")
    .data(sumstat)

    medianLines.exit().remove()

    let enterMedians = medianLines
    .enter()
    .filter((d: any) => {
      let filterthis = Number.isNaN(d.min) === false
      return filterthis
    })
    .append("line")

    medianLines = medianLines.merge(enterMedians)

    medianLines  
    .attr("x1", function(d: any, ith: number){
      return(xScale(labels[ith]) - boxWidth / 2 ) 
    })
    .attr("x2", function(d: any, ith: number){
      return(xScale(labels[ith]) + boxWidth / 2) 
    })
    .attr("y1", function(d: any){
      return(yScale(d.median))
    })
    .attr("y2", function(d: any){
      return(yScale(d.median))
    })
    .attr("stroke", "black")
    .style("width", 80)
  }

  function drawPoints() {

    let ys = obj.ys
    let labels = obj.labels

    let xScale = _container.xScale
    let yScale = _container.yScale

    let svg = _container.svg
    let chartGroup = svg.select(`.${obj.plotID}`)

    // Add individual points with jitter
    let jitterWidth = 50

    let indPoints = chartGroup
    .selectAll("indPoints")
    .data(ys)

    indPoints.exit().remove()

    let enterIndPoints = indPoints
    .enter()
    .filter((d: any) => {
      let filterthis = Number.isNaN(d.min) === false
      return filterthis
    })
    .append("g")

    indPoints = indPoints.merge(enterIndPoints)

    indPoints
    .attr("transform", (d: any, ith: number) => {
      let xPos = xScale(labels[ith])
      return `translate(${xPos},0)`
    })

    let indPointsInner = indPoints
    .selectAll("circle")
    .data((d: any) => {
      return d
    })

    indPointsInner.exit().remove()

    let enterIndPointsInner = indPointsInner
    .enter()
    .append("circle")

    indPointsInner = indPointsInner.merge(enterIndPointsInner)

    indPointsInner
    .attr("cx", function(d: any, ith: number) {
      return(-jitterWidth / 2 + Math.random() * jitterWidth)
    })
    .attr("cy", function(d: any){
      return(yScale(d))
    })
    .attr("opacity", 0.2)
    .attr("r", 4)
    .style("fill", "white")
    .attr("stroke", "black")

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
    // console.log('obj xs and ys: ', obj.xs, obj.ys)
    
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
