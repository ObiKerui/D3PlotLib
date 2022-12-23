
export default `
let csvresult = await d3.csv('assets/iris.csv')
  
let labels = Object.keys(csvresult[0])
labels = labels.slice(0, -1)

// create an empty array for each label 
let arrays: any = labels.reduce((accumulator, value) => {
  return {...accumulator, [value]: []}
}, {})

csvresult.forEach((elem: any) => {
  labels.forEach((e: any) => { 
    arrays[e as keyof any].push(+(elem[e]))
  })
  return elem
})

let ys = Object.values(arrays)

let scaler = d3PlotLib.Scaler()
  .xScale((xs: any) => {
    return d3
      .scaleBand()
      .domain(labels)
      .paddingInner(0.1)
      .paddingOuter(0.1)
  })
  .yScale((ys: any) => {
    return d3.scaleLinear().domain([-10, 10])
  })

let boxplot = d3PlotLib.ViolinPlot()
.ys(ys)
.labels(labels)

let container = d3PlotLib
  .Container()
  .xAxisLabel('X Axis')
  .yAxisLabel('Y Axis')
  .scale(scaler)
  .plot(boxplot)

d3.select(ref).call(container)
`