
export default `
let csvresult = await d3.csv('assets/iris.csv')
let xs = np.linspace(0, 160, 160)

let keys = Object.keys(csvresult[0])
let obj: any = keys.reduce((accumulator, value) => {
  return { ...accumulator, [value]: [] }
}, {})

csvresult.forEach((elem: { [x: string]: any }) => {
  keys.forEach((e) => {
    obj[e].push(+elem[e])
  })
  return elem
})

let ys = Object.values(obj)

let scaler = d3PlotLib
  .Scaler()
  .xScale((xs: any) => {
    return d3.scaleLinear().domain(d3.extent(xs))
  })
  .yScale((ys: any) => {
    let merged = [].concat.apply([], ys)
    return d3.scaleLinear().domain(d3.extent(merged))
  })

let scatterPlot = d3PlotLib
  .ScatterPlot()
  .xs(xs)
  .ys(ys)
  .colours(['red', 'green', 'blue', 'black'])
  .labels(keys)

let container = d3PlotLib
  .Container()
  .xAxisLabel('X Axis')
  .yAxisLabel('Y Axis')
  .scale(scaler)
  .plot(scatterPlot)
  .legend(d3PlotLib.Legend())

d3.select(ref).call(container)

return container
`