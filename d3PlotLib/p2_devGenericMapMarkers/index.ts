// p2_devGenericMapMarkers/index.ts
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
    obj.plotID = `markers-${children.size()}`
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
    // let map = _container.map
    let svg = _container.svg
    // let pathCreator = getPathCreator(map)
    let data: any = obj.data
    let pathCreator = _container.projector

    const styling = {
      'stroke': 'brown',
      'stroke-width': '1px',
      'fill' : 'red'    
    }

    let mapGroup = svg.select(`.${obj.plotID}`)

    // console.log('draw data called in map pois: ', svg, mapGroup, data)

    // select all rect in svg.chart-group with the class bar
    let markers = mapGroup
      .selectAll(".boundary")
      .data(data)

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    markers.exit()
      .style("opacity", 0)
      .remove()

    // Enter - add the shapes to this data point
    let enterGroup = markers
      .enter()
      .append("path")
      .classed("boundary", true)

    // join the new data points with existing 
    markers = markers.merge(enterGroup)

    markers
      .attr("d", (d : any, i : number, n : any) => {
          return d3.symbol().type(d3.symbolSquare).size(45)();
      })
      .attr("transform", function(d : any, i : number, n : any) {
        let latlng = [+d.long, +d.lat]
        let proj = pathCreator.projection()
        let res = proj(latlng)
        return `translate(${res[0]}, ${res[1]})`
      })
      .styles(styling)
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

  return plot;
}
