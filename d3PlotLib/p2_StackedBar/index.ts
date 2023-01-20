// p2_StackedBar/index.ts
import * as d3 from 'd3'
import { dispatch } from 'd3-dispatch'
import { plotAttrs } from '../ChartAttribs'

const colorScheme = ['red', 'green', 'blue', 'grey']

export default function () {
  let obj: any = JSON.parse(JSON.stringify(plotAttrs))
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

    // format the data into stacked coordinates using d3.stack
    let data = buildDataSet(xs, ys, labels)
    let stack = d3.stack().keys(labels).order(d3.stackOrderDescending)
    let stackedDataset = stack(data)

    var selectionUpdate = chartGroup.selectAll(".layer")
    .data(stackedDataset)

    var layer = selectionUpdate
    .enter()
    .append('g')
    .attr("class", "layer")
    .style('fill', function(d : any, i : number){
        return colors(d.key);
    });

    layer.selectAll('rect')
    .data(function(d : any) {
      return d;
    })
    .enter()
    .append('rect')
    .attr('x', function(d : any, i : number){
        return xScale(xs[i]);
    })
    .attr('y', function(d : any){
        return yScale(d[1]);
    })
    .attr('height', function(d : any) {
        const height = yScale(d[0]) - yScale(d[1]);
        return height;
    })
    .attr('width', xScale.bandwidth());

    selectionUpdate
    .exit()
    .remove();
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
