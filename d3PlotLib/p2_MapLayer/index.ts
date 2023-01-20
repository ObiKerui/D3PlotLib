import * as d3 from 'd3'
import { dispatch } from 'd3-dispatch'
import * as L from 'leaflet'
import { plotAttrs } from '../MapAttribs'

const publicAttributes = {
  ...plotAttrs,
}

export default function () {
  const obj: any = JSON.parse(JSON.stringify(publicAttributes))
  let _container: any = null

  // Dispatcher object to broadcast the mouse events
  const dispatcher = dispatch(
    'customMouseOver',
    'customMouseMove',
    'customMouseOut',
    'customMouseClick'
  )

  function plot(container: any) {
    _container = container
    buildContainerGroups()
    drawData()
  }

  // Building Blocks
  function buildContainerGroups() {
    const { svg } = _container

    const chartGroup = svg.select('g.map-group')
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

  function getPathCreator(map: any) {
    // Use Leaflets projection API for drawing svg path (creates a stream of projected points)
    const projectPoint = function (x: number, y: number) {
      const point = map.latLngToLayerPoint(new L.LatLng(y, x))
      this.stream.point(point.x, point.y)
    }

    // Use d3's custom geo transform method to implement the above
    const projection = d3.geoTransform({ point: projectPoint })
    const pathCreator = d3.geoPath().projection(projection)

    return pathCreator
  }

  function drawData() {
    const { map } = _container
    const { svg } = _container
    const pathCreator = getPathCreator(map)
    const { geojson } = obj
    const zoomLevel: number = map.getZoom()

    const styling = {
      stroke: 'Orange',
      'stroke-width': '1px',
      'fill-opacity': '.3',
      fill: 'green',
    }

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
      .styles((elem: any) => {
        if (obj.onStyle) {
          return obj.onStyle({ elem, zoomLevel })
        }
        return styling
      })
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
  for (const attr in obj) {
    if (!chart[attr] && obj.hasOwnProperty(attr)) {
      chart[attr] = generateAccessor(attr)
    }
  }
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
