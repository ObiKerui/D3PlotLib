/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3'
import * as d3Geo from 'd3-geo'
// import * as d3Dispatch from 'd3-dispatch'

export default function () {
  const obj: any = {}

  function getPathCreator(geojson: any, mapWidth: number, mapHeight: number) {
    // how it's done in the book example...
    const { projection } = obj
    const pathCreator = d3.geoPath().projection(projection)

    // Setup the scale and translate
    projection.scale(1).translate([0, 0])
    const geographicBounds = pathCreator.bounds(geojson)

    const leftBottom = geographicBounds[0]
    const minLongitude = leftBottom[0]
    const minLatitude = leftBottom[1]

    const rightTop = geographicBounds[1]
    const maxLongitude = rightTop[0]
    const maxLatitude = rightTop[1]

    const scaledWidth = Math.abs(maxLongitude - minLongitude) / mapWidth
    const scaledHeight = Math.abs(maxLatitude - minLatitude) / mapHeight

    const scaler = 1.0 / Math.max(scaledWidth, scaledHeight)

    let widthScale = scaler * (maxLongitude + minLongitude)
    widthScale = (mapWidth - widthScale) / 2.0

    let heightScale = scaler * (maxLatitude + minLatitude)
    heightScale = (mapHeight - heightScale) / 2.0

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

    const translator = [widthScale, heightScale]
    // const translator = [subWidth, subHeight]
    // var translator = [(width - scaler * (geographicBounds[1][0] + geographicBounds[0][0])) / 2, (height - scaler * (geographicBounds[1][1] + geographicBounds[0][1])) / 2];

    projection.scale(scaler).translate(translator)

    return pathCreator
  }

  function toExport(containerAttrs: any, plottables: any) {
    let geojsonList: any = []
    const { mapWidth } = containerAttrs
    const { mapHeight } = containerAttrs

    // create a 2d array - each entry is an array of the y values
    // would not have to do this if plottable provides ys already in 2d array format...
    plottables.forEach((plottable: any) => {
      const geojson = plottable.geojson()
      if (typeof geojson === 'object' && !Array.isArray(geojson) && geojson !== null) {
        geojsonList = geojson
      }

      // let plot_ys = plottable.ys()
      // if(Array.isArray(plot_ys[0])) {
      //   ys.push(...plot_ys)
      // } else {
      //   ys.push(plot_ys)
      // }
    })

    // get/compute the chart width/height (may add padding to this in future)
    const pathGenerator = getPathCreator(geojsonList, mapWidth, mapHeight)
    containerAttrs.projector = pathGenerator
  }

  const callableObj: any = toExport

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
  Object.keys(obj).forEach((attr: any) => {
    if (!callableObj[attr] && Object.prototype.hasOwnProperty.call(obj, attr)) {
      callableObj[attr] = generateAccessor(attr)
    }
  })

  callableObj.attr = function () {
    return obj
  }

  callableObj.projection = function (_x: any) {
    if (arguments.length) {
      obj.projection = _x
      return callableObj
    }
    return callableObj.projection
  }

  return callableObj
}
