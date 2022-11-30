// p2_devHexBinLayer/index.ts
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
    obj.plotID = `layer-${children.size()}`
    chartGroup.append("g").classed(`${obj.plotID}`, true)
  }

  function getPointGrid(cols: number) {
    const width = _container.mapWidth
    const height = _container.mapHeight

    console.log('map height / width: ', _container)
    const hexDistance = width / cols
    const rows = Math.floor(height / hexDistance)
    const hexRadius = hexDistance / 1.5
    // console.log('get point grid stuff: ', width, height, hexDistance, rows, hexRadius)

    const rangeOfValues = d3.range(rows * cols)
    const mapped = rangeOfValues.map((elem: any, i: number) => {
        let x = Math.floor(i % cols * hexDistance)
        let y = Math.floor(i / cols) * hexDistance
        return {
            x, y, datapoint: 0
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
    const mapped = rawData.map((el : any) => {
        let coords = projection([+el.lng, +el.lat])
        let mappedElem = {
            x: coords[0],
            y: coords[1],
            datapoint: 1,
            name: el.MarketName,
            state: el.State,
            city: el.city,
            url: el.Website
        }
        return mappedElem
    })
    return mapped
  }

  function rollupHexData(data: any[]) {

    let maxLength = 0
    let rolledUpData: any[] = []
    data.forEach((elem: any) => {
      let newElem: any[] = []
      elem.forEach((innerElem: any) => {
        let isDataPoint = innerElem.datapoint === 1
        if(isDataPoint) {
          newElem.push(innerElem)
        }
      })
      let newEntry = {
        x: elem.x,
        y: elem.y,
        data: newElem
      }
      rolledUpData.push(newEntry)

      maxLength = (newElem.length > maxLength) ? newElem.length : maxLength
    })
    // console.log('rolled up data: ', rolledUpData)
    return {
      rolledUpData,
      maxLength
    }
  }

  function drawData() {
    let svg = _container.svg
    let geojson: any = obj.geojson
    let datapoints: any = obj.datapoints
    let pathCreator = _container.projector
    let projection = pathCreator.projection()
    // let zoomLevel: number = _container.getZoom()

    // const styling = {
    //   'stroke': 'Brown',
    //   'stroke-opacity': '.2',
    //   'stroke-width': '1px',
    //   'fill-opacity': '.1',
    //   'fill' : 'green'    
    // }

    let mapGroup = svg.select(`.${obj.plotID}`)

    // convert lat/long to projected points in map
    let polygonCoords = geojson.features[0].geometry.coordinates[0][0]
    let polygonPoints = polygonCoords.map((elem: any) => {
      return projection(elem)
    })

    // filter out points outside of the point-grid
    let pointGrid = getPointGrid(160)
    let pointsInPolygon = pointGrid.filter((elem: any) => {
      return d3.polygonContains(polygonPoints, [elem.x, elem.y])
    })

    let dataPointsTransformed : any[] = transformDataPoints(datapoints, projection)

    // console.log('usa points: ', usaPoints)
    // console.log('data points: ', dataPointsTransformed)

    let allPoints = pointsInPolygon.concat(dataPointsTransformed)

    // temp for now
    let exponent = 10

    let hexBin = d3.hexbin()
    // .radius(3.5)
    .radius(4)
    .x((d : any) => d.x)
    .y((d: any) => d.y)

    let hexPoints = hexBin(allPoints)
    let { rolledUpData, maxLength } = rollupHexData(hexPoints) 

    let colorScale = d3.scaleSequential((t: any) => {
      let tNew = Math.pow(t, exponent);
      return d3.interpolateViridis(tNew);
	  }).domain([maxLength, 1]);	

	  let radiusScale = d3.scaleSqrt().domain([0, maxLength]).range([3.5, 15]);    

    let hexGroup = mapGroup
      .selectAll(".hexes")
      .data(rolledUpData)

    hexGroup.exit()
      .style("opacity", 0)
      .remove()

    let enterGroup = hexGroup
      .enter()
      .append("path")
      .classed("hexes", true)
    
    hexGroup = enterGroup.merge(hexGroup)
    
    hexGroup
      .attr('transform', (d: any) => {
        // console.log('what is d in the hex drawing grid: ', d)
        return `translate(${d.x}, ${d.y})`
      })
      .attr('d', (d: any) => {
        // return hexBin.hexagon(radiusScale(d.data.length))
        return hexBin.hexagon()
      })
      .style('fill', (d: any) => { 
          return colorScale(d.data.length); 
      })
      .style('opacity', '0.8')

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

  plot.onStyle = function(_x: any) {
    if(arguments.length) {
      obj.onStyle = _x
      return plot
    }
    return obj.onStyle
  }

  plot.datapoints = function(_x: any) {
    if(arguments.length) {
        obj.datapoints = _x
        return plot
    }
    return obj.datapoints
  }

  return plot;
}
