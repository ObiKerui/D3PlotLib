
export default `
let csvresult = await d3.csv('assets/iris.csv')
  
let labels = Object.keys(csvresult[0])
labels = labels.slice(0, -1)
let obj: any = labels.reduce((accumulator, value) => {
  return {...accumulator, [value]: []}
}, {})

csvresult.forEach((elem: any) => {
  labels.forEach((e: any) => { 
      obj[e as keyof any].push(+(elem[e]))
  })
  return elem
})

let ys = Object.values(obj)

// sum the values 
let sums = ys.map((y: any) => {
  return d3.sum(y)
})

// get total
let total = sums.reduce((accumulator, value) => {
  return accumulator + value
}, 0)

let percentages = sums.map((y: any) => {
  return y / total
})

let donutPlot = d3PlotLib.DonutPlot()
.ys(percentages)
.labels(labels)

let container = d3PlotLib.Container()
.plot(donutPlot)

d3.select(ref).call(container)
`