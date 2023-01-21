export default `
let csvresult = await d3.csv('assets/heatmap.csv')
  
type Element = {
  country?: string
  product?: string
  value?: any
}

let data = csvresult.map(function (item: any) {
  let newItem: Element = {}
  newItem.country = item.x
  newItem.product = item.y
  newItem.value = item.value

  return newItem
})

let x_elements = d3
  .set(
    data.map(function (item: any) {
      return item.product
    })
  )
  .values()

let y_elements = d3
  .set(
    data.map(function (item: any) {
      return item.country
    })
  )
  .values()

let scaler = d3PlotLib.Scaler()
  .xScale((xs: any) => {
    return d3.scaleBand()
    .domain(x_elements)
    .padding(0.1)
  })
  .yScale((ys: any) => {
    return d3.scaleBand()
    .domain(y_elements)
    .padding(0.1)
    // .bandwidth([0, y_elements.length * itemSize]);
  })

let heatmap = d3PlotLib.Heatmap()
  .ys(data)

let container = d3PlotLib
  .Container()
  .xAxisText({ rotation: 65 })
  .yAxisText({ rotation: -40 })
  .scale(scaler)
  .plot(heatmap)

d3.select(ref).call(container)
`
