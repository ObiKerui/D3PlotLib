/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3'
// import * as d3Dispatch from 'd3-dispatch'
import { plotAttrs, containerAttrs } from '../MapAttribs'

const publicAttributes = {
  ...containerAttrs,
  ...plotAttrs,
}

export default function () {
  const obj: any = JSON.parse(JSON.stringify(publicAttributes))
  const plots: any = []

  // Dispatcher object to broadcast the mouse events
  // const dispatcher = d3Dispatch.dispatch(
  //   'customMouseOver',
  //   'customMouseMove',
  //   'customMouseOut',
  //   'customMouseClick'
  // )

  function buildContainerGroups(svg: any) {
    const marginLeft = obj.margin.left
    const marginTop = obj.margin.top

    const container = svg
      .append('g')
      .classed('container-group', true)
      // .attr("transform", `translate(${obj.margin.left + obj.yAxisPaddingBetweenChart},${obj.margin.top})`)
      .attr('transform', `translate(${marginLeft},${marginTop})`)

    container.append('g').classed('map-group', true)
    container.append('g').classed('metadata-group', true)

    // console.log('P2_Container/index/buildcontainerGroups: built the container groups: ', container)
  }

  function buildSVG(container: any) {
    if (!obj.svg) {
      obj.svg = d3.select(container).append('svg').classed('devgenmap-container', true)

      // obj.svg.append("g").classed("map-group", true)
      buildContainerGroups(obj.svg)
    }
    obj.svg.attr('width', obj.width).attr('height', obj.height)
  }

  function buildProjector() {
    const projector = obj.projector == null ? null : obj.projector
    if (projector) projector(obj, plots)
  }

  function buildZoomer() {
    const zoomer = obj.zoomer == null ? null : obj.zoomer
    if (zoomer) zoomer(obj, plots)
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
  //           attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  //           maxZoom: 18,
  //           id: viewType,
  //           tileSize: 512,
  //           zoomOffset: -1,
  //           accessToken: accessToken
  //       }).addTo(obj.map);

  //       L.svg().addTo(obj.map);
  //     }
  //   }

  function toExport(htmlSelection: any) {
    obj.mapWidth = obj.width - obj.margin.left - obj.margin.right
    obj.mapHeight = obj.height - obj.margin.top - obj.margin.bottom

    buildSVG(htmlSelection.node())
    // buildSVG(html_selection)
    buildProjector()

    plots.forEach((plot: any) => {
      plot(obj)
    })

    if (obj.showMargins) {
      obj.svg.style('background-color', 'rgba(255, 0, 0, .2)')
    }

    buildZoomer()
  }

  const chart: any = toExport

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
  Object.keys(obj).forEach((attr: any) => {
    if (!chart[attr] && Object.prototype.hasOwnProperty.call(obj, attr)) {
      chart[attr] = generateAccessor(attr)
    }
  })

  // toExport.on = function (_x: any) {
  //   const value = dispatcher.on.apply(dispatcher, arguments)
  //   return value === dispatcher ? toExport : value
  // }

  toExport.attr = function () {
    return obj
  }

  toExport.plot = function (x: any) {
    if (Number.isInteger(x) && plots.length > 0) {
      return plots[x]
    }
    if (typeof x === 'string') {
      const labels = plots.filter((elem: any) => elem.tag() === x)
      if (labels.length > 0) {
        return labels[0]
      }
      return null
    }
    plots.push(x)
    return toExport
  }

  return toExport
}
