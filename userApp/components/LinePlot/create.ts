
export default `
let xs = [1, 2, 4, 4.1, 5]
let ys1 = [4, 5, 6, 6, 8]
let ys2 = [2, 3, 1, 2, 3]
let ys3 = [4, 5, 2, 1, 1]

let makeXScale = (xs: []) => {
  return d3.scaleLinear().domain(d3.extent(xs))
}

let makeYScale = (ys: []) => {
  let merged = [].concat.apply([], ys)
  return d3.scaleLinear().domain(d3.extent(merged))
}

let scaler = d3PlotLib.Scaler().xScale(makeXScale).yScale(makeYScale)

let plot1 = d3PlotLib.Plot().tag('plot1').xs(xs).ys(ys1).labels('Norm')

let plot2 = d3PlotLib.Plot().xs(xs).ys(ys2).labels('LogNorm').styles('--').alpha(0.3)

let plot3 = d3PlotLib.Plot().xs(xs).ys(ys3).labels('SkewNorm')

let vLine = d3PlotLib.AxLine().xs([2.8]).labels('Cut Off').alpha(0.5).styles('--')

// create a fill-between above the line but below the curve.
let condition = (x: any) => {
  return x > 1.8 && x <= 4.6
}

let fillBetween = d3PlotLib
  .FillArea()
  .xs(xs)
  .ys(ys1)
  .tag('fill')
  .alpha(0.2)
  .where(condition)
  .colours(['blue'])
  .labels(['filled in'])

let legend = d3PlotLib.Legend().position('topleft')

let container = d3PlotLib
  .Container()
  .xAxisLabel('X Axis')
  .yAxisLabel('Y Axis')
  .scale(scaler)
  .plot(plot1)
  .plot(plot2)
  .plot(plot3)
  .plot(vLine)
  .plot(fillBetween)
  .legend(legend)

d3.select(ref).call(container)

`