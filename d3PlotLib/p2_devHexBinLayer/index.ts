/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3'
// import * as d3Dispatch from 'd3-dispatch'
import * as d3Hexbin from 'd3-hexbin'
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

  function getPointGrid(cols: number) {
    const width = container.mapWidth
    const height = container.mapHeight

    const hexDistance = width / cols
    const rows = Math.floor(height / hexDistance)
    // const hexRadius = hexDistance / 1.5
    // console.log('get point grid stuff: ', width, height, hexDistance, rows, hexRadius)

    const rangeOfValues = d3.range(rows * cols)
    const mapped = rangeOfValues.map((elem: any, i: number) => {
      const x = Math.floor((i % cols) * hexDistance)
      const y = Math.floor(i / cols) * hexDistance
      return {
        x,
        y,
        datapoint: 0,
      }
    })
    return mapped
  }

  // function drawPointGrid(svg: any, data : any) {
  //   let boundaries = svg
  //       .append('g')
  //       .attr('id', 'circles')
  //       .selectAll(".dot")
  //       .data(data)
  //       .enter()
  //       .append('circle')
  //       .attr('cx', (d: any) => {
  //           return d.x
  //       })
  //       .attr('cy', (d: any) => {
  //           return d.y
  //       })
  //       .attr('r', 1)
  //       .attr('fill', 'tomato')
  // }

  function transformDataPoints(rawData: any[], projection: any) {
    const mapped = rawData.map((el: any) => {
      const coords = projection([+el.lng, +el.lat])
      const mappedElem = {
        x: coords[0],
        y: coords[1],
        datapoint: 1,
        name: el.MarketName,
        state: el.State,
        city: el.city,
        url: el.Website,
      }
      return mappedElem
    })
    return mapped
  }

  function rollupHexData(data: any[]) {
    let maxLength = 0
    const rolledUpData: any[] = []
    data.forEach((elem: any) => {
      const newElem: any[] = []
      elem.forEach((innerElem: any) => {
        const isDataPoint = innerElem.datapoint === 1
        if (isDataPoint) {
          newElem.push(innerElem)
        }
      })
      const newEntry = {
        x: elem.x,
        y: elem.y,
        data: newElem,
      }
      rolledUpData.push(newEntry)

      maxLength = newElem.length > maxLength ? newElem.length : maxLength
    })
    // console.log('rolled up data: ', rolledUpData)
    return {
      rolledUpData,
      maxLength,
    }
  }

  function drawData() {
    const { svg } = container
    const { geojson } = obj
    const { datapoints } = obj
    const pathCreator = container.projector
    const projection = pathCreator.projection()
    // let zoomLevel: number = _container.getZoom()

    // const styling = {
    //   'stroke': 'Brown',
    //   'stroke-opacity': '.2',
    //   'stroke-width': '1px',
    //   'fill-opacity': '.1',
    //   'fill' : 'green'
    // }

    const mapGroup = svg.select(`.${obj.plotID}`)

    // convert lat/long to projected points in map
    const polygonCoords = geojson.features[0].geometry.coordinates[0][0]
    const polygonPoints = polygonCoords.map((elem: any) => projection(elem))

    // filter out points outside of the point-grid
    const pointGrid = getPointGrid(160)
    const pointsInPolygon = pointGrid.filter((elem: any) =>
      d3.polygonContains(polygonPoints, [elem.x, elem.y])
    )

    const dataPointsTransformed: any[] = transformDataPoints(datapoints, projection)

    // console.log('usa points: ', usaPoints)
    // console.log('data points: ', dataPointsTransformed)

    const allPoints = pointsInPolygon.concat(dataPointsTransformed)

    // temp for now
    const exponent = 10

    const hexBin = d3Hexbin
      .hexbin<unknown>()
      // .radius(3.5)
      .radius(4)
      .x((d: any) => d.x)
      .y((d: any) => d.y)

    const hexPoints = hexBin(allPoints)
    const { rolledUpData, maxLength } = rollupHexData(hexPoints)

    const colorScale = d3
      .scaleSequential((t: any) => {
        const tNew = t ** exponent
        return d3.interpolateViridis(tNew)
      })
      .domain([maxLength, 1])

    // const radiusScale = d3.scaleSqrt().domain([0, maxLength]).range([3.5, 15])

    let hexGroup = mapGroup.selectAll('.hexes').data(rolledUpData)

    hexGroup.exit().style('opacity', 0).remove()

    const enterGroup = hexGroup.enter().append('path').classed('hexes', true)

    hexGroup = enterGroup.merge(hexGroup)

    hexGroup
      .attr(
        'transform',
        (d: any) =>
          // console.log('what is d in the hex drawing grid: ', d)
          `translate(${d.x}, ${d.y})`
      )
      .attr('d', () =>
        // return hexBin.hexagon(radiusScale(d.data.length))
        hexBin.hexagon()
      )
      .style('fill', (d: any) => colorScale(d.data.length))
      .style('opacity', '0.8')
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

  plot.datapoints = function (_x: any) {
    if (arguments.length) {
      obj.datapoints = _x
      return plot
    }
    return obj.datapoints
  }

  return plot
}
