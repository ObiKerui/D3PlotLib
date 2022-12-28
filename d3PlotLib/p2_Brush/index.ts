// p2_Brush/index.ts
'use strict'
import React from 'react';
import { plotAttrs } from '../ChartAttribs';

declare const d3: any
declare const moment: any
declare const L: any
declare const $: any

export default function () {

  let obj: any = JSON.parse(JSON.stringify(plotAttrs))
  let _container: any = null
    let zoomDetails: any = null

    //initialize throttlePause variable outside throttle function
    let throttlePause: boolean;
 
    const throttle = (callback: any, time: number) => {
        if (throttlePause) return;
    
        //set throttlePause to true after the if condition. This allows the function to be run once
        throttlePause = true;
    
        //setTimeout runs the callback within the specified time
        setTimeout(() => {
            callback()
            
            //throttlePause is set to false once the function has been called, allowing the throttle function to loop
            throttlePause = false
        }, time)
    }  

    function plot(container: any) {
      _container = container
      buildContainerGroups()
      drawData()
    }
  
    function buildContainerGroups() {
      let svg = _container.svg

      let metadataGroup = svg.select("g.metadata-group")
      let children = metadataGroup.selectAll(function() { 
        return this.childNodes 
      })
  
      let existingElement = children.filter(`g.${obj.legendID}`)
      if(existingElement.size()) {
        return
      }
      
      obj.index = children.size()
      obj.legendID = `brush-${obj.index}`
  
      let legend_id = metadataGroup.append("g").classed(`${obj.legendID}`, true)
      let legend_id_ap = legend_id.append("g").classed("anchorpoint", true)
      legend_id_ap.append("rect").classed("background", true)
      legend_id_ap.append("g").classed("innermargin", true)            
    }

    function drawData() {
      let svg = _container.svg
      let metadataGroup = svg.select(`.${obj.legendID}`)
      let anchorPoint = metadataGroup.select("g.anchorpoint")    
      let rectBackground = anchorPoint.select("rect.background")
      let innerMargin = anchorPoint.select("g.innermargin")

      // let position = obj.position ?? "topleft"
      let chartHeight = _container.chartHeight
      let xScale = _container.xScale
      let onChange = obj.onChange

      let margin = 0
  
      let isInsideBrush = false
      let isMouseDown = false
      let xDragOffset = 0
  
      innerMargin.attr("transform", `translate(${margin},${margin})`)
  
      // width and height need to be set better - should focus on an area of data
      rectBackground
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 100)
      .attr("height", chartHeight)
      .style("fill", "white")
      .style("stroke", "blue")
      .style("opacity", 0.45)
      .on('mousemove', function(d: any, i: number, node: any) {
        let rect = d3.select(node[i])
        rect.style('cursor', 'grab')

        if(isMouseDown && isInsideBrush) {

          const mousePosition = d3.mouse(node[i])
          const posOnChartX = xScale.invert(mousePosition[0])
          const x = xScale.invert(rect.attr("x"))
          const rectX = +(rect.attr("x"))
          const rectWidth = +(rect.attr("width"))

          let newXvalue = xScale(posOnChartX) - xDragOffset

          // get min/max domain bounds 
          let minX = xScale.domain()[0]
          let maxX = xScale.domain()[1]

          // check for values outside bounds of domain
          let lessThanXLimit = newXvalue < xScale(minX)
          let greaterThanXLimit = +(newXvalue + rectWidth) > xScale(maxX)

          // correct if necessary
          newXvalue = lessThanXLimit ? rectX : newXvalue
          newXvalue = greaterThanXLimit ? rectX : newXvalue

          // set the rect x attr
          rect.attr("x", newXvalue)

          if(!lessThanXLimit && !greaterThanXLimit) {
            let minDomain = xScale.invert(newXvalue)
            let rectWidth = +(rect.attr("width"))
            let maxDomain = xScale.invert(newXvalue + rectWidth)
            let newDomain = [minDomain, maxDomain]
            let newScaleX = xScale.copy()
            newScaleX.domain(newDomain)
            onChange(newScaleX)
          }
        }
      })
      .on('mouseenter', function(d: any, i: number, node: any) {
        isInsideBrush = true
      })
      .on('mouseleave', function(d: any, i: number, node: any) {
        isInsideBrush = false
        isMouseDown = false
      })
      .on('mousedown', function(d: any, i: number, node: any) {
        isMouseDown = true
        let rect = d3.select(node[i])
        let xPos = rect.attr("x")
        let mousePosition = d3.mouse(node[i])
        let xPosOnChart = xScale.invert(mousePosition[0])
        
        xDragOffset = Math.abs(xPos - xScale(xPosOnChart))

      })
      .on('mouseup', function(d: any, i: number, node: any) {
        isMouseDown = false
      })

      let minDomain = xScale.invert(0)
      let rectWidth = +(rectBackground.attr("width"))
      let maxDomain = xScale.invert(0 + rectWidth)
      let newDomain = [minDomain, maxDomain]
      let newScaleX = xScale.copy()
      newScaleX.domain(newDomain)
      onChange(newScaleX)
}

  let callableObj: any = plot

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

  callableObj.onChange = function(_x: any) {
    if(arguments.length) {
      obj.onChange = _x
      return callableObj
    }
    return obj.onChange
  }

  return callableObj
}
