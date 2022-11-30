// p2_ViolinPlot/index.ts
'use strict'
import { container } from 'webpack'
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
    // prepareData()
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

  function violinpreprocess(ys: any[], binFtn: any) {

    // Compute the binning for each group of the dataset
    var sumstat = d3
      .nest() // nest function allows to group the calculation per level of a factor
      .key(function (d: any) {
        return d.Species
      })
      .rollup(function (d: any) {
        // For each key..
        let input = d.map(function (g: any) {
          return g.Sepal_Length
        }) // Keep the variable called Sepal_Length
        
        let bins = binFtn(input) // And compute the binning on it.
        return bins

      })
      .entries(ys)

      return sumstat
  }

  function makeBins(arr: number[], bins: number[]) {

    let yScale = _container.yScale
    let binFtn = d3.bin()
    .domain(yScale.domain())
    .thresholds(bins)

    return binFtn
  }

  function preprocessData(ys: number[][]) {

    let yScale = _container.yScale
    let bins = obj.bins ?? 100

    let binFtn = d3.bin()
    .domain(yScale.domain())
    .thresholds(bins)

    let result = ys.map((elem: number[]) => {
      return binFtn(elem)
    })

    return result
  }

  function drawData() {
    let ys = obj.ys
    let labels = obj.labels

    let xScale = _container.xScale
    let yScale = _container.yScale

    let svg = _container.svg
    let chartGroup = svg.select(`.${obj.plotID}`)

    let sumstat = preprocessData(ys)

    // let binFtn =  makeBins(ys, yScale.ticks(20))
    // let sumstat: any = violinpreprocess(ys, binFtn)

    
    let lengths = 0
    let longest = 0

    // What is the biggest number of value in a bin? We need it cause this value will have a width of 100% of the bandwidth.
    var maxNum = 0
    for (let i in sumstat) {
      let bins = sumstat[i]
      lengths = bins.map(function (a: any) {
        return a.length
      })
      longest = d3.max(lengths)
      if (longest > maxNum) {
        maxNum = longest
      }
    }

    let bandwidth = xScale.bandwidth()
    let xNum = d3.scaleLinear()
    .range([0, bandwidth])
    .domain([-longest, longest])

    // instructions for the violin plot
    let violins = chartGroup
    .selectAll("myViolin")
    .data(sumstat)

    violins.exit().remove()

    let enterViolins = violins
    .enter()        
    .append("g")

    let enterPaths = enterViolins
    .append("path")

    violins = violins.merge(enterViolins)

    violins.attr("transform", (d: any, ith: number) => {
        return(`translate(${xScale(labels[ith])},0)`)
    })

    let paths = violins.selectAll("path")
    .datum((d: any) => {
        return d
    })

    paths = paths.merge(enterPaths)

    paths
    .attr("d", (d: any) => {
        let area = d3.area()
        .x0((elem: any) => {
            return xNum(-elem.length)
        })
        .x1((elem: any) => {
            return xNum(elem.length)
        })
        .y((elem: any) => {
            return yScale(elem.x0)
        })
        .curve(d3.curveCatmullRom)

        return area(d)
    })
    .style("stroke", "none")
    .style("fill","#69b3a2")
  }

  // function drawData2() {
  //   let ys = obj.ys

  //   let xScale = _container.xScale
  //   let yScale = _container.yScale

  //   let svg = _container.svg
  //   let chartGroup = svg.select(`.${obj.plotID}`)

  //   let binFtn =  makeBins(ys, yScale.ticks(20))
  //   let sumstat: any = violinpreprocess(ys, binFtn)
  //   let lengths = 0
  //   let longest = 0

  //   // ------------------------------------------------------------------
  //   // this taken from histogram 
  //   // calculate the bin objects and yscale domain
  //   // let binsObjs: any[] = makeBins(ys, bins)
  //   // let maxLength = d3.reduce(binsObjs, (p: any, v: []) => {
  //   //   return (v.length > p ? v.length : p) 
  //   // }, 0)
  //   // ------------------------------------------------------------------

  //   // What is the biggest number of value in a bin? We need it cause this value will have a width of 100% of the bandwidth.
  //   var maxNum = 0
  //   for (let i in sumstat) {
  //     let allBins = sumstat[i].value
  //     lengths = allBins.map(function (a: any) {
  //       return a.length
  //     })
  //     longest = d3.max(lengths)
  //     if (longest > maxNum) {
  //       maxNum = longest
  //     }
  //   }

  //   let bandwidth = xScale.bandwidth()
  //   var xNum = d3.scaleLinear()
  //   .range([0, bandwidth])
  //   .domain([-maxNum, maxNum])

  //   // instructions for the violin plot
  //   let violins = chartGroup
  //   .selectAll("myViolin")
  //   .data(sumstat)

  //   violins.exit().remove()

  //   let enterViolins = violins
  //   .enter()        
  //   .append("g")

  //   let enterPaths = enterViolins
  //   .append("path")

  //   violins = violins.merge(enterViolins)

  //   violins.attr("transform", (d: any) => {
  //       return(`translate(${xScale(d.key)},0)`)
  //   })

  //   let paths = violins.selectAll("path")
  //   .datum((d: any) => {
  //       return d.value
  //   })

  //   paths = paths.merge(enterPaths)

  //   paths
  //   .attr("d", (d: any) => {
  //       let area = d3.area()
  //       .x0((elem: any) => {
  //           return xNum(-elem.length)
  //       })
  //       .x1((elem: any) => {
  //           return xNum(elem.length)
  //       })
  //       .y((elem: any) => {
  //           return yScale(elem.x0)
  //       })
  //       .curve(d3.curveCatmullRom)

  //       return area(d)
  //   })
  //   .style("stroke", "none")
  //   .style("fill","#69b3a2")
  // }

  // function drawData() {
  //   let ys = obj.ys

  //   let xScale = _container.xScale
  //   let yScale = _container.yScale

  //   let svg = _container.svg
  //   let chartGroup = svg.select(`.${obj.plotID}`)

  //   let binFtn =  makeBins(ys, yScale.ticks(20))
  //   let sumstat: any = violinpreprocess(ys, binFtn)
  //   let lengths = 0
  //   let longest = 0

  //   // What is the biggest number of value in a bin? We need it cause this value will have a width of 100% of the bandwidth.
  //   var maxNum = 0
  //   for (let i in sumstat) {
  //     let allBins = sumstat[i].value
  //     lengths = allBins.map(function (a: any) {
  //       return a.length
  //     })
  //     longest = d3.max(lengths)
  //     if (longest > maxNum) {
  //       maxNum = longest
  //     }
  //   }

  //   let bandwidth = xScale.bandwidth()
  //   var xNum = d3.scaleLinear()
  //   .range([0, bandwidth])
  //   .domain([-maxNum, maxNum])

  //     // instructions for the violin plot
  //     let violins = chartGroup
  //     .selectAll("myViolin")
  //     .data(sumstat)

  //     violins.exit().remove()

  //     let enterViolins = violins
  //     .enter()        // So now we are working group per group
  //     .append("g")

  //     violins = violins.merge(enterViolins)

  //   violins
  //   .attr("transform", function(d: any) { 
  //       return(`translate(${xScale(d.key)},0)`) 
  //   }) // Translation on the right to be at the group position
  //   .append("path")
  //       .datum(function(d: any) { 
  //           console.log('what is the datum for each violin path / overall data: ', d, sumstat)
  //           return(d.value)
  //       })     // So now we are working bin per bin
  //       .style("stroke", "none")
  //       .style("fill","#69b3a2")
  //       .attr("d", d3.area()
  //           .x0(function(d: any){ 
  //               console.log('what is d here: ', d)
  //               return(xNum(-d.length)) 
  //           })
  //           .x1(function(d: any) { 
  //               return(xNum(d.length)) 
  //           })
  //           .y(function(d: any){ 
  //               return(yScale(d.x0)) 
  //           })
  //           .curve(d3.curveCatmullRom)    // This makes the line smoother to give the violin appearance. Try d3.curveStep to see the difference
  //       )      
  // }

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

  callable_obj.extent = function () {
    // console.log('obj xs and ys: ', obj.xs, obj.ys)

    let x_extent = d3.extent(obj.xs, (elem: any) => {
      return elem
    })

    let y_extent = d3.extent(obj.ys, (elem: any) => {
      return elem
    })

    return {
      x: x_extent,
      y: y_extent,
    }
  }

  return callable_obj
}
