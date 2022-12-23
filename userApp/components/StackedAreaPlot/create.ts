export default `
    let dte1 = new Date(2022, 8)
    let dte2 = new Date(2022, 9)
    let dte3 = new Date(2022, 10)
    let dte4 = new Date(2022, 11)
    let dte5 = new Date(2022, 12)

    let x = [dte1, dte2, dte3, dte4, dte5]

    let y1 = [1, 1, 2, 3, 5]
    let y2 = [0, 4, 2, 6, 8]
    let y3 = [1, 3, 5, 7, 9]
    let labels = ['Fibonacci ', 'Evens', 'Odds']
  
    let scaler = d3PlotLib.Scaler()
    .xScale((xs: any) => {
      return d3.scaleTime()
      .domain(d3.extent(xs))
    })
    .yScale((ys: any) => {
      return d3.scaleLinear()
      .domain([0, 25])
    })
  
    let stackplot = d3PlotLib.StackedArea()
    .xs(x)
    .ys([y1, y2, y3])
    .labels(labels)
  
    let legend = d3PlotLib.Legend()
  
    let container = d3PlotLib
      .Container()
      .xAxisLabel('X label')
      .xAxisText({ rotation: 65 })  
      .yAxisLabel('Y Label')
      .scale(scaler)
      .plot(stackplot)
      .legend(legend)
  
    d3.select(ref).call(container)
`
