export default `
// matplotlib style
let x = [1, 2, 3, 4, 5]
let y1 = [1, 1, 2, 3, 5]
let y2 = [0, 4, 2, 6, 8]
let y3 = [1, 3, 5, 7, 9]
let labels = ['Fibonacci ', 'Evens', 'Odds']

let scaler = d3PlotLib.Scaler()
.xScale((xs: any) => {
  return d3.scaleBand()
  .domain(xs)
  .padding(0.1)
})
.yScale((ys: any) => {
  return d3.scaleLinear()
  .domain([0, 25])
})

let stackplot = d3PlotLib.StackedBar()
.xs(x)
.ys([y1, y2, y3])
.labels(labels)

let legend = d3PlotLib.Legend()

let container = d3PlotLib
  .Container()
  .xAxisLabel('X label')
  .yAxisLabel('Y Label')
  .scale(scaler)
  .plot(stackplot)
  .legend(legend)

d3.select(ref).call(container)
`