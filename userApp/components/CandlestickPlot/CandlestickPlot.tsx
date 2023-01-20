/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from 'react'
import * as d3 from 'd3'
import * as d3PlotLib from '../../../d3PlotLib/main'

import CodeBlock from '../CodeBlock'
import np from '../NumpyClone'
import useCreatePlot from '../UseCreatePlot'
import content from './create'

function preprocessData(csvresult: any) {
  const ys: [] = csvresult.map((elem: any) => ({
    date: Date.parse(elem.Date),
    open: +elem.Open,
    high: +elem.High,
    low: +elem.Low,
    close: +elem.Close,
    volume: +elem['Shares Traded'],
    turnover: +elem['Turnover (Rs. Cr)'],
  }))

  const xs = ys.map((elem: any) => elem.date)

  const ma10Data = d3PlotLib.MovingAverageCalc().window_size(2)

  const ma10 = ma10Data(ys, (elem: any) => elem.close)

  const ma25Data = d3PlotLib.MovingAverageCalc().window_size(10)

  const ma25 = ma25Data(ys, (elem: any) => elem.close)

  return { xs, ys, ma10, ma25 }
}

async function createCandleStick(ref: any) {
  // https://www1.nseindia.com/products/content/equities/indices/historical_index_data.htm
  const csvresult = await d3.csv('assets/candlestick_data_nse.csv')
  const { xs, ys, ma10, ma25 } = preprocessData(csvresult)

  const scaler = d3PlotLib
    .Scaler()
    .xScale((_xs: Iterable<Date>) => d3.scaleTime().domain(d3.extent(_xs)))
    .yScale(() => d3.scaleLinear().domain([17000, 18000]))

  const candlestickPlot = d3PlotLib.CandlestickPlot().xs(xs).ys(ys)

  const ma10Plot = d3PlotLib
    .Plot()
    .xs(xs)
    .ys(ma10)
    .labels('moving average 10')
    .alpha(0.3)
    .styles('--')
    .curve(d3.curveMonotoneX)

  const ma25Plot = d3PlotLib
    .Plot()
    .xs(xs)
    .ys(ma25)
    .labels('moving average 25')
    .alpha(0.3)
    .styles('--')
    .curve(d3.curveMonotoneX)

  const legend = d3PlotLib.Legend()

  const container = (d3PlotLib.Container() as any)
    .xAxisLabel('Time')
    .xAxisText({ rotation: 65 })
    .yAxisLabel('Value')
    .yAxisPosition('right')
    // .yAxisShow(false)
    .scale(scaler)
    .plot(candlestickPlot)
    .plot(ma10Plot)
    .plot(ma25Plot)
    .legend(legend)

  d3.select(ref).call(container)

  return container
}

export default function () {
  const ref = useRef(null)

  useCreatePlot(async () => {
    const currRef = ref.current
    await createCandleStick(currRef)
  })

  return (
    <div className="plot">
      <div className="plot plot--container">
        <h3 id="candlestick-plot">Candlestick Plot</h3>
        <div className="plot plot--area" ref={ref} />
        <div className="plot plot--description">
          <p>
            Candlestick plot is for rendering such n such. Good for which types of visual, bad for
            these others..etc.
          </p>
        </div>
      </div>
      <div className="plot plot--code">
        <CodeBlock content={content} />
      </div>
    </div>
  )
}
