import { NumberValue } from 'd3'
import rfdc from 'rfdc'
import { plotAttrs } from '../ChartAttribs'
import { containerObj } from '../p2_Container'

const colorScheme = ['red', 'green', 'blue', 'grey']

export default function () {
  const obj = rfdc()(plotAttrs)
  let container: containerObj = null

  // Dispatcher object to broadcast the mouse events
  // const dispatcher = dispatch(
  //   'customMouseOver',
  //   'customMouseMove',
  //   'customMouseOut',
  //   'customMouseClick'
  // )

  function buildContainerGroups() {
    const { svg } = container

    const chartGroup = svg.select('g.chart-group')
    const children = chartGroup.selectAll('*')
    const existingElements = children.filter(`g.${obj.plotID}`)

    if (existingElements.size() > 0) {
      return
    }

    obj.index = children.size()
    obj.plotID = `plot-${obj.index}`
    chartGroup.append('g').classed(`${obj.plotID}`, true)
    obj.colours = colorScheme
  }

  // function prepareData() {
  //   // check ys for 2d array
  //   obj.ys = Array.isArray(obj.ys[0]) ? obj.ys : [obj.ys]

  //   // check labels
  //   obj.labels = Array.isArray(obj.labels) ? obj.labels : [obj.labels]

  //   // check colours
  //   obj.colours = Array.isArray(obj.colours) ? obj.colours : [obj.colours]

  //   // check styles
  //   obj.styles = Array.isArray(obj.styles) ? obj.styles : [obj.styles]

  //   // check alphas
  //   obj.alpha = Array.isArray(obj.alpha) ? obj.alpha : [obj.alpha]
  // }

  function drawData() {
    const { ys } = obj
    const { xs } = obj

    // const { index } = obj
    // const strokeColours = obj.colours
    const { xScale } = container
    const { yScale } = container
    const colours = obj.colours ?? ['red', 'green', 'blue', 'gray', 'black']

    // console.log('scatter plot draw : xs / ys / test xscale / test yscale ', ys)

    // const { alpha } = obj
    // const { styles } = obj
    // const lineEffect = ''
    // const curveType = obj.curve ?? d3.curveLinear

    const { svg } = container
    const chartGroup = svg.select(`.${obj.plotID}`)

    // Add dots
    let plots = chartGroup.selectAll('g').data(ys)

    const plotsEnter = plots.enter().append('g')

    plots.exit().remove()

    plots = plots.merge(plotsEnter)

    type PairType = { elem: unknown; i: number }
    let plotsInner = plots.selectAll('circle').data((d: unknown[], i: number) => {
      const pairedData = d.map((elem: unknown) => ({ elem, i }))
      return pairedData
    })

    const plotsInnerEnter = plotsInner
      .enter()
      .append('circle')
      .filter((d: PairType) => Number.isNaN(d.elem) === false)

    plotsInner.exit().remove()

    plotsInner = plotsInner.merge(plotsInnerEnter)

    plotsInner
      .attr('cx', (d: PairType, idx: number) => xScale(xs[idx] as NumberValue))
      .attr('cy', (d: PairType) => yScale(d.elem as NumberValue))
      .attr('r', 1.5)
      .style('fill', (d: PairType) => colours[d.i])
  }

  function toExport(_container: containerObj) {
    container = _container
    buildContainerGroups()
    // prepareData()
    drawData()
  }

  const chart = toExport

  function generateAccessor<Type>(attr: keyof typeof obj) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function accessor(value?: Type): any {
      if (!arguments.length) {
        return obj[attr] as Type
      }
      obj[attr] = value as never
      return chart
    }
    return accessor
  }

  toExport.xs = generateAccessor<number[]>('xs')
  toExport.ys = generateAccessor<unknown[]>('ys')
  toExport.colours = generateAccessor<string[]>('colours')
  toExport.labels = generateAccessor<string[]>('labels')

  return chart
}
