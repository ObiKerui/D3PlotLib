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

    obj.mapWidth = obj.width - obj.margin.left - obj.margin.right;
    obj.mapHeight = obj.height - obj.margin.top - obj.margin.bottom;

    buildSVG(html_selection.node())
    // buildSVG(html_selection)    
    buildProjector()

    // obj.map.on('zoomend', () => {
    //   plots.forEach((plot: any) => {
    //     plot(obj)
    //   })
    // })  

    plots.forEach((plot: any) => {
      plot(obj)
    })

    if (obj.showMargins) {
      obj.svg.style("background-color", "rgba(255, 0, 0, .2)")
    }

    buildZoomer()
  }

  function buildContainerGroups(svg: any) {
    let marginLeft = obj.margin.left
    let marginTop = obj.margin.top

    let container = svg
      .append("g")
      .classed("container-group", true)
      // .attr("transform", `translate(${obj.margin.left + obj.yAxisPaddingBetweenChart},${obj.margin.top})`)
      .attr("transform", `translate(${marginLeft},${marginTop})`)

    container.append("g").classed("map-group", true);
    container.append("g").classed("metadata-group", true);

    // console.log('P2_Container/index/buildcontainerGroups: built the container groups: ', container)

  }

  function buildSVG(container: any) {
    if (!obj.svg) {
      obj.svg = d3
        .select(container)
        .append("svg")
        .classed("devgenmap-container", true)

      // obj.svg.append("g").classed("map-group", true)  
      buildContainerGroups(obj.svg)
    }
    obj.svg.attr("width", obj.width).attr("height", obj.height);      
  }

  function buildProjector() {
    let projector = obj.projector == null ? null : obj.projector
    if(projector) projector(obj, plots)
  }

  function buildZoomer() {
    let zoomer = obj.zoomer == null ? null : obj.zoomer
    if(zoomer) zoomer(obj, plots)
  }

//   function buildMap(html_selection: any) {
//     let viewType = obj.viewType
//     let mapCompDiv = html_selection
//     let accessToken = obj.accessToken
//     let zoom = obj.zoom
//     let position = obj.position

//     if(!obj.map) {
//       obj.map = L.map(mapCompDiv.node()).setView(position, zoom);
//       L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${accessToken}`, {
//           attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery ?? <a href="https://www.mapbox.com/">Mapbox</a>',
//           maxZoom: 18,
//           id: viewType,
//           tileSize: 512,
//           zoomOffset: -1,
//           accessToken: accessToken
//       }).addTo(obj.map);  
          
//       L.svg().addTo(obj.map);
//     }
//   }

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
