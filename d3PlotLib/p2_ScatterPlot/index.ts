import * as d3 from 'd3'
import { dispatch } from 'd3-dispatch'
import { plotAttrs } from '../ChartAttribs'

const colorScheme = ['red', 'green', 'blue', 'grey']

export default function () {
  const obj: any = JSON.parse(JSON.stringify(plotAttrs))
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
    // prepareData()
    drawData()
  }

  function buildContainerGroups() {
    const { svg } = _container

    const chartGroup = svg.select('g.chart-group')
    const children = chartGroup.selectAll(function () {
      return this.childNodes
    })

    const existingElements = children.filter(`g.${obj.plotID}`)
    if (existingElements.size() > 0) {
      return
    }

    obj.index = children.size()
    obj.plotID = `plot-${obj.index}`
    chartGroup.append('g').classed(`${obj.plotID}`, true)

    // console.log('p2_Plot : obj/chart-group/children : ', obj, chartGroup, children)

    // set the colour etc
    const index = obj.index % colorScheme.length
    obj.colours = colorScheme
  }

  function prepareData() {
    // check ys for 2d array
    obj.ys = Array.isArray(obj.ys[0]) ? obj.ys : [obj.ys]

    // check labels
    obj.labels = Array.isArray(obj.labels) ? obj.labels : [obj.labels]

    // check colours
    obj.colours = Array.isArray(obj.colours) ? obj.colours : [obj.colours]

    // check styles
    obj.styles = Array.isArray(obj.styles) ? obj.styles : [obj.styles]

    // check alphas
    obj.alpha = Array.isArray(obj.alpha) ? obj.alpha : [obj.alpha]
  }

  // function drawData() {
  //   let ys = obj.ys
  //   let xs = obj.xs

  //   let index = obj.index
  //   let strokeColours = obj.colours
  //   let xScale = _container.xScale
  //   let yScale = _container.yScale

  //   // console.log('scatter plot draw : xs / ys / test xscale / test yscale ', ys)

  //   let alpha = obj.alpha
  //   let styles : [] = obj.styles
  //   let lineEffect = ""
  //   let curveType = obj.curve ?? d3.curveLinear

  //   let svg = _container.svg
  //   let chartGroup = svg.select(`.${obj.plotID}`)

  // // Add dots
  //   chartGroup.append('g')
  //   .selectAll("dot")
  //   .data(ys)
  //   .enter()
  //   .append("circle")
  //     .attr("cx", function (d:any) {
  //       return xScale(d.GrLivArea)
  //   })
  //   .attr("cy", function (d:any) {
  //       return yScale(d.SalePrice)
  //   })
  //   .attr("r", 1.5)
  //   .style("fill", "#69b3a2")
  // }

  function drawData() {
    const { ys } = obj
    const { xs } = obj

    const { index } = obj
    const strokeColours = obj.colours
    const { xScale } = _container
    const { yScale } = _container
    const colours = obj.colours ?? ['red', 'green', 'blue', 'gray', 'black']

    // console.log('scatter plot draw : xs / ys / test xscale / test yscale ', ys)

    const { alpha } = obj
    const { styles } = obj
    const lineEffect = ''
    const curveType = obj.curve ?? d3.curveLinear

    const { svg } = _container
    const chartGroup = svg.select(`.${obj.plotID}`)

    // Add dots
    let plots = chartGroup.selectAll('g').data(ys)

    const plotsEnter = plots.enter().append('g')

    plots.exit().remove()

    plots = plots.merge(plotsEnter)

    let plotsInner = plots.selectAll('circle').data((d: any, i: number) => {
      const paired_data = d.map((elem: any) => ({ elem, i }))
      return paired_data
    })

    const plotsInnerEnter = plotsInner
      .enter()
      .append('circle')
      .filter((d: any) => Number.isNaN(d.elem) === false)

    plotsInner.exit().remove()

    plotsInner = plotsInner.merge(plotsInnerEnter)

    plotsInner
      .attr('cx', (d: any, idx: number) => xScale(xs[idx]))
      .attr('cy', (d: any) => yScale(d.elem))
      .attr('r', 1.5)
      .style('fill', (d: any) => colours[d.i])
  }

  const callable_obj: any = plot

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
  for (const attr in obj) {
    if (!callable_obj[attr] && obj.hasOwnProperty(attr)) {
      callable_obj[attr] = generateAccessor(attr)
    }
  }

  callable_obj.on = function (_x: any) {
    const value = dispatcher.on.apply(dispatcher, arguments)
    return value === dispatcher ? callable_obj : value
  }

  callable_obj.attr = function () {
    return obj
  }

  callable_obj.extent = function () {
    // console.log('obj xs and ys: ', obj.xs, obj.ys)

    const x_extent = d3.extent(obj.xs, (elem: any) => elem)

    const y_extent = d3.extent(obj.ys, (elem: any) => elem)

    return {
      x: x_extent,
      y: y_extent,
    }
  }

  return callable_obj
}
