// GroupedBarChart/index.ts
"use strict";
import { plotAttrs, barsAttrs } from '../ChartAttribs';
import * as scaler from '../p2_Scales';

declare const d3: any;
declare const moment: any;
declare const L: any;
declare const $: any;

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

  function drawData() {
    let ys = obj.ys
    let xs = obj.xs
    let xScale = _container.xScale
    let yScale = _container.yScale
    let chartHeight = _container.chartHeight
    let svg = _container.svg
    let subgroups: any[] = ['Nitrogen', 'normal', 'stress']

    let chartGroup = svg.select(`.${obj.plotID}`)

    let xScaleSubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, xScale.bandwidth()])
    .padding([0.05])    

    // color palette = one color per subgroup
    let color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#e41a1c','#377eb8','#4daf4a'])

    // Show the bars
    let outerBars = chartGroup
    .selectAll("g")
    .data(ys)

    let enterOuterBars = outerBars.enter()
    .append("g")

    outerBars.exit().remove()

    outerBars = outerBars.merge(enterOuterBars)

    outerBars
    .attr("transform", function(d:any) { 
        return `translate(${xScale(d.group)},0)` 
    })

    let innerBars = outerBars
    .selectAll("rect")
    .data(function(d: any) { 
        let toRet = subgroups.map(function(key) { 
            return { 
                key: key, value: d[key]
            }; 
        }); 
        return toRet
    })

    let innerBarsEnter = innerBars
    .enter()
    .append("rect")

    innerBars = innerBars.merge(innerBarsEnter)

    innerBars.
    attr("x", function(d:any) { 
        return xScaleSubgroup(d.key); 
    })
    .attr("y", function(d:any) { 
        return yScale(d.value); 
    })
    .attr("width", xScaleSubgroup.bandwidth())
    .attr("height", function(d: any) { 
        return chartHeight - yScale(d.value); 
    })
    .attr("fill", function(d:any) { 
        // return 'red'
        return color(d.key); 
    })    
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
