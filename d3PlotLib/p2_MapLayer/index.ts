// MapLayer/index.ts
"use strict";
import { plotAttrs } from '../MapAttribs';

declare const d3: any;
declare const moment: any;
declare const L: any;
declare const $: any;

const publicAttributes = {
  ...plotAttrs
}

export default function () {

  let obj: any = JSON.parse(JSON.stringify(publicAttributes))
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
    drawData()
  }

  // Building Blocks
  function buildContainerGroups() {
    let svg = _container.svg

    let chartGroup = svg.select("g.map-group")
    let children = chartGroup
      .selectAll(function () { return this.childNodes })

    let existingElements = children.filter(`g.${obj.plotID}`)
    if(existingElements.size() > 0) {
      return
    }

    obj.index = children.size()
    obj.plotID = `layer-${children.size()}`
    chartGroup.append("g").classed(`${obj.plotID}`, true)
  }

  function getPathCreator(map: any) {
    // Use Leaflets projection API for drawing svg path (creates a stream of projected points)
    const projectPoint = function(x : number, y : number) {
        const point = map.latLngToLayerPoint(new L.LatLng(y, x));
        this.stream.point(point.x, point.y);
    }

    // Use d3's custom geo transform method to implement the above
    const projection = d3.geoTransform({point: projectPoint});
    const pathCreator = d3.geoPath().projection(projection);
    
    return pathCreator;
  }

  function drawData() {
    let map = _container.map
    let svg = _container.svg
    let pathCreator = getPathCreator(map)
    let geojson: any = obj.geojson
    let zoomLevel: number = map.getZoom()

    const styling = {
      'stroke': 'Orange',
      'stroke-width': '1px',
      'fill-opacity': '.3',
      'fill' : 'green'    
    }

    let mapGroup = svg.select(`.${obj.plotID}`)

    // console.log('draw data called: ', svg, mapGroup, geojson)

    // select all rect in svg.chart-group with the class bar
    let boundaries = mapGroup
      .selectAll(".boundary")
      .data(geojson.features)

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    boundaries.exit()
      .style("opacity", 0)
      .remove()

    // Enter - add the shapes to this data point
    let enterGroup = boundaries
      .enter()
      .append("path")
      .classed("boundary", true)

    // join the new data points with existing 
    boundaries = boundaries.merge(enterGroup)

    boundaries
      .attr("d", (features : any) => {
          let param = features;
          let result = pathCreator(param);
          return result;
      })
      .styles((elem : any) => {
        if(obj.onStyle) {
          return obj.onStyle({ elem, zoomLevel })
        } else {
          return styling
        }
      })
  }

  let chart: any = plot

  function generateAccessor(attr: any) {
    function accessor(value: any) {
      if (!arguments.length) {
        return obj[attr]
      }
      obj[attr] = value

      return chart
    }
    return accessor
  }

  // generate the chart attributes
  for (let attr in obj) {
    if (!chart[attr] && obj.hasOwnProperty(attr)) {
      chart[attr] = generateAccessor(attr)
    }
  }
  plot.attr = function () {
    return obj
  }

  plot.onStyle = function(_x: any) {
    if(arguments.length) {
      obj.onStyle = _x
      return plot
    }
    return obj.onStyle
  }

  return plot;
}
