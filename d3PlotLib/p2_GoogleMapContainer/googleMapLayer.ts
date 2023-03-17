/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3'
import { plotAttrs } from '../MapAttribs'

const publicAttributes = {
  ...plotAttrs,
}

export default function () {
  const obj: any = JSON.parse(JSON.stringify(publicAttributes))
  let container: any = null

  // Building Blocks
  function buildContainerGroups() {
    const { svg } = container

    console.log('what is container: ', container)

    const chartGroup = svg.select('g.map-group-google')
    const children = chartGroup.selectAll(function () {
      return this.childNodes
    })

    const existingElements = children.filter(`g.${obj.plotID}`)
    if (existingElements.size() > 0) {
      return
    }

    obj.index = children.size()
    obj.plotID = `layer-${children.size()}`
    chartGroup.append('g').classed(`${obj.plotID}`, true)
  }

  function getPathCreator(map: any, overlay: any) {
    // Use Googles projection for drawing svg path
    const projectPoint = function (x: number, y: number) {
      const overlayProjection = overlay.getProjection()
      const sw = overlay.bounds.getSouthWest()
      const ne = overlay.bounds.getNorthEast()

      console.log('sw and ne: ', sw, ne)
      
      const olLatlong = new google.maps.LatLng(y, x)
      const olPoint = overlayProjection.fromLatLngToDivPixel(olLatlong)

      const projection = map.getProjection()
      const latlong = new google.maps.LatLng(y, x)
      const point = projection.fromLatLngToPoint(latlong)

      console.log('what is ol point vs point: ', olPoint, point)

      //   this.stream.point(point.x, point.y)
      this.stream.point(olPoint.x, olPoint.y)
    }

    // Use d3's custom geo transform method to implement the above
    const projection = d3.geoTransform({ point: projectPoint })
    const pathCreator = d3.geoPath().projection(projection)

    return pathCreator
  }

  function drawData() {
    const { map, overlay } = container
    const { svg } = container
    const pathCreator = getPathCreator(map, overlay)
    const { geojson } = obj
    const zoomLevel: number = map.getZoom()

    const styling = 'stroke: Orange; stroke-width: 1px; fill-opacity: .3; fill: green;'

    const mapGroup = svg.select(`.${obj.plotID}`)

    // console.log('draw data called: ', svg, mapGroup, geojson)

    // select all rect in svg.chart-group with the class bar
    let boundaries = mapGroup.selectAll('.boundary').data(geojson.features)

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    boundaries.exit().style('opacity', 0).remove()

    // Enter - add the shapes to this data point
    const enterGroup = boundaries.enter().append('path').classed('boundary', true)

    // join the new data points with existing
    boundaries = boundaries.merge(enterGroup)

    boundaries
      .attr('d', (features: any) => {
        const param = features
        const result = pathCreator(param)
        return result
      })
      .attr('style', (elem: any) => {
        if (obj.onStyle) {
          return obj.onStyle({ elem, zoomLevel })
        }
        return styling
      })
  }

  function plot(_container: any) {
    container = _container
    buildContainerGroups()
    drawData()
  }

  const chart: any = plot

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
  plot.attr = function () {
    return obj
  }

  plot.onStyle = function (_x: any) {
    if (arguments.length) {
      obj.onStyle = _x
      return plot
    }
    return obj.onStyle
  }

  return plot
}
