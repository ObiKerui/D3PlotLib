/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3'
import * as d3Geo from 'd3-geo'
// import * as d3Dispatch from 'd3-dispatch'
import * as L from 'leaflet'
import { plotAttrs } from '../MapAttribs'

const publicAttributes = {
  ...plotAttrs,
}

export default function () {
  const obj: any = JSON.parse(JSON.stringify(publicAttributes))
  let container: any = null

  // Dispatcher object to broadcast the mouse events
  // const dispatcher = d3Dispatch.dispatch(
  //   'customMouseOver',
  //   'customMouseMove',
  //   'customMouseOut',
  //   'customMouseClick'
  // )

  // Building Blocks
  function buildContainerGroups() {
    const { svg } = container

    const chartGroup = svg.select('g.map-group')
    const children = chartGroup.selectAll(function () {
      return this.childNodes
    })

    const existingElements = children.filter(`g.${obj.plotID}`)
    if (existingElements.size() > 0) {
      return
    }

    obj.index = children.size()
    obj.plotID = `markers-${children.size()}`
    chartGroup.append('g').classed(`${obj.plotID}`, true)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function getPathCreator(map: any) {
    // Use Leaflets projection API for drawing svg path (creates a stream of projected points)
    const projectPoint = function (x: number, y: number) {
      const point = map.latLngToLayerPoint(new L.LatLng(y, x))
      this.stream.point(point.x, point.y)
    }

    // Use d3's custom geo transform method to implement the above
    const projection = d3Geo.geoTransform({ point: projectPoint })
    const pathCreator = d3Geo.geoPath().projection(projection)

    return pathCreator
  }

  function drawData() {
    // let map = _container.map
    const { svg } = container
    // let pathCreator = getPathCreator(map)
    const { data } = obj
    const pathCreator = container.projector

    const styling = `
      stroke: brown;
      stroke-width: 1px;
      fill: red;
    `

    const mapGroup = svg.select(`.${obj.plotID}`)

    // console.log('draw data called in map pois: ', svg, mapGroup, data)

    // select all rect in svg.chart-group with the class bar
    let markers = mapGroup.selectAll('.boundary').data(data)

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    markers.exit().style('opacity', 0).remove()

    // Enter - add the shapes to this data point
    const enterGroup = markers.enter().append('path').classed('boundary', true)

    // join the new data points with existing
    markers = markers.merge(enterGroup)

    markers
      .attr('d', () => d3.symbol().type(d3.symbolSquare).size(45)())
      .attr('transform', (d: any) => {
        const latlng = [+d.long, +d.lat]
        const proj = pathCreator.projection()
        const res = proj(latlng)
        return `translate(${res[0]}, ${res[1]})`
      })
      .attr('style', styling)
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

  return plot
}
