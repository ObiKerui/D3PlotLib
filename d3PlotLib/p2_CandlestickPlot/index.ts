/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3Dispatch from 'd3-dispatch'
import * as d3 from 'd3'
import { plotAttrs } from '../ChartAttribs'

const colorScheme = ['red', 'green', 'blue', 'grey']

export default function () {
  let obj: any = JSON.parse(JSON.stringify(plotAttrs))
  let _container: any = null

  // Dispatcher object to broadcast the mouse events
  const dispatcher = d3Dispatch.dispatch(
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

  function buildContainerGroups() {
    let svg = _container.svg

    let chartGroup = svg.select('g.chart-group')
    let children = chartGroup.selectAll(function () {
      return this.childNodes
    })

    let existingElements = children.filter(`g.${obj.plotID}`)
    if (existingElements.size() > 0) {
      return
    }

    obj.index = children.size()
    obj.plotID = `plot-${obj.index}`
    chartGroup.append('g').classed(`${obj.plotID}`, true)

    // console.log('p2_Plot : obj/chart-group/children : ', obj, chartGroup, children)

    // set the colour etc
    let index = obj.index % colorScheme.length
    obj.colour = colorScheme[index]
  }

  function buildDataSet(xs : any, ys : any, keys : string[]) {

    let nbrRows = ys.length
    let nbrCols = ys[0].length   
    let dataset = []
      
    for(let col = 0; col < nbrCols; col++) {
      let column_obj : any = {}

      for(let row = 0; row < nbrRows; row++) {
        let row_elem = ys[row]
        let label : string = keys[row]
        column_obj[label as keyof typeof column_obj] = row_elem[col]
      }
      dataset.push(column_obj)
    }

    // console.log('what dataset did we build? ', arr)
    return dataset
  }

  function drawData() {
    let xs = obj.xs
    let ys = obj.ys
    let labels = obj.labels
    let index = obj.index
    let strokeColour = obj.colour
    let xScale = _container.xScale
    let yScale = _container.yScale

    // console.log('stacked area draw : obj / xs / ys / test xscale / test yscale ', obj, xs, ys, xScale(xs[0]), yScale(ys[0]))

    // let alpha = obj.alpha
    // let style = obj.style
    // let lineEffect = ''

    // // set the line style
    // if (style == '--') {
    //   lineEffect = 'stroke-dasharray'
    // }

    let svg = _container.svg
    let chartGroup = svg.select(`.${obj.plotID}`)

    // select all rect in svg.chart-group with the class bar
    let bars = chartGroup.selectAll(".bar")
    .data(ys)

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    bars.exit()
    .style("opacity", 0)
    .remove()

    // Enter - add the shapes to this data point
    let enterGroup = bars
      .enter()
      .append("rect")
      .classed("bar", true)

    // join the new data points with existing 
    bars = bars.merge(enterGroup)

    // now position and colour what exists on the dom
    bars.attr("x", (d : any, idx: number) => {
        return xScale(xs[idx])
    })
      .attr("y", ({ open, close } : any) => yScale(Math.max(open, close)))
      .attr("width", 10)
      .attr("height", ({ open, close } : any) => {
        if (open == close) {
            return 1
        }
        let height = yScale(Math.min(open, close)) - yScale(Math.max(open, close))
        return height       
      })
      .attr("fill", ({ open, close } : any) => {
        return (open === close) ? "silver" : (open > close) ? "red" : "green"   
      })
      .on("mouseover", function(d : any) {
        d3.select(this).style("cursor", "pointer")
        dispatcher.call("customMouseOver", this, d)
      })
      .on("mousemove", function(d : any) {
        dispatcher.call("customMouseMove", this, d)
      })
      .on("mouseout", function(d : any) {
        dispatcher.call("customMouseOut", this, d)
      })
      .on("click", function(d : any) {
        dispatcher.call("customMouseClick", this, d)
      })

    // Select all lines in svg.chart-group with the class sticks
    let sticks = chartGroup.selectAll(".sticks")
    .data(ys)          

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    sticks.exit()
    .style("opacity", 0)
    .remove()

    // Enter - add the shapes to this data point    
    let sticksEnterGroup = sticks.enter()
    .append("line")
    .attr("class", "sticks")

    // join the new data points with existing 
    sticks = sticks.merge(sticksEnterGroup)
      
    // now position and colour what exists on the dom
    sticks.attr("x1", (d : any) => {
          let startPoint = xScale(d.date); 
          return startPoint + (10 / 2);
      })
      .attr("x2", (d : any) => {
          let startPoint : number = xScale(d.date);
          return startPoint + (10 / 2);
      })
      .attr("y1", (d : any) => yScale(d.high))
      .attr("y2", (d : any) => yScale(d.low))
      .attr("stroke", (d : any) => (d.open === d.close) ? "white" : (d.open > d.close) ? "red" : "green"); 
  }

  let callable_obj: any = plot

  function generateAccessor(attr: any) {
    function accessor(value: any) {
      if (!arguments.length) {
        return obj[attr]
      }
      obj[attr] = value

      return callable_obj
    }
    return accessor
  }

  // generate the chart attributes
  for (let attr in obj) {
    if (!callable_obj[attr] && obj.hasOwnProperty(attr)) {
      callable_obj[attr] = generateAccessor(attr)
    }
  }

  callable_obj.on = function (_x: any) {
    let value = dispatcher.on.apply(dispatcher, arguments)
    return value === dispatcher ? callable_obj : value
  }

  callable_obj.attr = function () {
    return obj
  }

  return callable_obj
}
