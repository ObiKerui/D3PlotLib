export default `
function preprocessData(csvresult : any) {
    let ys : [] = csvresult.map((elem : any) => {
      return {
        'date' : Date.parse(elem.Date),
        'open' : +elem.Open,
        'high' : +elem.High,
        'low' : +elem.Low,
        'close' : +elem.Close,
        'volume' : +elem['Shares Traded'],
        'turnover' : +elem['Turnover (Rs. Cr)']
      }
    })
  
    let xs = ys.map((elem :any) => {
      return elem.date
    })

    let ma10Data = d3PlotLib.MovingAverageCalc()
    .window_size(2)

    let ma10 = ma10Data(ys, (elem: any) => {
      return (elem.close)
    })

    let ma25Data = d3PlotLib.MovingAverageCalc()
    .window_size(10)

    let ma25 = ma25Data(ys, (elem: any) => {
      return (elem.close)
    })
    
    return { xs, ys, ma10, ma25 }
  }
  
  async function createCandleStick(ref: any) {
    // https://www1.nseindia.com/products/content/equities/indices/historical_index_data.htm
    let csvresult = await d3.csv('assets/candlestick_data_nse.csv')
    let { xs, ys, ma10, ma25 } = preprocessData(csvresult)
  
    let scaler = d3PlotLib.Scaler()
    .xScale((xs : any) => {
      return d3.scaleTime()
      .domain(d3.extent(xs))
    })
    .yScale((ys : any) => {
      return d3.scaleLinear()
      .domain([17000, 18000])
    })
  
    let candlestickPlot = d3PlotLib.CandlestickPlot()
    .xs(xs)
    .ys(ys)
  
    let ma10Plot = d3PlotLib.Plot()
    .xs(xs)
    .ys(ma10)
    .labels('moving average 10')
    .alpha(0.3)
    .styles('--')
    .curve(d3.curveMonotoneX)

    let ma25Plot = d3PlotLib.Plot()
    .xs(xs)
    .ys(ma25)
    .labels('moving average 25')
    .alpha(0.3)
    .styles('--')
    .curve(d3.curveMonotoneX)
  
    let legend = d3PlotLib.Legend()
  
    let container = d3PlotLib.Container()
    .xAxisLabel("Time")
    .xAxisText({ rotation: 65 })  
    .yAxisLabel("Value")
    .yAxisPosition("right")
    .scale(scaler)
    .plot(candlestickPlot)
    .plot(ma10Plot)
    .plot(ma25Plot)
    .legend(legend)
  
    d3.select(ref).call(container)

`