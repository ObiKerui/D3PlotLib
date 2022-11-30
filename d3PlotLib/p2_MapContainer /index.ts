// MapContainer/index.ts
"use strict";
import { plotAttrs, containerAttrs } from '../MapAttribs';

declare const d3: any;
declare const moment: any;
declare const L: any;
declare const $: any;

const publicAttributes = {
  ...containerAttrs,
  ...plotAttrs
}

export default function () {

  let obj: any = JSON.parse(JSON.stringify(publicAttributes))
  let plots: any = []

  // Dispatcher object to broadcast the mouse events
  const dispatcher = d3.dispatch(
    "customMouseOver",
    "customMouseMove",
    "customMouseOut",
    "customMouseClick"
  );

  function toExport(html_selection: any) {
    if (obj.showMargins) {
      obj.svg.style("background-color", "rgba(255, 0, 0, .2)")
    }

    obj.chartWidth = obj.width - obj.margin.left - obj.margin.right;
    obj.chartHeight = obj.height - obj.margin.top - obj.margin.bottom;

    buildMap(html_selection)
    buildSVG(html_selection)

    obj.map.on('zoomend', () => {
      plots.forEach((plot: any) => {
        plot(obj)
      })
    })  

    plots.forEach((plot: any) => {
      plot(obj)
    })
  }

  function buildSVG(container: any) {

    let div = null
    let map = obj.map

    if (!obj.svg) {
      div = container.append("div")
        .classed("custom-map-element", true)
        .style("height", obj.height)
        .style("width", obj.width)

      const overlay = d3.select(map.getPanes().overlayPane)
      obj.svg = overlay.select('svg');
      obj.svg
      .append("g")     
      .classed("map-group", true)

    }
  }

  function buildMap(html_selection: any) {
    let viewType = obj.viewType
    let mapCompDiv = html_selection
    let accessToken = obj.accessToken
    let zoom = obj.zoom
    let position = obj.position

    if(!obj.map) {
      obj.map = L.map(mapCompDiv.node()).setView(position, zoom);
      // obj.map = L.map(mapCompDiv).setView(position, zoom);      
      L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${accessToken}`, {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: viewType,
          tileSize: 512,
          zoomOffset: -1,
          accessToken: accessToken
      }).addTo(obj.map);  
          
      L.svg().addTo(obj.map);
    }
  }

  let chart: any = toExport

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

  toExport.on = function (_x: any) {
    let value = dispatcher.on.apply(dispatcher, arguments);
    return value === dispatcher ? toExport : value;
  }

  toExport.attr = function () {
    return obj
  }

  toExport.plot = function (_x: any) {
    if(Number.isInteger(_x) && plots.length > 0) {
      return plots[_x]
    } else if(typeof _x == 'string') {
      let labels = plots.filter((elem : any) => {
        return elem.tag() === _x
      })
      if (labels.length > 0) {
        return labels[0]
      } 
      return null
    }
    plots.push(_x)
    return toExport
  }

  return toExport;
}
