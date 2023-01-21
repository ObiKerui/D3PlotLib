/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3Geo from 'd3-geo'
// import * as d3Dispatch from 'd3-dispatch'
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
    obj.plotID = `layer-${children.size()}`
    chartGroup.append('g').classed(`${obj.plotID}`, true)
  }

  //   function getPathCreator(map: any) {
  //     // Use Leaflets projection API for drawing svg path (creates a stream of projected points)
  //     const projectPoint = function(x : number, y : number) {
  //         const point = map.latLngToLayerPoint(new L.LatLng(y, x));
  //         this.stream.point(point.x, point.y);
  //     }

  //     // Use d3's custom geo transform method to implement the above
  //     const projection = d3.geoTransform({point: projectPoint});
  //     const pathCreator = d3.geoPath().projection(projection);

  //     return pathCreator;
  //   }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function getPathCreator(states: any) {
    // how it's done in the book example...
    const projection = d3Geo.geoMercator()
    const pathCreator = d3Geo.geoPath().projection(projection)
    const width = container.mapWidth
    const height = container.mapHeight

    // Setup the scale and translate
    projection.scale(1).translate([0, 0])
    const geographicBounds = pathCreator.bounds(states)

    const leftBottom = geographicBounds[0]
    const minLongitude = leftBottom[0]
    const minLatitude = leftBottom[1]

    const rightTop = geographicBounds[1]
    const maxLongitude = rightTop[0]
    const maxLatitude = rightTop[1]

    const scaledWidth = (maxLongitude - minLongitude) / width
    const scaledHeight = (maxLatitude - minLatitude) / height
    const scaler = 1.0 / Math.max(scaledWidth, scaledHeight)

    let widthScale = scaler * (maxLongitude + minLongitude)
    widthScale = (width - widthScale) / 2.0

    let heightScale = scaler * (maxLatitude + minLatitude)
    heightScale = (height - heightScale) / 2.0

    // TODO Need to understand why this doesn't work but above does work!
    // const halfWidth = (maxLongitude - minLongitude) / 2
    // const halfHeight = (maxLatitude - minLatitude) / 2
    // const scaledHalfWidth = scaler * halfWidth
    // const scaledHalfHeight = scaler * halfHeight
    // const subWidth = width - scaledHalfWidth
    // const subHeight = height - scaledHalfHeight

    // console.log('scaled hw versus width scale: ', scaledHalfWidth, widthScale)
    // console.log('translate width a b ', widthScale, subWidth)
    // console.log('add and sub bounds long + - ', (maxLongitude + minLongitude), (maxLongitude - minLongitude))
    // console.log('translate height a b ', heightScale, subHeight)

    // const translator = [widthScale, heightScale]
    // const translator = [subWidth, subHeight]
    // var translator = [(width - scaler * (geographicBounds[1][0] + geographicBounds[0][0])) / 2, (height - scaler * (geographicBounds[1][1] + geographicBounds[0][1])) / 2];

    projection.scale(scaler).translate([widthScale, heightScale])

    return pathCreator
  }

  function drawData() {
    const { svg } = container
    const { geojson } = obj
    // let zoomLevel: number = _container.getZoom()

    // let pathCreator = getPathCreator(geojson)
    const pathCreator = container.projector

    const styling = `
      stroke: Brown;
      stroke-opacity: .2;
      stroke-width: 1px;
      fill-opacity: .1;
      fill: green
    `

    const mapGroup = svg.select(`.${obj.plotID}`)

    // function handleZoom(a: any, b: any, e: any) {
    //   mapGroup.attr('transform', d3.event.transform)
    // }

    // let zoom = d3.zoom().on('zoom', handleZoom)
    // console.log('what is map group here: ', mapGroup)
    // mapGroup.call(zoom)

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
          return obj.onStyle({ elem })
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

  plot.feature = function (_x: any) {
    if (arguments.length) {
      obj.feature = _x
      return plot
    }
    return obj.feature
  }

  return plot
}
