export default `
let csvdata = await d3.csv('assets/data_stacked.csv')

let labels = csvdata.columns
let subgroups = ['banana', 'poacee', 'sorgho']

let groups = d3.map(csvdata, (d: any) => { 
  return(d.group)
})

let groupKeys = groups.keys()

let scaler = d3PlotLib.Scaler()
.xScale((xs: any) => {
  return d3.scaleBand()
  .domain(groups)
  .padding(0.1)
})
.yScale((ys: any) => {
  return d3.scaleLinear()
  .domain([0, 40])
})

let bars = d3PlotLib.GroupedBarPlot()
.alpha([0.4])
.ys(csvdata)
.labels(['text'])

let legend = d3PlotLib.Legend()

let container = d3PlotLib
  .Container()
  .xAxisLabel('X Axis')
  .yAxisLabel('Y Axis')
  .scale(scaler)
  .plot(bars)
  .legend(legend)

d3.select(ref).call(container)

`