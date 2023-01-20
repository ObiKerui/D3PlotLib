/* eslint-disable @typescript-eslint/no-explicit-any */
// MapMarkers/index.ts
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
    obj.plotID = `markers-${children.size()}`
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

  // Create selection using D3
  // const overlay = d3.select(map.getPanes().overlayPane)
  // const svg = overlay.select('svg');

  // // create a group that is hidden during zooming
  // let layer = svg.select(`g.${key}`);
  // if(layer.node()) {
  //     layer.remove();
  // }

  // if(poiData.showPOI == false) {
  //     return;
  // }

  // let properties = svg.selectAll("g.properties");
  // if(properties.node()) {
  //     properties.remove();
  // }

  // let symbolSize : number = 25.0;
  // properties = svg.append("g").attr("class", `${key}`);

  // const defaultStyle = {
  //     "pointer-events" : "all",
  //     "stroke" : "blue",
  //     "stroke-width" : 4.0,
  //     "fill" : "green",
  //     "border-radius" : "24px",
  //     "cursor" : "pointer"
  // };

  // const hoverStyle = {
  //     "stroke" : "red",
  //     "stroke-width" : 16.0,
  //     "fill" : "red",
  //     "cursor" : "pointer"
  // };

  // const styling : any = poiData.styles || defaultStyle;

  // let selUpdate = properties.selectAll("path.properties")
  // .data(poiData.data);

  // selUpdate
  // .exit()
  // .remove();

  // selUpdate.enter()
  // .append("svg:path")
  // .attr("class", `properties`)
  // .attr("style", "pointer-events: auto;")
  // .merge(selUpdate)
  // .attrs(styling)
  // .attr("d", (d : any, i : number, n : any) => {
  //     return d3.symbol().type(d3.symbolSquare).size(symbolSize)();
  // })
  // .attr("transform", function(d : any, i : number, n : any) {
  //     let latlng = d.latlong;
  //     let point : any = map.latLngToLayerPoint(new L.LatLng(latlng[0], latlng[1]))
  //     let x = point.x;
  //     let y = point.y;
  //     return `translate(${x},${y})`;
  // })
  // .on('mouseover', function(d : any, i : number) {
  //     d3.select(this).attrs(hoverStyle);
  // })
  // .on("mouseout", function(d : any, i : number) {
  //     d3.select(this).attrs(styling);
  // })
  // .on("click", function(d : any, i : number, n : any) {
  //     poiData.onClick(d);
  // });

  function drawData() {
    const { map } = _container
    const { svg } = _container
    const pathCreator = getPathCreator(map)
    const { data } = obj
    const styling = {
      stroke: 'Orange',
      'stroke-width': '1px',
      fill: 'blue',
    }

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
      .attr('d', (d: any, i: number, n: any) => d3.symbol().type(d3.symbolSquare).size(45)())
      .attr('transform', (d: any, i: number, n: any) => {
        const latlng = d.latlong
        const point: any = map.latLngToLayerPoint(new L.LatLng(latlng[0], latlng[1]))
        const { x } = point
        const { y } = point
        return `translate(${x},${y})`
      })
      .styles(styling)
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

  return plot
}
