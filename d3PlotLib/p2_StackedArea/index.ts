// p2_StackedArea/index.ts
'use strict'
import { plotAttrs } from '../ChartAttribs'

declare const d3: any
declare const moment: any
declare const L: any
declare const $: any

const colorScheme = ['red', 'green', 'blue', 'grey']

export default function () {
  let obj: any = JSON.parse(JSON.stringify(plotAttrs))
  let _container: any = null

  // Dispatcher object to broadcast the mouse events
  const dispatcher = d3.dispatch(
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
    obj.colours = colorScheme
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

    let alpha = obj.alpha
    let style = obj.style
    let lineEffect = ''

    // set the line style
    if (style == '--') {
      lineEffect = 'stroke-dasharray'
    }

    let svg = _container.svg

    let chartGroup = svg.select(`.${obj.plotID}`)

    // let stackchartdataObj = data[0]
    // let categories = Object.keys(stackchartdataObj)
    // categories = categories.slice(1, categories.length)

    let colors = d3
      .scaleOrdinal()
      .domain(labels)
      .range(obj.colours)

      // .range(['#e41a1c', '#377eb8', '#4ddd4a', '#4aaa1b', '#4aaa5c'])

    // format the data into stacked coordinates using d3.stack
    let data = buildDataSet(xs, ys, labels)
    let stack = d3.stack().keys(labels).order(d3.stackOrderDescending)
    let stackedDataset = stack(data)

    console.log('stacked area what is dataset: ', stackedDataset)
    console.log('xscale domains: ', xScale.domain()[0], xScale.domain()[1])
    // xScale.domain([1, 5])
    // yScale.domain([0, 100])
    // console.log('test the scales: ', xScale, xScale(1), xScale(2), xScale(5))
    // console.log('test the scales y: ', yScale, yScale(3), yScale(35))

    // begin stacked area
    let area = d3
      .area()
      .x((d: any, i: number) => {
        // console.log('what is d / xs ith : ', d, xs[i])
        let scaled = xScale(xs[i]) 
        return scaled
        // console.log('what is created for x in area: ', d, xScale(d.data.year))
        // return xScale(d.data.year)
      })
      .y0((d: any, i: number) => {
        return yScale(d[0])
      })
      .y1((d: any, i: number) => {
        return yScale(d[1])
      })

    let selectionUpdate = chartGroup.selectAll('.layer').data(stackedDataset)

    selectionUpdate.exit().remove()

    selectionUpdate
      .enter()
      .append('g')
      .attr('class', 'layer')
      .append('path')
      .attr('class', 'area')
      .style('fill', (d: any) => {
        return colors(d.key)
      })
      .attr('d', (d: any, i: number) => {
        return area(d, i)
      })
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

  // callable_obj.extent = function (_x: any) {
  //   if (arguments.length) {
  //     obj['extent'] = _x
  //     return callable_obj
  //   }

  //   // console.log('obj xs and ys: ', obj.xs, obj.ys)

  //   let x_extent = d3.extent(obj.xs, (elem: any) => {
  //     return elem
  //   })

  //   let y_extent = d3.extent(obj.ys, (elem: any) => {
  //     return elem
  //   })

  //   return {
  //     x: x_extent,
  //     y: y_extent,
  //   }
  // }

  return callable_obj
}
