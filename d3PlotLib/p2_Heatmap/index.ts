// p2_Heatmap/index.ts
"use strict";
import { plotAttrs } from '../ChartAttribs';

declare const d3: any;
declare const moment: any;
declare const L: any;
declare const $: any;

const colorScheme = ['red', 'green', 'blue', 'grey']

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

  function drawData() {

    let ys = obj.ys
    let xs = obj.xs

    let index = obj.index
    let strokeColours = obj.colours
    let xScale = _container.xScale
    let yScale = _container.yScale

    let cellSize = 20

    // console.log('plot draw : obj / xs / ys / test xscale / test yscale ', obj, xs, ys, xScale(xs[0]), yScale(ys[0]))

    let alpha = obj.alpha
    let styles : [] = obj.styles
    let lineEffect = ""
    let curveType = obj.curve ?? d3.curveLinear
    let itemSize = 10
      
    let colorScale = d3.scaleThreshold()
        .domain([0.85, 1])
        .range(["#2980B9", "#E67E22", "#27AE60", "#27AE60"]);    

    let svg = _container.svg

    let chartGroup = svg.select(`.${obj.plotID}`)

    // console.log('what is data for heatmap: ', ys.length)

    let cells = chartGroup
    .selectAll("g")
    .data(ys)

    let enterCells = cells
    .enter()
    .append('g')
    .append('rect')

    cells.exit().remove()

    cells = cells.merge(enterCells)

    cells
    .attr('class', 'cell')
    .attr('width', xScale.bandwidth())
    .attr('height', yScale.bandwidth())
    .attr('y', function(d:any) { 
      // console.log('what is y data for hm: ', d)
      return yScale(d.country); 
    })
    .attr('x', function(d:any) { 
      // console.log('what is x data for hm: ', d)      
      return xScale(d.product); 
    })
    .attr('fill', function(d:any) { 
      return colorScale(d.value); 
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
